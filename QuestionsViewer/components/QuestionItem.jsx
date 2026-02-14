import { useState } from 'react';
import '../styles.css';

const QuestionItem = ({ question, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(question);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="question-item">
      <div className="question-content">
        <span className="question-number">{index}</span>
        <p className="question-text">{question}</p>
      </div>
      <button
        onClick={handleCopy}
        className={`copy-btn ${copied ? 'copied' : ''}`}
        title={copied ? 'Copied!' : 'Copy question'}
        aria-label={copied ? 'Copied' : 'Copy'}
      >
        {copied ? '✓' : '📋'}
      </button>
    </div>
  );
};

export default QuestionItem;
