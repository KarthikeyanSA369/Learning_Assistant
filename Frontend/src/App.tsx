import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import HistoryViewer from "./pages/HistoryViewer";
import ChatHistoryPage from "./pages/ChatHistoryPage";
import QuestionsViewer from "./pages/QuestionsViewer";
import Syllabus from "./pages/Syllabus";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="relative min-h-screen">
        <div className="relative z-10">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/history" element={<ChatHistoryPage />} />
              <Route path="/history/:date" element={<HistoryViewer />} />
              <Route path="/questions" element={<QuestionsViewer />} />
              <Route path="/syllabus" element={<Syllabus />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
