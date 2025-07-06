import React from 'react';

interface StatusBarProps {
  line?: number;
  column?: number;
  language?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ 
  line = 1, 
  column = 1, 
  language = 'TypeScript React' 
}) => {
  return (
    <div className="bg-gray-900 px-4 py-2 border-t border-gray-600 flex items-center justify-between text-xs text-gray-400">
      <div className="flex items-center space-x-4">
        <span>Ready</span>
        <span>{language}</span>
      </div>
      <div className="flex items-center space-x-4">
        <span>Ln {line}, Col {column}</span>
        <span>UTF-8</span>
        <span>LF</span>
      </div>
    </div>
  );
};
