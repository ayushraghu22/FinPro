import { Button } from '@/components/ui/button';
import { SuggestedAction } from '@/types/chat';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

interface ChatSuggestionsProps {
  suggestions: SuggestedAction[];
  onSuggestionClick: (action: string) => void;
  disabled?: boolean;
}

export const ChatSuggestions = ({ 
  suggestions, 
  onSuggestionClick, 
  disabled = false 
}: ChatSuggestionsProps) => {
  if (suggestions.length === 0) return null;

  const getIcon = (iconName: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as any;
    return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
  };

  const handleSuggestionClick = (suggestion: SuggestedAction) => {
    if (disabled) return;
    onSuggestionClick(suggestion.action);
  };

  return (
    <div className="border-t bg-muted/30 p-3">
      <div className="mb-2">
        <span className="text-xs font-medium text-muted-foreground">
          Quick Actions
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion.id}
            variant="outline"
            size="sm"
            onClick={() => handleSuggestionClick(suggestion)}
            disabled={disabled}
            className={cn(
              "h-8 text-xs gap-2 transition-all duration-200",
              "hover:bg-primary/10 hover:text-primary hover:border-primary/30",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {suggestion.icon && getIcon(suggestion.icon)}
            {suggestion.label}
          </Button>
        ))}
      </div>
    </div>
  );
};