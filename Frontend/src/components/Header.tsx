import { MoreVertical } from 'lucide-react';
import { useStore } from '@/store';


const Header = () => {
  // USERNAME COMES FROM GLOBAL STORE
  const username = useStore((s) => s.username);
  const setSidebarOpen = useStore((s) => s.setSidebarOpen);
  const sidebarOpen = useStore((s) => s.sidebarOpen);

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-border bg-card shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold text-xs">✓</div>
        <h1 className="text-lg font-bold text-foreground">Learning Assistant</h1>
      </div>

      <p className="text-sm text-muted-foreground hidden sm:block">
        Welcome {username}
      </p>

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-2 rounded-lg hover:bg-muted transition-colors"
        aria-label="Open menu"
      >
        <MoreVertical className="w-5 h-5 text-foreground" />
      </button>
    </header>
  );
};

export default Header;
