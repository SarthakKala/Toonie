const API_BASE_URL = 'http://localhost:3000/api'; // Adjust port as needed

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
          width: 400,
          height: 300,
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