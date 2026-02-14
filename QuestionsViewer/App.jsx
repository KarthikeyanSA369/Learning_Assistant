import { useState } from 'react';
import Sidebar from './components/Sidebar';
import QuestionsPanel from './components/QuestionsPanel';
import DiagramsView from './components/DiagramsView';
import { questionsData } from './data';
import './styles.css';

function App() {
  const subjects = Object.keys(questionsData);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [viewMode, setViewMode] = useState('questions'); // 'questions' or 'diagrams'
  const [diagramSubject, setDiagramSubject] = useState(null);

  const currentData = questionsData[selectedSubject];

  const handleSelectDiagram = (subject) => {
    setDiagramSubject(subject);
    setViewMode('diagrams');
  };

  const handleBackToquestions = () => {
    setViewMode('questions');
    setDiagramSubject(null);
  };

  return (
    <div className="app-container">
      <Sidebar
        subjects={subjects}
        selectedSubject={selectedSubject}
        onSelectSubject={setSelectedSubject}
        onSelectDiagram={handleSelectDiagram}
      />
      
      {viewMode === 'questions' ? (
        <QuestionsPanel
          subject={selectedSubject}
          subjectData={currentData}
          subjectName={selectedSubject}
        />
      ) : (
        <DiagramsView
          subject={diagramSubject}
          onBack={handleBackToquestions}
        />
      )}
    </div>
  );
}

export default App;
