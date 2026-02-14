# Quick Reference Guide

## 🚀 Getting Started (30 seconds)

```bash
# 1. Navigate to project
cd e:\Arivon\QuestionsViewer

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# Opens at http://localhost:3000 ✨
```

## 📁 File Structure at a Glance

```
QuestionsViewer/
├── index.html                # App HTML
├── main.jsx                  # React entry
├── App.jsx                   # Main component (24 lines)
├── styles.css                # All styling (700+ lines)
├── data.js                   # Questions (144 total)
├── vite.config.js            # Build config
├── package.json              # Dependencies
├── README.md                 # Full docs
├── SETUP_GUIDE.md            # Setup instructions
├── COMPONENT_DOCUMENTATION.md # Component details
└── components/
    ├── Sidebar.jsx           # Subject nav (25 lines)
    ├── QuestionsPanel.jsx    # Main display (68 lines)
    └── QuestionItem.jsx      # Question card (35 lines)
```

## 🎯 Key Features

| Feature | Location | How It Works |
|---------|----------|-------------|
| Subject Selection | Sidebar.jsx | State lifted to App.jsx |
| Search Filter | QuestionsPanel.jsx | useMemo on searchQuery |
| Copy Button | QuestionItem.jsx | navigator.clipboard API |
| Collapsible | QuestionsPanel.jsx | expandedSections state |
| Responsive | styles.css | Media queries @768px, @480px |

## 🔧 Common Tasks

### Add a New Subject
```javascript
// In data.js
"Your Subject": {
  sections: [
    {
      id: "section-id",
      title: "Section Title",
      questions: ["Q1", "Q2", ...]
    }
  ]
}
```

### Change Colors
```css
/* In styles.css */
.sidebar {
  background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
}
```

### Modify Copy Button Icon
```jsx
// In QuestionItem.jsx line 35
{copied ? '✓' : '📋'}  // Change emoji
```

### Change Animations Speed
```css
/* In styles.css */
transition: all 0.3s ease;  /* Change 0.3s to desired value */
```

## 🧪 Testing Checklist

- [ ] All 2 subjects load correctly
- [ ] Search filters questions in real-time
- [ ] Copy button works and shows feedback
- [ ] Sections expand/collapse smoothly
- [ ] Mobile responsive at 768px breakpoint
- [ ] Clear button appears and works
- [ ] No results message shows when needed

## 📊 Component Props

```jsx
// Sidebar
<Sidebar 
  subjects={["AI", "ML"]}
  selectedSubject="AI"
  onSelectSubject={(subject) => {...}}
/>

// QuestionsPanel
<QuestionsPanel 
  sections={[{id, title, questions}]}
  subjectName="AI"
/>

// QuestionItem
<QuestionItem 
  question="Question text"
  index={1}
/>
```

## 🎨 CSS Classes Reference

**Sidebar**:
- `.sidebar` - Main container
- `.subject-btn` - Subject button
- `.subject-btn.active` - Selected subject

**Search**:
- `.search-box` - Search container
- `.search-input` - Input field
- `.clear-search` - Clear button

**Sections**:
- `.section-title` - Section header
- `.section-title.expanded` - Expanded state
- `.questions-list` - Questions container

**Items**:
- `.question-item` - Question wrapper
- `.question-number` - Number (1, 2, 3...)
- `.question-text` - Question content
- `.copy-btn` - Copy button
- `.copy-btn.copied` - Copied state

## 🔪 Build Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Create production build → dist/
npm run preview  # Preview production build
```

## 📱 Responsive Breakpoints

| Device | Breakpoint | Changes |
|--------|-----------|---------|
| Desktop | > 768px | 2-column layout |
| Tablet | 481-768px | Horizontal subject bar |
| Mobile | ≤ 480px | Single column, full width |

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 3000 in use | Change port in vite.config.js |
| Module not found | Run `npm install` |
| Dark styling | Check if styles.css is imported |
| Copy not working | Make sure it's an HTTPS connection |
| Search not filtering | Check exact question text |

## 🎓 Questions Dataset

| Subject | Part A | Part B | Total |
|---------|--------|--------|-------|
| AI | 38 | 36 | 74 |
| ML | 35 | 35 | 70 |
| **Total** | **73** | **71** | **144** |

## 🔗 Important URLs

- **Dev Server**: http://localhost:3000
- **Vite Docs**: https://vitejs.dev
- **React Docs**: https://react.dev
- **MDN Clipboard API**: https://mdn.io/clipboard

## 💡 Pro Tips

1. **Search Tip**: Type partial words (e.g., "neural" matches "neural network")
2. **Mobile Tip**: Copy button always visible on touch devices
3. **Performance**: Lazy rendering of questions (only when section opened)
4. **Accessibility**: Use Tab key to navigate all buttons
5. **Customization**: All colors in one place (.sidebar and .section-title)

## 🎬 Next Steps

- [ ] Install dependencies: `npm install`
- [ ] Run dev server: `npm run dev`
- [ ] Test all subjects load
- [ ] Test search functionality
- [ ] Test copy button
- [ ] Check mobile responsiveness
- [ ] Customize colors if needed
- [ ] Deploy to your hosting

## 📞 Quick Links

- **Setup Guide**: See SETUP_GUIDE.md
- **Full Docs**: See README.md
- **Component Details**: See COMPONENT_DOCUMENTATION.md
- **Code**: Check respective .jsx files

---

**Remember**: No API calls needed - everything is local! 🚀
