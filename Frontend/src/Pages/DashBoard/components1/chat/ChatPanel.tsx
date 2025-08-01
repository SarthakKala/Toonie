import React, { useRef, useEffect } from 'react';
import { MessageCircle, Settings } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { Message } from '../../types';
import { MessageLoading } from '@/Pages/Landing/components/ui/message-loading';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (content: string, isCommand?: boolean) => void;
  isLoading?: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  isLoading = false
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="w-full flex flex-col h-full">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-gray-600 flex items-center justify-between" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5" style={{ color: '#FAF9F6' }} />
          <h2 className="font-semibold" style={{ color: '#FAF9F6' }}>AI Assistant</h2>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-xs text-gray-400">
            Use /animate to create animations
          </div>
          <Settings className="w-5 h-5 cursor-pointer transition-colors" style={{ color: '#9CA3AF' }} />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: '#161616' }}>
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-lg px-4 py-2" style={{ backgroundColor: '#000000', color: '#FAF9F6' }}>
              <div className="flex items-center space-x-2">
                <MessageLoading />
                <span className="text-sm">Generating response...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSendMessage={onSendMessage} disabled={isLoading} />
    </div>
  );
};