import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string, isCommand: boolean) => void;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false
}) => {
  const [inputMessage, setInputMessage] = useState('');
  
  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      
      const isCommand = inputMessage.trim().startsWith('/animate') || inputMessage.trim().startsWith('/generate');
      
      onSendMessage(inputMessage, isCommand);
      setInputMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 border-t border-gray-600" style={{ backgroundColor: '#000000' }}>
      <div className="flex space-x-2">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question or type /animate [your idea]..."
          className="flex-1 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white resize-none"
          style={{ 
            backgroundColor: '#000000',
            color: '#FAF9F6',
            borderColor: '#4B5563'
          }}
          rows={3}
          disabled={disabled}
        />
        <button
          onClick={handleSendMessage}
          disabled={disabled || !inputMessage.trim()}
          className="rounded-lg px-4 py-2 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            backgroundColor: '#FAF9F6',
            color: '#000000'
          }}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};