import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CodeState {
  code: string;
  explanation: string;
  setCode: (code: string) => void;
  setExplanation: (explanation: string) => void;
}

export const useCodeStore = create<CodeState>()(
  persist(
    (set) => ({
      code: '',
      explanation: '',
      setCode: (code) => set({ code }),
      setExplanation: (explanation) => set({ explanation }),
    }),
    {
      name: 'code-storage',
    }
  )
);