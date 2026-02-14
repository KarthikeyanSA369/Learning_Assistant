# Component Documentation

## 📊 Component Hierarchy

```
App (State Manager)
├── Sidebar
│   └── Subject Buttons
└── QuestionsPanel
    ├── Search Box
    └── Sections
        └── QuestionItem (x N)
            ├── Question Number
            ├── Question Text
            └── Copy Button
```

## 🔄 Data Flow

```
data.js (Static Data)
    ↓
App.jsx (selectedSubject state)
    ├→ Sidebar (Props: subjects, selectedSubject, onSelectSubject)
    └→ QuestionsPanel (Props: sections, subjectName)
        └→ QuestionItem (Props: question, index)
```

## 📦 Component Details

### App.jsx
**Purpose**: Main application component, state management

**State**:
- `selectedSubject`: Current selected subject

**Props Passed**:
- `Sidebar`: subjects, selectedSubject, onSelectSubject
- `QuestionsPanel`: sections, subjectName

**Key Features**:
- Loads all subjects from data.js
- Manages subject switching
- Passes filtered data to child components

**Lines of Code**: 24

---

### Sidebar.jsx
**Purpose**: Subject navigation sidebar

**Props**:
- `subjects` (array): List of subject names
- `selectedSubject` (string): Currently selected subject
- `onSelectSubject` (function): Callback to change subject

**State**: None (stateless functional component)

**Key Features**:
- Purple gradient background
- Active state indicator
- Hover animations
- Scrollable on mobile
- Responsive flex layout

**Styling Classes**:
- `.sidebar`: Main container
- `.sidebar-header`: Title section
- `.subjects-list`: Container for buttons
- `.subject-btn`: Individual subject button
- `.subject-btn.active`: Active subject styling

**Lines of Code**: 25

---

### QuestionsPanel.jsx
**Purpose**: Main panel displaying questions with search and filters

**Props**:
- `sections` (array): Array of section objects with questions
- `subjectName` (string): Name of current subject

**State**:
- `searchQuery` (string): Current search text
- `expandedSections` (object): Track which sections are expanded

**Key Features**:
- Search box with real-time filtering
- Collapsible sections with animation
- Question count per section
- Clear button for search
- No results message
- useMemo hook for performance optimization

**Functions**:
- `toggleSection(sectionId)`: Toggle section expansion
- `filteredSections` (computed): Filtered questions based on search

**Styling Classes**:
- `.questions-panel`: Main container
- `.panel-header`: Header with title and search
- `.search-box`: Search input container
- `.search-input`: Input field
- `.clear-search`: Clear button
- `.sections-container`: Scrollable section container
- `.section`: Individual section
- `.section-title`: Section header button
- `.questions-list`: Questions list container

**Lines of Code**: 68

---

### QuestionItem.jsx
**Purpose**: Individual question card with copy button

**Props**:
- `question` (string): Question text
- `index` (number): Question number

**State**:
- `copied` (boolean): Show copy feedback state

**Key Features**:
- Semi-transparent copy button (visible on hover)
- Click handler for clipboard copy
- 2-second feedback animation
- Emoji icon feedback (📋 → ✓)
- Smooth transitions

**Functions**:
- `handleCopy()`: Copy text to clipboard, show feedback

**Styling Classes**:
- `.question-item`: Main container
- `.question-content`: Content wrapper
- `.question-number`: Question number
- `.question-text`: Question text
- `.copy-btn`: Copy button
- `.copy-btn.copied`: Copied state styling

**Lines of Code**: 35

---

## 📄 data.js

**Purpose**: Central data storage for all questions

**Structure**:
```javascript
questionsData = {
  "Subject Name": {
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

**Content**:
- **Artificial Intelligence**: 2 sections, 74 questions
- **Machine Learning**: 2 sections, 70 questions
- **Total**: 144 questions

**No external dependencies**: All data is hardcoded

---

## 🎨 styles.css

**Key Features**:
- Mobile-first responsive design
- Purple gradient theme (#667eea, #764ba2)
- Smooth animations (0.3s transitions)
- Custom scrollbar styling
- Accessible color contrast
- Dark mode compatible

**Main Sections**:
1. Reset & Base Styles
2. App Layout
3. Sidebar Styling
4. Questions Panel Styling
5. Sections & Questions
6. Copy Button Styling
7. Responsive Media Queries
8. Scrollbar Customization

**Lines of Code**: ~700

---

## 🔌 State Management

### Global State (App.jsx)
```javascript
const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
```

### Local State (QuestionsPanel.jsx)
```javascript
const [searchQuery, setSearchQuery] = useState('');
const [expandedSections, setExpandedSections] = useState({});
```

### Local State (QuestionItem.jsx)
```javascript
const [copied, setCopied] = useState(false);
```

---

## 🔄 Event Handlers

### Subject Selection
```
User clicks subject button
→ onSelectSubject() called in Sidebar
→ setSelectedSubject() in App
→ App re-renders with new sections
→ QuestionsPanel receives new data
```

### Search
```
User types in search box
→ setSearchQuery() updates state
→ useMemo re-filters questions
→ UI updates with filtered results
```

### Copy Action
```
User clicks copy button
→ handleCopy() in QuestionItem
→ navigator.clipboard.writeText()
→ setCopied(true) for visual feedback
→ setTimeout after 2 seconds resets state
```

### Section Toggle
```
User clicks section title
→ toggleSection(id) in QuestionsPanel
→ expandedSections state updates
→ Conditional rendering of questions
→ Smooth animation on display
```

---

## 🎯 Performance Optimizations

1. **useMemo Hook**: Filter operations only run when searchQuery or sections change
2. **Conditional Rendering**: Questions render only when section is expanded
3. **CSS Animations**: Use transform for smooth 60fps transforms
4. **Event Delegation**: Button click handling is efficient
5. **Lazy Rendering**: Questions only render when section is opened

---

## 🔐 Accessibility Features

- **ARIA Labels**: Buttons have meaningful aria-label attributes
- **Keyboard Navigation**: All buttons are keyboard accessible
- **Color Contrast**: Text colors meet WCAG AA standards
- **Semantic HTML**: Proper use of <button>, <input>, etc.
- **Screen Reader Friendly**: Descriptive labels and structure

---

## 🚀 Extension Points

### Add New Subject
1. Add to data.js
2. Sidebar auto-updates
3. QuestionsPanel handles it

### Customize Styling
- Edit color variables in styles.css
- Modify .sidebar, .section-title gradients
- Adjust animations timing

### Add Features
- **Local Storage**: Save expanded sections
- **Favorites**: Mark favorite questions
- **Timer**: Add study session timer
- **Print**: Export questions to PDF
- **Dark Mode**: Add theme toggle

---

## 📊 Statistics

| Metric | Value |
|--------|-------|
| Total Components | 4 |
| Total Questions | 144 |
| Total Lines of CSS | ~700 |
| Total Lines of JSX | ~130 |
| State Variables | 5 |
| Media Queries | 3 |
| Colors Used | 8+ |
| Animations | 5+ |

---

## 🔗 Import Dependencies

### React Imports
```javascript
import { useState } from 'react';
import { useMemo } from 'react';
```

### Data Import
```javascript
import { questionsData } from './data';
```

### Component Imports
```javascript
import Sidebar from './components/Sidebar';
import QuestionsPanel from './components/QuestionsPanel';
import QuestionItem from './QuestionItem';
```

### Styling
```javascript
import './styles.css';
import '../styles.css';
```

---

**Last Updated**: February 2026
**Version**: 1.0.0
**Status**: Production Ready
