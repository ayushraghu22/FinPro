import { useState, useEffect } from "react"; // <-- Import useEffect
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

  // This effect will run once when the component mounts
  useEffect(() => {
    // Check if the script already exists to avoid adding it multiple times
    if (document.getElementById('google-translate-script')) {
      return;
    }

    // Define the initialization function and attach it to the window object
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        'google_translate_element'
      );
    };

    // Create a new script element
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;

    // Append the script to the document body
    document.body.appendChild(script);

    // Cleanup function to remove the script and function when the component unmounts
    return () => {
      const existingScript = document.getElementById('google-translate-script');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      delete (window as any).googleTranslateElementInit;
    };
  }, []); // The empty dependency array ensures this runs only once

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
        {/* This container will now be reliably found by the script */}
        <div className="google-translate-container">
          <div id="google_translate_element"></div>
        </div>

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
