import { useState } from "react";
import { Header } from "./Layout/Header";
import { Sidebar } from "./Layout/Sidebar";
import { Footer } from "./Layout/Footer";
import { ChatBot } from "@/components/ChatBot";
import { ChatProvider } from "@/contexts/ChatContext";
import { cn } from "@/lib/utils";

interface ProtectedRouteProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showFooter?: boolean;
}

export const ProtectedRoute = ({ children, showSidebar = true, showFooter = true }: ProtectedRouteProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <ChatProvider>
      <div className="min-h-screen w-full flex flex-col bg-background">
        <Header onMenuToggle={toggleSidebar} />
        <div className="flex flex-1 min-h-[calc(100vh-8rem)]">
          {/* Sidebar */}
          {showSidebar && <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />}
          {/* Main content */}
          <main className={cn(
            "flex-1 w-full transition-all duration-300 overflow-y-auto",
            showSidebar ? 'lg:ml-64' : ''
          )}>
            <div className="w-full mt-16">
              {children}
            </div>
          </main>
        </div>
        {/* Footer */}
        {showFooter && (
          <div className="relative z-[60]">
            <Footer />
          </div>
        )}
        {/* ChatBot */}
        <ChatBot />
      </div>
    </ChatProvider>
  );
};
