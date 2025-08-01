export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface CodeFile {
  id: string;
  name: string;
  language: string;
  content: string;
  path?: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}