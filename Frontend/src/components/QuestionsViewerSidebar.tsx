import '@/styles/questionsviewer.css';

interface SidebarProps {
  subjects: string[];
  selectedSubject: string;
  onSelectSubject: (subject: string) => void;
  onSelectDiagram: (subject: string) => void;
}

const QuestionsViewerSidebar = ({
  subjects,
  selectedSubject,
  onSelectSubject,
  onSelectDiagram,
}: SidebarProps) => {
  return (
    <aside className="qv-sidebar">
      <div className="qv-sidebar-header">
        <h2>📚 Subjects</h2>
      </div>
      <nav className="qv-subjects-list">
        {subjects.map((subject) => (
          <button
            key={subject}
            className={`qv-subject-btn ${selectedSubject === subject ? 'active' : ''}`}
            onClick={() => onSelectSubject(subject)}
          >
            {subject}
          </button>
        ))}
      </nav>

      <div className="qv-sidebar-divider"></div>

      <div className="qv-diagrams-section">
        <div className="qv-diagrams-header-mini">
          <h3>📊 Diagrams of Topics</h3>
        </div>
        <nav className="qv-diagrams-list">
          {subjects.filter(subject => subject !== 'Machine Learning').map((subject) => (
            <button
              key={`diagram-${subject}`}
              className="qv-diagram-btn"
              onClick={() => onSelectDiagram(subject)}
            >
              {subject}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default QuestionsViewerSidebar;
