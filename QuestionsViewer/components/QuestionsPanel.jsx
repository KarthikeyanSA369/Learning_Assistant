import { useState, useMemo } from 'react';
import QuestionItem from './QuestionItem';
import '../styles.css';

const QuestionsPanel = ({ subject, subjectData, subjectName }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState({});

  const sections = [
    { id: 'partA', title: 'PART A — 2 MARK QUESTIONS', questions: subjectData.partA },
    { id: 'partB', title: 'PART B — LONG ANSWER QUESTIONS', questions: subjectData.partB },
    { id: 'important', title: '⭐ IMPORTANT QUESTIONS', questions: subjectData.important }
  ];

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
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
        )
      }))
      .filter((section) => section.questions.length > 0);
  }, [searchQuery]);

  return (
    <div className="questions-panel">
      <div className="panel-header">
        <h1>{subjectName}</h1>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="clear-search"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {filteredSections.length === 0 ? (
        <div className="no-results">
          <p>No questions found matching "{searchQuery}"</p>
        </div>
      ) : (
        <div className="sections-container">
          {filteredSections.map((section) => (
            <div key={section.id} className="section">
              <button
                className={`section-title ${expandedSections[section.id] ? 'expanded' : ''}`}
                onClick={() => toggleSection(section.id)}
              >
                <span className="section-toggle">
                  {expandedSections[section.id] ? '▼' : '▶'}
                </span>
                <span>{section.title}</span>
                <span className="section-count">({section.questions.length})</span>
              </button>

              {expandedSections[section.id] && (
                <div className="questions-list">
                  {section.questions.map((question, index) => (
                    <QuestionItem
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

export default QuestionsPanel;
