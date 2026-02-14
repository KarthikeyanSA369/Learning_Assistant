import '../styles.css';

const Sidebar = ({ subjects, selectedSubject, onSelectSubject, onSelectDiagram }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>📚 Subjects</h2>
      </div>
      <nav className="subjects-list">
        {subjects.map((subject) => (
          <button
            key={subject}
            className={`subject-btn ${selectedSubject === subject ? 'active' : ''}`}
            onClick={() => onSelectSubject(subject)}
          >
            {subject}
          </button>
        ))}
      </nav>

      <div className="sidebar-divider"></div>

      <div className="diagrams-section">
        <div className="diagrams-header-mini">
          <h3>📊 Diagrams of Topics</h3>
        </div>
        <nav className="diagrams-list">
          {subjects.map((subject) => (
            <button
              key={`diagram-${subject}`}
              className="diagram-btn"
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

export default Sidebar;
