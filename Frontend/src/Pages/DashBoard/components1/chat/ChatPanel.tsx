import React, { useRef, useEffect, useState } from 'react';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { Message } from '../../types';
import { MessageLoading } from '@/Pages/Landing/components/ui/message-loading';
import Meteors from './Meteors';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (content: string, isCommand?: boolean) => void;
  isLoading?: boolean;
}

const suggestions = [
  'rotating galaxy',
  'rain on neon city',
  'DNA helix unraveling',
];

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  isLoading = false
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasConversation = messages.some(m => m.role !== 'system');

  // shutter: 'idle' → 'closing' → 'done'
  const [shutter, setShutter] = useState<'idle' | 'closing' | 'done'>('idle');
  const prevHasConversation = useRef(hasConversation);

  useEffect(() => {
    if (!prevHasConversation.current && hasConversation && shutter === 'idle') {
      setShutter('closing');
      setTimeout(() => setShutter('done'), 520);
    }
    prevHasConversation.current = hasConversation;
  }, [hasConversation, shutter]);

  useEffect(() => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      if (container) container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#161616',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* ── Header ── */}
      <div style={{
        padding: '0 1rem',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        flexShrink: 0,
        position: 'relative',
        zIndex: 10,
        backgroundColor: '#161616',
      }}>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.02em' }}>
          Toonie
        </span>
      </div>

      {/* ── Middle: scrollable area + welcome overlay ── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>

        {/* Welcome screen — slides up on first message */}
        {shutter !== 'done' && (
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 5,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transform: shutter === 'closing' ? 'translateY(-100%)' : 'translateY(0)',
            transition: shutter === 'closing' ? 'transform 0.5s cubic-bezier(0.76,0,0.24,1)' : 'none',
            backgroundColor: '#161616',
          }}>
            {/* Meteors background */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
              <Meteors number={18} minDuration={4} maxDuration={10} />
            </div>

            {/* Bottom fade so text reads clearly */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '55%',
              background: 'linear-gradient(to bottom, transparent 0%, rgba(22,22,22,0.9) 50%, #161616 100%)',
              zIndex: 1,
              pointerEvents: 'none',
            }} />

            {/* Text content */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              padding: '0 1.5rem 1.8rem 1.5rem',
            }}>
              <p style={{
                color: 'rgba(255,255,255,0.32)',
                fontSize: '0.62rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: '0.6rem',
                fontWeight: 500,
              }}>
                AI Assistant
              </p>

              <h1 style={{
                color: '#fff',
                fontSize: 'clamp(1.7rem, 3vw, 2.2rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.04em',
                marginBottom: '1.4rem',
              }}>
                What should<br />
                <span style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', fontWeight: 800 }}>
                  we animate
                </span>{' '}
                today?
              </h1>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
                {suggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => onSendMessage(`/animate ${s}`, true)}
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.09)',
                      borderRadius: '8px',
                      padding: '0.48rem 0.85rem',
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: '0.78rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background 0.15s, color 0.15s, border-color 0.15s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)';
                    }}
                  >
                    /animate {s} →
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Conversation messages */}
        <div style={{
          height: '100%',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          opacity: shutter === 'done' ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}>
          <div style={{ padding: '1.2rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
            {messages
              .filter(m => m.role !== 'system')
              .map((message, index) => (
                <MessageBubble key={`${message.id || message.timestamp}-${index}`} message={message} />
              ))}
            {isLoading && (
              <div style={{ paddingTop: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageLoading />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* ── Input — always visible at bottom ── */}
      <MessageInput onSendMessage={onSendMessage} disabled={isLoading} />
    </div>
  );
};
