import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, User, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header = ({ onMenuToggle }: HeaderProps) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="h-16 bg-card border-b border-border shadow-card flex items-center justify-between px-4 lg:px-6 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onMenuToggle} className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <img src={logo} alt="ShopKeeper Pro" className="h-8 w-8" />
          <h1 className="text-xl font-bold text-primary hidden sm:block">FinPro</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs"></span>
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/auth/signin")}>
              Sign In
            </Button>
            <Button variant="default" size="sm" onClick={() => navigate("/auth/signup")}>
              Get Started
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};