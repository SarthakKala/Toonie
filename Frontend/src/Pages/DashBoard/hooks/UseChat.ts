import { useState } from 'react';
import { Message } from '../types';
import { chatWithAI, generateAnimation } from '@/services/api_chat';
import { useCodeStore } from '@/codeStore';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'system',
      content: 'Hi! I\'m your AI assistant. I can help you with p5.js animations and coding questions. Type /animate or /generate followed by your idea to create animations!'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const setCode = useCodeStore(state => state.setCode);
  const setExplanation = useCodeStore(state => state.setExplanation);

  const addMessage = (role: 'user' | 'system' | 'assistant', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const sendMessage = async (content: string, isCommand = false) => {
    // Add user message to chat
    addMessage('user', content);
    
    setIsLoading(true);
    
    try {
      if (isCommand) {
        // Handle animation generation command
        const response = await generateAnimation(content);
        
        if (response.success && response.data) {
          // Update code store with generated animation
          setCode(response.data.code || '');
          setExplanation(response.data.explanation || '');
          
          // Add system message about code generation
          addMessage('system', 'Code editor updated with new animation!');
          
          // Add explanation as AI message
          addMessage('assistant', response.data.explanation || 'Animation generated successfully!');
        } else {
          addMessage('assistant', 'I had trouble creating that animation. Please try again with a different prompt.');
        }
      } else {
        // Check if message is p5.js or animation related
        if (isAnimationRelated(content)) {
          const response = await chatWithAI(content);
          if (response.success && response.data) {
            addMessage('assistant', response.data.response || 'I couldn\'t process that request.');
          } else {
            addMessage('assistant', 'Sorry, I encountered an error processing your request.');
          }
        } else {
          addMessage('assistant', 'Sorry, I can only help with p5.js animations and coding questions. Please ask something related to animations or creative coding!');
        }
      }
    } catch (error) {
      console.error('Error in chat:', error);
      addMessage('assistant', 'Sorry, there was an error processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Simple check if the message is related to p5.js or animations
  const isAnimationRelated = (message: string): boolean => {
    const keywords = [
      'animation', 'animate', 'p5', 'p5.js', 'javascript', 'js', 'code', 'canvas',
      'draw', 'setup', 'sketch', 'creative', 'coding', 'function', 'programming',
      'loop', 'framerate', 'color', 'shape', 'motion', 'preload', 'particle',
      'interactive', 'visual', '2d', 'graphics', 'art', 'creative'
    ];
    
    const lowerMessage = message.toLowerCase();
    return keywords.some(keyword => lowerMessage.includes(keyword));
  };

  return {
    messages,
    sendMessage,
    isLoading
  };
};