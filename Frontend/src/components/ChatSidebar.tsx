import { useState, useEffect } from 'react';
import { X, Plus, History, BookOpen, Info, ChevronRight, FileText, BookMarked } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { fetchHistory } from '@/lib/api';

// SUBJECT LIST — ADD MORE SUBJECTS HERE
const SUBJECTS = [
  'Artificial Intelligence',
  'Machine Learning'
  // SUBJECT 3
  // SUBJECT 4
  // SUBJECT 5
  // SUBJECT 6
];

const ChatSidebar = () => {
  const {
    sidebarOpen,
    setSidebarOpen,
    userId,
    token,
    setSubject,
    clearMessages,
    currentSubject,
    logout,
  } = useStore();

  const navigate = useNavigate();

  const handleSubjectClick = (subject: string) => {
    setSubject(subject);
    setSidebarOpen(false);
  };

  const handleNewChat = () => {
    clearMessages();
    setSidebarOpen(false);
  };

  const handleNavigateToHistory = () => {
    navigate('/history');
    setSidebarOpen(false);
  };

  if (!sidebarOpen) return null;

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar panel */}
      <aside className="fixed right-0 top-0 bottom-0 w-72 bg-sidebar z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <h2 className="text-sidebar-foreground font-semibold">Menu</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            <X className="w-5 h-5 text-sidebar-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {/* New Chat */}
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-sm"
          >
            <Plus className="w-4 h-4 text-sidebar-primary" />
            New Chat
          </button>

          {/* Questions Viewer */}
          <Link
            to="/questions"
            onClick={() => setSidebarOpen(false)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-sm"
          >
            <FileText className="w-4 h-4 text-sidebar-primary" />
            Questions Viewer
          </Link>

          {/* Syllabus */}
          <Link
            to="/syllabus"
            onClick={() => setSidebarOpen(false)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-sm"
          >
            <BookMarked className="w-4 h-4 text-sidebar-primary" />
            Syllabus
          </Link>

          {/* Show History */}
          <button
            onClick={handleNavigateToHistory}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-sm"
          >
            <History className="w-4 h-4 text-sidebar-primary" />
            Show History
          </button>

          {/* Subjects */}
          <div className="pt-2">
            <p className="px-3 py-1 text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider">
              Subjects
            </p>
            {SUBJECTS.map((subj) => (
              <button
                key={subj}
                onClick={() => handleSubjectClick(subj)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  currentSubject === subj
                    ? 'bg-sidebar-accent arivon-text font-medium'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                {subj}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div className="p-3 border-t border-sidebar-border space-y-1">
          {/* About */}
          <div className="px-3 py-2">
            <p className="text-xs font-semibold text-sidebar-foreground/40 flex items-center gap-2">
              <Info className="w-3 h-3" /> About
            </p>
            <p className="text-xs text-sidebar-foreground/50 mt-1">
              {/* ADD ABOUT TEXT HERE LATER */}
                  AI-powered learning assistant designed to help
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-sidebar-accent transition-colors text-left"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default ChatSidebar;
