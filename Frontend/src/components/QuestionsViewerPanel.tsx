import { useState, useMemo } from 'react';
import QVQuestionItem from './QVQuestionItem';
import '@/styles/questionsviewer.css';

interface QuestionsPanelProps {
  subject: string;
  subjectData: {
    partA: string[];
    partB: string[];
    important: string[];
  };
  subjectName: string;
}

const QuestionsViewerPanel = ({
  subject,
  subjectData,
  subjectName,
}: QuestionsPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const sections = [
    { id: 'partA', title: 'PART A — 2 MARK QUESTIONS', questions: subjectData.partA },
    { id: 'partB', title: 'PART B — LONG ANSWER QUESTIONS', questions: subjectData.partB },
    { id: 'important', title: '⭐ IMPORTANT QUESTIONS', questions: subjectData.important },
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Filter questions based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) {
      return sections;
    }

    const query = searchQuery.toLowerCase();
    return sections
      .map((section) => ({
        ...section,
        questions: section.questions.filter((q) =>
          q.toLowerCase().includes(query)
        ),
      }))
      .filter((section) => section.questions.length > 0);
  }, [searchQuery]);

  return (
    <div className="qv-questions-panel">
      <div className="qv-panel-header">
        <h1>{subjectName}</h1>
        <div className="qv-search-box">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="qv-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="qv-clear-search"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {filteredSections.length === 0 ? (
        <div className="qv-no-results">
          <p>No questions found matching "{searchQuery}"</p>
        </div>
      ) : (
        <div className="qv-sections-container">
          {filteredSections.map((section) => (
            <div key={section.id} className="qv-section">
              <button
                className={`qv-section-title ${expandedSections[section.id] ? 'expanded' : ''}`}
                onClick={() => toggleSection(section.id)}
              >
                <span className="qv-section-toggle">
                  {expandedSections[section.id] ? '▼' : '▶'}
                </span>
                <span>{section.title}</span>
                <span className="qv-section-count">({section.questions.length})</span>
              </button>

              {expandedSections[section.id] && (
                <div className="qv-questions-list">
                  {section.questions.map((question, index) => (
                    <QVQuestionItem
                      key={`${section.id}-${index}`}
                      question={question}
                      index={index + 1}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionsViewerPanel;
