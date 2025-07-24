export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'system' | 'suggestion';
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  isActive: boolean;
  lastActivity: Date;
}

export interface ChatConfig {
  maxMessages?: number;
  persistHistory?: boolean;
  showTimestamps?: boolean;
  enableSuggestions?: boolean;
}

export interface SuggestedAction {
  id: string;
  label: string;
  action: string;
  icon?: string;
}

export type ChatState = 'idle' | 'typing' | 'thinking' | 'error';