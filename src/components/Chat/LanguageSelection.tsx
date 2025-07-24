import { languages, Language } from "@/lib/translations";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface LanguageSelectionProps {
  onLanguageSelect: (lang: Language) => void;
  className?: string;
}

export const LanguageSelection = ({ onLanguageSelect, className }: LanguageSelectionProps) => {
  const { language: currentLanguage, setLanguage } = useLanguage();

  const handleLanguageSelect = (lang: Language) => {
    console.log('Selected language code:', lang);
    console.log('Language object:', languages.find(l => l.code === lang));
    setLanguage(lang);
    onLanguageSelect(lang);
  };

  return (
    <div className={cn("p-4 bg-muted/30 border-t", className)}>
      <p className="text-sm text-muted-foreground mb-3 text-center">
        Choose your preferred language / अपनी पसंदीदा भाषा चुनें
      </p>
      <div className="grid grid-cols-2 gap-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageSelect(lang.code as Language)}
            className={cn(
              "px-4 py-3 rounded-lg text-sm font-medium transition-all",
              "hover:bg-primary/10 hover:shadow-sm",
              "border border-border",
              currentLanguage === lang.code 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "bg-background"
            )}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-base">{lang.nativeName}</span>
              <span className="text-xs opacity-70">{lang.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};