const API_BASE_URL = 'http://localhost:3000/api'; // Adjust port as needed

export interface AIResponse {
  success: boolean;
  data: {
    code?: string;
    explanation?: string;
    response?: string;
    usage?: any;
  };
  timestamp: string;
}


export const generateAnimation = async (prompt: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        context: {
          width: 600,
          height: 450,
          duration: 5,
          style: 'modern'
        }
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating animation:', error);
    throw error;
  }
};


export const chatWithAI = async (message: string, conversationHistory: any[] = []): Promise<AIResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversationHistory
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error chatting with AI:', error);
    throw error;
  }
};