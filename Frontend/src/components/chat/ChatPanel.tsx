import React from 'react';
import { MessageCircle, Settings } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { Message } from '../../types';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  isLoading = false
}) => {
  return (
    <div className="w-full flex flex-col h-full">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-gray-600 flex items-center justify-between" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5" style={{ color: '#FAF9F6' }} />
          <h2 className="font-semibold" style={{ color: '#FAF9F6' }}>AI Assistant</h2>
        </div>
        <Settings className="w-5 h-5 cursor-pointer transition-colors" style={{ color: '#9CA3AF' }} />
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: '#161616' }}>
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-lg px-4 py-2" style={{ backgroundColor: '#000000', color: '#FAF9F6' }}>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <MessageInput onSendMessage={onSendMessage} disabled={isLoading} />
    </div>
  );
};