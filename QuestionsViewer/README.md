# Questions Viewer - Exam Preparation UI

A modern React-based exam preparation tool for browsing important questions and topics organized by subject.

## Features

✅ **Multi-Subject Support** - Browse questions for different subjects
✅ **Collapsible Sections** - Organize questions into expandable categories
✅ **Search Functionality** - Filter questions instantly within a subject
✅ **Copy Button** - Copy any question with one click
✅ **Responsive Design** - Works great on desktops, tablets, and mobile devices
✅ **Offline Ready** - All data stored locally, no API calls needed
✅ **Beautiful UI** - Modern gradient design with smooth animations

## Project Structure

```
QuestionsViewer/
├── index.html              # HTML entry point
├── main.jsx                # React app entry
├── App.jsx                 # Main app component
├── styles.css              # Global styles
├── data.js                 # Question database
├── vite.config.js          # Vite config
├── package.json            # Dependencies
└── components/
    ├── Sidebar.jsx         # Subject selector
    ├── QuestionsPanel.jsx  # Main questions display with search
    └── QuestionItem.jsx    # Individual question card
```

## Installation

```bash
cd QuestionsViewer
npm install
```

## Running the App

### Development Mode
```bash
npm run dev
```
This starts the Vite dev server at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm preview
```

## Usage

1. **Select a Subject** - Click on any subject in the left sidebar
2. **Expand Sections** - Click on section titles to expand/collapse question lists
3. **Search Questions** - Use the search box to filter questions by keyword
4. **Copy Questions** - Hover over a question and click the copy button (📋) to copy to clipboard

## Subjects Included

- **Artificial Intelligence**
  - Part A: 2 Mark Questions (38 questions)
  - Part B & C: Golden Questions (36 questions)

- **Machine Learning**
  - Part A: 2 Mark Questions (35 questions)
  - Part B: Long Answer Questions (35 questions)

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **CSS3** - Styling with gradients and animations
- **JavaScript ES6+** - Modern JavaScript

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Features Detail

### Copy Button
- **Default**: Semi-transparent, visible on hover
- **Hover State**: Becomes more visible
- **Clicked State**: Shows checkmark for 2 seconds
- **Text**: Automatically copied to clipboard

### Search
- Real-time filtering across questions
- Case-insensitive matching
- Shows question count per section
- Clear button to reset search

### Responsive
- Desktop: Full sidebar + panel layout
- Tablet: Horizontal subject list + panel
- Mobile: Single column with scrolling

## Customization

### Adding More Subjects

Edit `data.js`:
```javascript
export const questionsData = {
  "Your Subject": {
    sections: [
      {
        id: "unique-id",
        title: "Section Title",
        questions: ["Q1", "Q2", ...]
      }
    ]
  }
}
```

### Styling

Modify `styles.css` to customize:
- Colors: Update gradient colors in `.sidebar` and `.section-title`
- Fonts: Modify the base font-family in `body`
- Spacing: Adjust padding and margins as needed

## License

MIT

## Author

Created for exam preparation

---

**Happy Learning!** 📚✨
