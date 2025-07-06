import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class AIService {
  private apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async sendMessage(message: string): Promise<string> {
    try {
      const response = await this.apiClient.post('/api/chat', { message });
      return response.data.reply;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to get AI response');
    }
  }

  async generateCode(prompt: string): Promise<{ code: string; language: string }> {
    try {
      const response = await this.apiClient.post('/api/generate-code', { prompt });
      return response.data;
    } catch (error) {
      console.error('Code Generation Error:', error);
      throw new Error('Failed to generate code');
    }
  }
}

export const aiService = new AIService();