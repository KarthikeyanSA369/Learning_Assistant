import { useState } from 'react';
import '../styles.css';

const DiagramsView = ({ subject, onBack }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  // All diagrams from public/Diagrams/AI folder
  const allDiagrams = [
    'astar.PNG',
    'backward.PNG',
    'bfs.PNG',
    'Casualnetwork.PNG',
    'cspmap.PNG',
    'cspmap2.PNG',
    'depthlimited.PNG',
    'dfs.PNG',
    'forward.PNG',
    'goal.PNG',
    'herustic.PNG',
    'heuristic2.PNG',
    'learning.PNG',
    'localsearchalgorithm.PNG',
    'model.PNG',
    'Monte-carlo-tree.PNG',
    'partially observable games.PNG',
    'probabliticreason.PNG',
    'probabliticreason2.PNG',
    'searchwithnondeterministicagent.PNG',
    'searchwithnondeterministicagentand r.PNG',
    'simple.PNG',
    'stochasticgames.PNG',
    'uniform cost.PNG',
    'utility.PNG',
    'wumpus.PNG',
    'wumpus2.PNG',
  ];

  const diagramItems = allDiagrams.map((name) => ({
    name: name.replace(/\.PNG$/i, ''),
    path: `/Diagrams/AI/${name}`,
  }));

  return (
    <div className="diagrams-view">
      <div className="diagrams-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Questions
        </button>
        <h1>📊 Diagrams - {subject}</h1>
      </div>

      <div className="diagrams-grid">
        {diagramItems.map((diagram, idx) => (
          <div
            key={idx}
            className="diagram-card"
            onClick={() => setSelectedImage(diagram)}
          >
            <div className="diagram-thumbnail">🖼️</div>
            <p className="diagram-name">{diagram.name}</p>
          </div>
        ))}
      </div>

      {/* Modal for Full Image */}
      {selectedImage && (
        <div className="diagram-modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="diagram-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="diagram-modal-close"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            <div className="diagram-modal-image-container">
              <img
                src={selectedImage.path}
                alt={selectedImage.name}
                className="diagram-modal-image"
              />
              <p className="diagram-modal-title">{selectedImage.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagramsView;
