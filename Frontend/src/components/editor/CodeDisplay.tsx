import React from 'react';
import { CodeFile } from '../../types';

interface CodeDisplayProps {
  file: CodeFile;
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({ file }) => {
  return (
    <div className="flex-1 bg-black">
      <div className="h-full p-4">
        <div className="bg-gray-900 rounded-lg h-full overflow-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">{file.name}</span>
              <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                {file.language}
              </span>
            </div>
            <pre className="text-sm text-white overflow-x-auto">
              <code className="language-javascript">
                {file.content.split('\n').map((line, index) => (
                  <div key={index} className="flex">
                    <span className="text-gray-500 mr-4 select-none w-8 text-right">
                      {index + 1}
                    </span>
                    <span className="flex-1">{line}</span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
