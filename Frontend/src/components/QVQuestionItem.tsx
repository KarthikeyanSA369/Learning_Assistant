import { useState } from 'react';
import '@/styles/questionsviewer.css';

interface QVQuestionItemProps {
  question: string;
  index: number;
}

const QVQuestionItem = ({ question, index }: QVQuestionItemProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(question);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Copy failed - silent error
    }
  };

  return (
    <div className="qv-question-item">
      <div className="qv-question-content">
        <span className="qv-question-number">{index}</span>
        <p className="qv-question-text">{question}</p>
      </div>
      <button
        onClick={handleCopy}
        className={`qv-copy-btn ${copied ? 'copied' : ''}`}
        title={copied ? 'Copied!' : 'Copy question'}
        aria-label={copied ? 'Copied' : 'Copy'}
      >
        {copied ? '✓' : '📋'}
      </button>
    </div>
  );
};

export default QVQuestionItem;
