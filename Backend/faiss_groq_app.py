from fastapi import FastAPI
from pydantic import BaseModel
from groq import Groq
import faiss
import pickle
import numpy as np
import re
from db import get_db
from fastapi.middleware.cors import CORSMiddleware
from langchain_ollama import OllamaEmbeddings
from auth import router as auth_router
import os
from dotenv import load_dotenv

load_dotenv()

# ================= CONFIG =================

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

SUBJECTS = {
    "ai": "vectorstore/ai",
    "ml": "vectorstore/ml",
}

client = Groq(api_key=GROQ_API_KEY)

app = FastAPI()
app.include_router(auth_router)

# ================= CORS =================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= LOAD FAISS =================

def load_subject(subject):
    path = SUBJECTS.get(subject)
    if not path:
        raise ValueError(f"Subject not found: {subject}")

    index = faiss.read_index(f"{path}/index.faiss")
    with open(f"{path}/texts.pkl", "rb") as f:
        texts = pickle.load(f)

    embeddings = OllamaEmbeddings(model="nomic-embed-text")
    return index, texts, embeddings

# ================= TEXT UTILITIES =================

def clean_text(text):
    text = re.sub(r'\\begin\{.*?\}', '', text)
    text = re.sub(r'\\end\{.*?\}', '', text)
    text = re.sub(r'\\[a-zA-Z]+', '', text)
    text = re.sub(r'%.*', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def limit_text(text, max_chars=1200):
    return text[:max_chars]

def extract_text(obj):
    if isinstance(obj, str):
        return obj
    if hasattr(obj, "page_content"):
        return obj.page_content
    if isinstance(obj, dict):
        return obj.get("page_content", str(obj))
    return str(obj)

# ================= SIMILARITY THRESHOLD =================

def is_relevant_result(query, raw_context, similarity_threshold=100):
    """Check if RAG result is relevant (minimum 100 chars of content)"""
    return len(raw_context) >= similarity_threshold and raw_context.strip() != ""

# ================= RULE-BASED QUERY CLASSIFIER =================

def classify_question(question: str) -> str:
    """
    Classify question into 3 types without making extra API calls.
    Uses keyword detection only.

    Returns: "SUBJECT_QUESTION", "GUIDANCE_QUESTION", or "GENERAL_CHAT"
    """
    q_lower = question.lower().strip()
    word_count = len(q_lower.split())
    
    # ISSUE 4: For single words or very short queries, treat as general chat
    # These should get short LLM responses, not RAG
    if word_count <= 1:
        return "GENERAL_CHAT"
    
    # Very short queries (2-3 words) without academic keywords = general chat
    if word_count <= 3 and not any(kw in q_lower for kw in ['what', 'why', 'how', 'define', 'explain']):
        return "GENERAL_CHAT"

    # GUIDANCE_QUESTION keywords (student mentoring)
    guidance_keywords = [
        "i am stuck", "i'm stuck", "what should i do", "how to study", 
        "i don't understand", "dont understand", "how to prepare", 
        "i feel confused", "guide me", "i need help", "help me",
        "confused", "struggle", "how do i", "how should i", "lost",
        "advice", "tips", "studying", "motivation", "prepare"
    ]

    # SUBJECT_QUESTION keywords (academic content)
    subject_keywords = [
        "what is", "whats", "define", "explain", "algorithm", "theory",
        "concept", "formula", "model", "architecture", "system", "process",
        "method", "technique", "approach", "difference between", "difference",
        "why", "when", "how does", "describe", "analyze", "discuss",
        "case", "example", "implementation", "network", "machine", "learning",
        "neural", "classification", "regression", "clustering", "algorithm",
        "data", "feature", "model", "training", "testing", "validation"
    ]

    # JUNK/GREETING detection
    greeting_keywords = ["hi", "hello", "hey", "bye", "goodbye", "thanks", "ok", "yes", "no"]

    # Check for GUIDANCE_QUESTION
    for keyword in guidance_keywords:
        if keyword in q_lower:
            return "GUIDANCE_QUESTION"

    # Check for SUBJECT_QUESTION
    for keyword in subject_keywords:
        if keyword in q_lower:
            return "SUBJECT_QUESTION"

    # Check for greetings
    for keyword in greeting_keywords:
        if q_lower == keyword or q_lower.startswith(keyword):
            return "GENERAL_CHAT"

    # If word count is too short, treat as general chat
    if word_count < 4:
        return "GENERAL_CHAT"

    # Default: treat as subject question
    return "SUBJECT_QUESTION"

# ================= SEARCH =================

def search_faiss(query, index, texts, embeddings):
    vec = embeddings.embed_query(query)
    vec = np.array(vec, dtype="float32").reshape(1, -1)

    _, idx = index.search(vec, 3)

    results = []
    for i in idx[0]:
        if i < len(texts):
            results.append(extract_text(texts[i]))

    return " ".join(results)

# ================= MODELS =================

class Question(BaseModel):
    question: str
    subject: str
    user_id: int
    request_deep_explanation: bool = False

# ================= SUBJECT MAP =================

def map_subject(subject):
    if subject == "Artificial Intelligence":
        return "ai"
    if subject == "Machine Learning":
        return "ml"
    return subject.lower()

# ================= RESPONSE SANITIZATION =================

def sanitize_response(text: str) -> str:
    """Clean response before saving to database"""
    if not isinstance(text, str):
        return ""
    
    # Remove non-printable characters (keep only printable ASCII and common unicode)
    text = ''.join(char for char in text if ord(char) >= 32 or char in '\n\r\t')
    
    # Remove backspace characters
    text = text.replace('\u0008', '')
    
    # Remove broken unicode sequences
    text = text.encode('utf-8', errors='ignore').decode('utf-8')
    
    # Clean up excessive whitespace
    text = '\n'.join(line.rstrip() for line in text.split('\n'))
    
    return text.strip()

# ================= ANSWER QUALITY CONTROL =================

def is_quality_answer(answer: str) -> bool:
    """Check if answer meets minimum quality standards"""
    if not answer or not isinstance(answer, str):
        return False
    
    answer_clean = answer.strip()
    
    # Check for minimum length
    if len(answer_clean) < 50:
        return False
    
    # Check if it's just empty structure
    if answer_clean.count("\n") > 20 and len(answer_clean) < 200:
        return False
    
    # Check for obvious nonsense patterns
    if answer_clean.count("...") > 3:
        return False
    
    # Check for repeated words (corrupted text indicator)
    words = answer_clean.lower().split()
    if len(words) > 5:
        # Check if same word repeats too much
        word_counts = {}
        for word in words:
            word_counts[word] = word_counts.get(word, 0) + 1
        # If any word appears more than 30% of total, it's likely corrupted
        for count in word_counts.values():
            if count > len(words) * 0.3:
                return False
    
    # Check for strange repeated patterns like "eta eta eta"
    if 'eta eta eta' in answer_clean.lower():
        return False
    
    # Check for broken unicode or encoding issues
    if '\ufffd' in answer_clean or answer_clean.count('?') > len(answer_clean) * 0.2:
        return False
    
    return True

# ================= LLM GENERATION =================

def generate_subject_answer(question: str, context: str = None) -> str:
    """Generate academic answer - either with RAG context or pure LLM"""
    
    # ISSUE 4: Check if this is a simple single word or very short query
    word_count = len(question.split())
    if word_count <= 3 and not any(kw in question.lower() for kw in ['what', 'why', 'how', 'difference', 'compare']):
        # Simple word/phrase - request SHORT answer
        system_prompt = "You are a concise academic assistant. Answer in 3-4 sentences max using plain English. Be direct."
        prompt = f"Explain briefly: {question}"
    else:
        # BOTH RAG AND PURE LLM use same format
        system_prompt = """Answer as expert with structured format:
[Title] [Definition] [Explanation] [Key Points]
Use simple words. Max 250 words. Don't fabricate. Say if unsure."""

        if context and len(context) > 100:
            # WITH RAG CONTEXT
            prompt = f"""Material: {context}

Q: {question}

Answer based on material only."""
        else:
            # WITHOUT RAG CONTEXT - Pure LLM
            prompt = f"Q: {question}\n\nAnswer clearly."

    response = client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        model="llama-3.1-8b-instant",
        temperature=0.3,
        max_tokens=350
    )

    return response.choices[0].message.content

def generate_guidance_answer(question: str) -> str:
    """Generate mentoring/guidance response for student support"""
    
    system_prompt = """You are a supportive mentor. Give practical, actionable advice in simple English with step-by-step guidance. Be encouraging. Max 200 words."""

    prompt = f"Student asks: {question}\n\nRespond with practical mentor guidance."

    response = client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        model="llama-3.1-8b-instant",
        temperature=0.5,
        max_tokens=300
    )

    return response.choices[0].message.content

def generate_deep_explanation(question: str, original_answer: str) -> str:
    """Generate a second, different explanation with analogy for deeper understanding"""
    
    system_prompt = """Explain using real-world analogy. Use simple 8th-grade English. Focus on intuition not formulas. Max 180 words."""

    prompt = f"""Q: {question}
Original answer: {original_answer}

Explain differently using a relatable analogy."""

    response = client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        model="llama-3.1-8b-instant",
        temperature=0.6,
        max_tokens=300
    )

    return response.choices[0].message.content

# ================= ASK API =================

@app.post("/ask")
def ask(q: Question):
    subject_key = map_subject(q.subject)
    db = get_db()
    cur = db.cursor(dictionary=True)

    # ===== CACHE CHECK =====
    cur.execute(
        "SELECT answer, analogy FROM history WHERE question=%s AND user_id=%s LIMIT 1",
        (q.question, q.user_id)
    )
    cached_row = cur.fetchone()

    if cached_row and not q.request_deep_explanation:
        cur.close()
        db.close()
        return {
            "answer": cached_row["answer"],
            "deep_explanation": None,
            "cached": True,
            "source": "cache"
        }

    # If requesting deep explanation of cached answer
    if cached_row and q.request_deep_explanation:
        try:
            deep_exp = generate_deep_explanation(q.question, cached_row["answer"])
            cur.close()
            db.close()
            return {
                "answer": cached_row["answer"],
                "deep_explanation": deep_exp,
                "cached": True,
                "source": "deep_explanation"
            }
        except Exception as e:
            cur.close()
            db.close()
            return {
                "answer": cached_row["answer"],
                "error": "Could not generate deep explanation",
                "cached": True
            }

    # ===== CLASSIFY QUESTION =====
    question_type = classify_question(q.question)

    # ===== GENERATE ANSWER =====
    try:
        if question_type == "GUIDANCE_QUESTION":
            # Skip RAG, use mentoring mode
            answer = generate_guidance_answer(q.question)
            source = "mentoring"
        else:
            # SUBJECT_QUESTION or GENERAL_CHAT
            # Try RAG for subject question, skip for general chat
            context = None
            source = "llm"

            if question_type == "SUBJECT_QUESTION":
                try:
                    index, texts, embeddings = load_subject(subject_key)
                    raw_context = search_faiss(q.question, index, texts, embeddings)
                    context = clean_text(raw_context)
                    context = limit_text(context, max_chars=1500)

                    # Check if context is relevant
                    if not is_relevant_result(q.question, context):
                        context = None
                    else:
                        source = "rag"
                except Exception:
                    context = None

            answer = generate_subject_answer(q.question, context)

        # ===== QUALITY CHECK =====
        if not is_quality_answer(answer):
            cur.close()
            db.close()
            return {
                "error": "Unable to generate a reliable answer. Please refine your question.",
                "answer": None
            }

        # ===== SANITIZE AND SAVE TO DATABASE =====
        # ISSUE 3: Sanitize response before saving
        sanitized_answer = sanitize_response(answer)
        
        try:
            cur.execute(
                "INSERT INTO history (user_id, question, answer, subject) VALUES (%s, %s, %s, %s)",
                (q.user_id, q.question, sanitized_answer, q.subject)
            )
            db.commit()
        except Exception as e:
            db.rollback()

        cur.close()
        db.close()

        # ISSUE 5: Return sanitized answer to frontend
        return {
            "answer": sanitized_answer,
            "deep_explanation": None,
            "cached": False,
            "source": source,
            "type": question_type
        }

    except Exception as e:
        cur.close()
        db.close()
        return {
            "error": "Unable to generate a reliable answer. Please refine your question.",
            "answer": None
        }

# ================= HISTORY API =================

@app.get("/history/{user_id}")
def get_history(user_id: int):
    """Returns user's question history"""
    db = get_db()
    cur = db.cursor(dictionary=True)

    cur.execute("""
        SELECT 
            id,
            question,
            answer,
            subject,
            DATE(created_at) as date,
            created_at
        FROM history
        WHERE user_id=%s
        ORDER BY created_at DESC
    """, (user_id,))

    rows = cur.fetchall()
    cur.close()
    db.close()

    return rows

@app.get("/history/{user_id}/{date}")
def get_history_by_date(user_id: int, date: str):
    """Returns all messages for a specific user and date"""
    db = get_db()
    cur = db.cursor(dictionary=True)

    cur.execute("""
        SELECT 
            id,
            question,
            answer,
            subject,
            created_at
        FROM history
        WHERE user_id=%s AND DATE(created_at)=%s
        ORDER BY created_at ASC
    """, (user_id, date))

    rows = cur.fetchall()
    cur.close()
    db.close()

    return rows

# ISSUE 2: Delete history endpoint
@app.delete("/history/{user_id}/{date}")
def delete_history_by_date(user_id: int, date: str):
    """Delete all messages for a specific user and date"""
    db = get_db()
    cur = db.cursor()
    
    try:
        cur.execute(
            "DELETE FROM history WHERE user_id=%s AND DATE(created_at)=%s",
            (user_id, date)
        )
        db.commit()
        rows_deleted = cur.rowcount
        cur.close()
        db.close()
        
        return {
            "success": True,
            "message": f"Deleted {rows_deleted} messages from {date}",
            "rows_deleted": rows_deleted
        }
    except Exception as e:
        db.rollback()
        cur.close()
        db.close()
        return {
            "success": False,
            "message": "Failed to delete history",
            "error": str(e)
        }
