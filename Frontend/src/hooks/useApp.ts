import { useChat } from './UseChat';
import { useFiles } from './useFiles';

export const useApp = () => {
  const { messages, sendMessage, isLoading } = useChat();
  const { files, activeFile, setActiveFile } = useFiles();

  const handleRunCode = () => {
    console.log('Running code:', activeFile.content);
    // Implement code execution logic
  };

  return {
    chat: { messages, sendMessage, isLoading },
    files: { files, activeFile, setActiveFile },
    actions: { handleRunCode }
  };
};