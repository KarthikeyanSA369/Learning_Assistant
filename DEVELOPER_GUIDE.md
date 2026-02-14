# Developer's Quick Reference Guide

## Project Structure

```
e:\Arivon\
├── Backend/                    # FastAPI + Python
│   ├── faiss_groq_app.py      # Main app (rules, rag, llm)
│   ├── db.py                   # MySQL connection
│   ├── auth.py                 # Authentication routes
│   ├── requirements.txt         # Python dependencies
│   └── vectorstore/            # FAISS indices
│       ├── ai/index.faiss
│       └── ml/index.faiss
│
├── Frontend/                   # React + Vite + TypeScript
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Chat.tsx       # Main chat interface
│   │   │   ├── HistoryViewer.tsx  # Date-based history
│   │   │   ├── Login.tsx       # Auth page
│   │   │   └── ...
│   │   ├── components/
│   │   │   ├── ChatMessage.tsx # With Explain Deeply btn
│   │   │   ├── InputBar.tsx    # Question input
│   │   │   ├── Header.tsx      # App header
│   │   │   └── ...
│   │   ├── lib/
│   │   │   ├── api.ts         # API client
│   │   │   └── questionsData.ts
│   │   ├── store.ts           # Zustand state
│   │   ├── App.tsx            # Main component
│   │   └── index.css          # Tailwind setup
│   ├── index.html
│   └── package.json
│
├── PRODUCTION_REFACTORING.md   # Task completion
├── MIGRATION_GUIDE.md          # Database setup
├── DEPLOYMENT_CHECKLIST.md     # Pre-deploy guide
└── PROJECT_SUMMARY.md          # This overview
```

## Key Files to Know

### Backend Core

**faiss_groq_app.py** (395 lines)
- `classify_question()` - Rule-based classifier (no API call)
- `generate_subject_answer()` - Academic response
- `generate_guidance_answer()` - Mentoring response
- `generate_deep_explanation()` - Extra explanation
- `is_quality_answer()` - Validation
- `/ask` endpoint - Main chat API
- `/history/{user_id}/{date}` - Get day's conversation

**db.py** (10 lines)
- `get_db()` - MySQL connection

**auth.py**
- `/login` - User authentication
- `/signup` - New user registration

### Frontend Core

**store.ts** (90 lines)
- Global state with Zustand
- `ChatMessage` interface with `question` field
- Auth, chat, history state

**App.tsx** (35 lines)
- Routes: `/`, `/chat`, `/history/:date`, `/questions`
- No watermark (removed for branding)

**Chat.tsx** (105 lines)
- Main interface
- `onExplainDeeply` callback
- Passes question to ChatMessage

**ChatMessage.tsx** (90 lines)
- Renders Q&A
- "Explain Deeply" button
- Copy button
- Supports deep explanations

**InputBar.tsx** (70 lines)
- Question input
- Calls `askQuestion()` API
- Tracks questions for deep explanation
- Error handling

**HistoryViewer.tsx** (95 lines)
- Full conversation for date
- Read-only display
- Fetches from `/history/:date` endpoint

**api.ts** (110 lines)
- `askQuestion()` - Main chat call
- `fetchHistoryByDate()` - Get day's messages
- `loginUser()`, `signupUser()`
- Error handling

## Common Modifications

### Add New Subject

Backend (`faiss_groq_app.py`):
```python
SUBJECTS = {
    "ai": "vectorstore/ai",
    "ml": "vectorstore/ml",
    "ds": "vectorstore/ds",  # ADD HERE
}

def map_subject(subject):
    if subject == "Data Science":  # ADD HERE
        return "ds"
    ...
```

Frontend (`src/components/ChatSidebar.tsx`):
```javascript
const SUBJECTS = [
  'Artificial Intelligence',
  'Machine Learning',
  'Data Science'  // ADD HERE
];
```

### Fix RAG Not Working

1. Check FAISS path exists:
   ```bash
   ls Backend/vectorstore/ai/
   # Expected: index.faiss, texts.pkl
   ```

2. Verify embeddings model:
   ```python
   # In faiss_groq_app.py
   embeddings = OllamaEmbeddings(model="nomic-embed-text")
   # Make sure Ollama server is running
   ```

3. Test with:
   ```bash
   python -c "from Backend.faiss_groq_app import load_subject; load_subject('ai')"
   ```

### Adjust Response Quality Threshold

In `faiss_groq_app.py`:

```python
def is_relevant_result(query, raw_context, similarity_threshold=100):
    # Change 100 to lower/higher value
    return len(raw_context) >= similarity_threshold
```

### Change LLM Model

In `faiss_groq_app.py`:

```python
response = client.chat.completions.create(
    messages=[...],
    model="llama-3.1-8b-instant",  # Change this
    temperature=0.3,
    max_tokens=350
)
```

Available Groq models (2024):
- `llama-3.1-8b-instant` (fast)
- `llama-3.1-70b-versatile` (powerful)
- `mixtral-8x7b-32768` (balanced)

### Tweak Classifier Keywords

In `faiss_groq_app.py`, `classify_question()`:

```python
guidance_keywords = [
    "i am stuck", "how to study",
    "YOUR_KEYWORD_HERE",  # Add here
]

subject_keywords = [
    "algorithm", "network",
    "YOUR_KEYWORD_HERE",  # Add here
]
```

### Change Quality Thresholds

```python
def is_quality_answer(answer: str) -> bool:
    # Minimum 50 chars - change this
    if len(answer_clean) < 50:
        return False
    # Too many ellipsis
    if answer_clean.count("...") > 3:  # Change this
        return False
```

### Modify Error Messages

In `InputBar.tsx`:
```tsx
// Current
addMessage({ role: 'assistant', content: 'No answer received. Please try again.' });

// Change to
addMessage({ role: 'assistant', content: 'Your custom error message here' });
```

## API Response Format

### /ask Endpoint

**Request:**
```json
{
  "question": "What is neural network",
  "subject": "Artificial Intelligence",
  "user_id": 1,
  "request_deep_explanation": false
}
```

**Response (Success):**
```json
{
  "answer": "A neural network is...",
  "deep_explanation": null,
  "cached": false,
  "source": "rag",
  "type": "SUBJECT_QUESTION"
}
```

**Response (Error):**
```json
{
  "error": "Unable to generate a reliable answer. Please refine your question.",
  "answer": null
}
```

### /history/{user_id}/{date}

**Response:**
```json
[
  {
    "id": 1,
    "question": "What is AI",
    "answer": "AI is...",
    "subject": "Artificial Intelligence",
    "created_at": "2025-02-09T10:30:00"
  },
  ...
]
```

## Database Queries

### Get user's questions by date

```sql
SELECT * FROM history 
WHERE user_id = 1 AND DATE(created_at) = '2025-02-09'
ORDER BY created_at ASC;
```

### Cache statistics

```sql
SELECT COUNT(*) as total_questions,
       COUNT(DISTINCT question) as unique_questions,
       COUNT(DISTINCT DATE(created_at)) as days_active
FROM history 
WHERE user_id = 1;
```

### Find slow responses

```sql
SELECT question, answer, 
       TIMESTAMPDIFF(SECOND, created_at, NOW()) as age_seconds
FROM history
WHERE LENGTH(answer) < 50  -- Likely quality-filtered
ORDER BY created_at DESC;
```

## Environment Variables

### Backend/.env (REQUIRED)
```env
GROQ_API_KEY=gsk_...your_key_here...
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=aiapp
```

### Frontend/.env.local (Optional)
```env
VITE_API_BASE=http://localhost:8000
```

## Debugging Tips

### Check what type a question is

Add this to backend:
```python
question = "Test question"
qtype = classify_question(question)
print(f"Question type: {qtype}")
```

### Verify RAG is working

```python
from Backend.faiss_groq_app import load_subject, search_faiss

index, texts, embeddings = load_subject("ai")
results = search_faiss("what is neural network", index, texts, embeddings)
print(f"RAG results: {results[:200]}...")  # First 200 chars
```

### Check database connection

```bash
# From Backend directory
python test_connection.py
```

### Monitor LLM calls

Add logging to `generate_subject_answer()`:
```python
print(f"[LLM] Input tokens: {len(prompt.split())}")
print(f"[LLM] Model: llama-3.1-8b-instant")
# After response
print(f"[LLM] Output length: {len(response)} chars")
```

## Performance Profiling

### Measure question processing time

```python
import time

start = time.time()
result = ask(Question(...))
elapsed = time.time() - start
print(f"Total time: {elapsed:.2f}s")
```

### Identify slow components

- RAG search: 200-500ms
- LLM generation: 2-4s
- Quality check: <10ms
- Database: 10-50ms

If response > 5s, likely LLM is slow. Check:
- Groq API rate limits
- Model selection
- Token count in prompt

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| Connection refused | Backend not running | `python -m uvicorn faiss_groq_app:app --reload` |
| MYSQL error | DB not running | Start MySQL, check credentials |
| GROQ API error | Invalid key | Check `GROQ_API_KEY` in .env |
| FAISS error | Missing vectors | Verify `vectorstore/` directory exists |
| 404 on /chat | Route not defined | Check routes in App.tsx |
| State not updating | Zustand issue | Check useStore imports |
| Deep explanation fails | LLM error | Check Groq API quota |

## Build & Deploy

### Development
```bash
# Backend
cd Backend && python -m uvicorn faiss_groq_app:app --reload

# Frontend
cd Frontend && bun run dev
```

### Production Build
```bash
# Frontend
cd Frontend && bun run build
# Output: dist/ folder

# Backend - use gunicorn or similar
# cd Backend && gunicorn faiss_groq_app:app -w 4
```

### Testing
```bash
# Connection test
python test_connection.py

# Component test (if added)
cd Frontend && bun run test
```

## Resources

- **FastAPI Docs**: http://localhost:8000/docs
- **Groq API**: https://console.groq.com/
- **FAISS Docs**: https://faiss.ai/
- **React Docs**: https://react.dev/
- **Zustand**: https://github.com/pmndrs/zustand

## Code Style

- **TypeScript**: Strict mode enabled
- **Python**: PEP 8 style
- **Naming**: camelCase for JS, snake_case for Python
- **Components**: Functional components only (Hooks)
- **State**: Zustand for global, useState for local

## Maintenance Schedule

**Daily**
- Monitor response times
- Check error logs
- Verify API quotas

**Weekly**
- Review user feedback
- Check database growth
- Update dependencies

**Monthly**
- Performance analysis
- Feature planning
- Documentation updates

---

**Last Updated:** February 9, 2026
**For Questions**: See PROJECT_SUMMARY.md or PRODUCTION_REFACTORING.md
