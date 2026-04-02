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
    <div style={{
      padding: '0.75rem 1rem',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      backgroundColor: '#161616',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
        <textarea
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question or type /animate [your idea]..."
          rows={2}
          disabled={disabled}
          style={{
            flex: 1,
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: '10px',
            padding: '0.6rem 0.9rem',
            color: '#fff',
            fontSize: '0.82rem',
            lineHeight: 1.5,
            resize: 'none',
            outline: 'none',
            fontFamily: 'inherit',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)')}
        />
        <button
          onClick={handleSendMessage}
          disabled={disabled || !inputMessage.trim()}
          style={{
            width: '42px',
            alignSelf: 'stretch',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.15)',
            background: '#fff',
            color: '#161616',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputMessage.trim() ? 'pointer' : 'not-allowed',
            transition: 'background 0.15s',
            flexShrink: 0,
          }}
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
};
