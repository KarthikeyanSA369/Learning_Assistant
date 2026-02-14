import { useState } from 'react';
import { Send, Zap } from 'lucide-react';
import { useStore } from '@/store';
import { askQuestion } from '@/lib/api';

const InputBar = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentSubject, userId, token, addMessage } = useStore();

  const handleSend = async () => {
    const q = text.trim();
    if (!q || loading || !userId) return;
    
    setText('');
    
    // Add user message
    addMessage({ role: 'user', content: q });
    setLoading(true);
    
    try {
      const res = await askQuestion(userId, currentSubject, q, false, token || undefined);
      
      if (res.error) {
        addMessage({ role: 'assistant', content: res.error });
      } else if (res.answer) {
        // Add assistant message with question reference for deep explanation
        addMessage({ 
          role: 'assistant', 
          content: res.answer,
          question: q 
        });
      } else {
        addMessage({ role: 'assistant', content: 'No response received. Please try again.' });
      }
    } catch (error) {
      addMessage({ role: 'assistant', content: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 border-t border-border bg-card">
      <div className="flex items-center gap-2 max-w-3xl mx-auto">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder={`Ask about ${currentSubject}...`}
          className="flex-1 h-11 px-4 rounded-full bg-muted text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all text-sm"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !text.trim()}
          className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center text-white hover:opacity-90 transition-opacity disabled:opacity-40"
          aria-label="Send"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      {loading && (
        <p className="text-xs text-muted-foreground text-center mt-2 animate-pulse flex items-center justify-center gap-1">
          <Zap className="w-3 h-3" />
          Generating response...
        </p>
      )}
    </div>
  );
};

export default InputBar;
