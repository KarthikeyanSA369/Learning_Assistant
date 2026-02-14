import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '@/styles/questionsviewer.css';

interface DiagramsViewProps {
  subject: string | null;
  onBack: () => void;
}

interface DiagramImage {
  name: string;
  path: string;
}

const DiagramsView = ({ subject, onBack }: DiagramsViewProps) => {
  const [selectedImage, setSelectedImage] = useState<DiagramImage | null>(null);
  const [images, setImages] = useState<DiagramImage[]>([]);

  useEffect(() => {
    // Load images from public/Diagrams/AI folder
    const loadImages = async () => {
      try {
        // List of all images in AI folder
        const aiImages = [
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

        const subjectKey = subject === 'Artificial Intelligence' ? 'AI' : 'ML';
        const loadedImages = aiImages.map((name) => ({
          name: name.replace(/\.PNG$/i, ''),
          path: `/Diagrams/${subjectKey}/${name}`,
        }));

        setImages(loadedImages);
      } catch (error) {
        // Image loading failed - silent error
      }
    };

    loadImages();
  }, [subject]);

  return (
    <div className="qv-diagrams-minimal">
      {/* Header with Back Button */}
      <div className="qv-diagrams-minimal-header">
        <button className="qv-back-btn" onClick={onBack}>
          ← Back
        </button>
        <h2>{subject}</h2>
      </div>

      {/* Minimal Grid */}
      <div className="qv-diagrams-grid-minimal">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="qv-diagram-thumb"
            onClick={() => setSelectedImage(img)}
          >
            <div className="qv-thumb-image">🖼️</div>
            <p className="qv-thumb-name">{img.name}</p>
          </div>
        ))}
      </div>

      {/* Modal for Expanded Image */}
      {selectedImage && (
        <div className="qv-modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="qv-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="qv-modal-close"
              onClick={() => setSelectedImage(null)}
            >
              <X size={28} />
            </button>
            <div className="qv-modal-image-container">
              <img
                src={selectedImage.path}
                alt={selectedImage.name}
                className="qv-modal-image-actual"
              />
              <p className="qv-modal-title">{selectedImage.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagramsView;
