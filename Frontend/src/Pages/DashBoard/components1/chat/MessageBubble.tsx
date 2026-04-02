import React from 'react';
import { Message } from '../../types';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div style={{
      padding: '1rem 0',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      backgroundColor: '#161616',
      display: 'flex',
      flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
    }}>
      {/* Role label */}
      <span style={{
        fontSize: '0.65rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.28)',
        marginBottom: '0.4rem',
      }}>
        {isUser ? 'You' : 'Toonie'}
      </span>

      {/* Message content */}
      {isUser ? (
        <p style={{
          color: 'rgba(255,255,255,0.82)',
          fontSize: '0.88rem',
          lineHeight: 1.6,
          maxWidth: '85%',
          textAlign: 'right',
        }}>
          {message.content}
        </p>
      ) : (
        <div style={{
          color: 'rgba(255,255,255,0.72)',
          fontSize: '0.88rem',
          lineHeight: 1.7,
          width: '100%',
        }}>
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginTop: '1rem', marginBottom: '0.5rem' }} {...props} />,
              h2: ({ node, ...props }) => <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginTop: '0.8rem', marginBottom: '0.4rem' }} {...props} />,
              h3: ({ node, ...props }) => <h3 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginTop: '0.6rem', marginBottom: '0.3rem' }} {...props} />,
              p: ({ node, ...props }) => <p style={{ marginBottom: '0.7rem', color: 'rgba(255,255,255,0.72)' }} {...props} />,
              a: ({ node, ...props }) => <a style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'underline' }} {...props} />,
              ul: ({ node, ...props }) => <ul style={{ paddingLeft: '1.2rem', marginBottom: '0.7rem' }} {...props} />,
              ol: ({ node, ...props }) => <ol style={{ paddingLeft: '1.2rem', marginBottom: '0.7rem' }} {...props} />,
              li: ({ node, ...props }) => <li style={{ marginBottom: '0.3rem', color: 'rgba(255,255,255,0.72)' }} {...props} />,
              code: ({ node, className, children, ...props }) => (
                <pre style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '6px',
                  padding: '0.75rem 1rem',
                  overflowX: 'auto',
                  margin: '0.6rem 0',
                }}>
                  <code style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'monospace', fontSize: '0.8rem' }} {...props}>
                    {children}
                  </code>
                </pre>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};
