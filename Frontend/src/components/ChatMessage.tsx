import { useState } from 'react';
import { Bot, User, Copy, Check, Lightbulb } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '@/store';

interface ChatMessageProps {
  msg: ChatMessageType;
  onExplainDeeply?: (question: string) => void;
  messageIndex?: number;
}

const ChatMessage = ({ msg, onExplainDeeply, messageIndex }: ChatMessageProps) => {
  const isUser = msg.role === 'user';
  const [copied, setCopied] = useState(false);
  const [showDeepExplanation, setShowDeepExplanation] = useState(false);
  const [deepExplanation, setDeepExplanation] = useState<string | null>(null);
  const [isLoadingDeep, setIsLoadingDeep] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(msg.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Copy failed silently
    }
  };

  const handleExplainDeeply = async () => {
    if (deepExplanation || !onExplainDeeply) return;
    
    setIsLoadingDeep(true);
    // Call parent to request deep explanation
    onExplainDeeply(msg.question || '');
    setShowDeepExplanation(true);
    setIsLoadingDeep(false);
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center flex-shrink-0 mt-1">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      <div className={`max-w-[75%] ${!isUser ? 'flex flex-col gap-2' : ''}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : 'bg-muted text-foreground rounded-bl-md'
          }`}
        >
          {msg.content}
        </div>

        {/* Copy and Explain Deeply Buttons - Only for assistant messages with non-empty content */}
        {!isUser && msg.content && msg.content.trim().length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-all duration-200 ${
                copied
                  ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                  : 'bg-black/10 text-foreground/40 hover:text-foreground/80 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20'
              }`}
              title={copied ? 'Copied!' : 'Copy message'}
              aria-label={copied ? 'Copied' : 'Copy'}
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={handleExplainDeeply}
              disabled={isLoadingDeep}
              className="flex items-center gap-2 text-xs font-medium text-accent-color hover:bg-muted/50 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              {isLoadingDeep ? 'Generating...' : 'Explain Deeply'}
            </button>
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
