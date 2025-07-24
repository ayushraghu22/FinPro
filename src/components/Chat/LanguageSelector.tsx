import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { languages, Language } from "@/lib/translations";
import { Globe } from "lucide-react";

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
      <SelectTrigger className="w-[120px] h-7 text-xs border-muted">
        <Globe className="h-3 w-3 mr-1 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code} className="text-xs">
            <span className="flex items-center gap-2">
              <span className="font-medium">{lang.nativeName}</span>
              {lang.code !== language && (
                <span className="text-muted-foreground">({lang.name})</span>
              )}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};