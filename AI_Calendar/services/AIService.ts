import axios from 'axios';


const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

class AIService {
  async getAIResponse(message: string): Promise<string> {
    const today = new Date().toISOString().split('T')[0];
    const systemPrompt = `You are an AI assistant for a calendar application. Your goal is to help users manage their schedule. When a user asks to create an event, you MUST respond ONLY with a command in the following format: ACTION:CREATE_EVENT(title="<event_title>", startTime="<YYYY-MM-DDTHH:mm:ss>", endTime="<YYYY-MM-DDTHH:mm:ss>", description="<optional_description>"). Do not include any other text, greetings, or explanations in your response. The current date is ${today}. Based on the user's request, determine the correct title, start time, and end time. If the user does not specify an end time, assume the event is one hour long. If the user's request is not about creating an event, provide a helpful, conversational response.`;

    try {
      const response = await axios.post(
        API_URL,
        {
          model: 'deepseek/deepseek-r1-0528:free',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
          ],
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:8081',
            'X-Title': 'AI Calendar RN',
          },
        }
      );

      if (response.data && response.data.choices && response.data.choices.length > 0) {
        return response.data.choices[0].message.content.trim();
      }

      return 'Error: Could not get a response from the AI.';
    } catch (error) {
      console.error('Error calling AI service:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return 'Error: Invalid API Key. Please check your .env file.';
      }
      return 'Error: Could not connect to the AI service.';
    }
  }
}

export default new AIService();
