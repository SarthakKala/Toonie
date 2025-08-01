import React from 'react';
import { Message } from '../../types';
import { BotIcon, UserIcon, InfoIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  if (message.role === 'system') {
    return (
      <div className="flex justify-center my-3">
        <div className="rounded-lg px-4 py-2 max-w-[90%] text-xs flex items-center space-x-2" 
          style={{ 
            backgroundColor: 'rgba(250, 249, 246, 0.15)', 
            color: '#FAF9F6' 
          }}>
          <InfoIcon className="w-3 h-3" />
          <span>{message.content}</span>
        </div>
      </div>
    );
  }

  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} my-5`}>
      <div 
        className={`rounded-lg px-6 py-5 ${isUser ? 'max-w-[80%]' : 'max-w-[90%] w-[90%]'}`}
        style={{ 
          backgroundColor: isUser ? '#6E56CF' : '#1E1E1E',
          color: '#FAF9F6',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
        }}
      >
        <div className="flex items-start space-x-3">
          {!isUser && <BotIcon className="w-4 h-4 mt-1.5 flex-shrink-0" />}
          <div className={`w-full ${isUser ? '' : 'markdown-bubble pr-3'}`}>
            {isUser ? (
              message.content
            ) : (
              <ReactMarkdown
                components={{
                  // Headings with improved spacing and sizing
                  h1: ({ node, ...props }) => <h1 className="text-lg font-bold mt-4 mb-3 text-gray-100 pb-1 border-b border-gray-700" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-base font-bold mt-4 mb-3 text-gray-100 pb-1 border-b border-gray-700" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-sm font-bold mt-3 mb-2 text-gray-100" {...props} />,
                  
                  // Paragraphs with better spacing
                  p: ({ node, ...props }) => <p className="mb-4 leading-relaxed text-gray-200" {...props} />,
                  
                  // Links with clear styling
                  a: ({ node, ...props }) => <a className="text-blue-300 hover:underline font-medium" {...props} />,
                  
                  // Lists with better spacing and bullets
                  ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-3 space-y-1.5" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-3 space-y-1.5" {...props} />,
                  li: ({ node, ...props }) => <li className="mb-1 text-gray-200" {...props} />,
                  
                  // Code blocks with better highlighting - softer colors
                  code: ({ node, inline, className, children, ...props }) => 
                    inline ? (
                      <code className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-300 font-mono text-sm" {...props}>
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-gray-900 p-3 rounded-md my-3 overflow-x-auto border border-gray-800 w-full">
                        <code className="text-gray-300 font-mono text-sm block" {...props}>
                          {children}
                        </code>
                      </pre>
                    )
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
          {isUser && <UserIcon className="w-4 h-4 mt-1.5 flex-shrink-0" />}
        </div>
      </div>
    </div>
  );
};