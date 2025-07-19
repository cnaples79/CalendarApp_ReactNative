

import OpenAI from 'openai';

class AIService {
  async getAIResponse(message: string): Promise<string> {
    const today = new Date().toISOString().split('T')[0];
        const systemPrompt = `You are an AI assistant for a calendar application. Your goal is to help users manage their schedule. You MUST respond ONLY with a command in the format ACTION:<COMMAND_NAME>(...).

Supported Actions:
- ACTION:CREATE_EVENT(title="<event_title>", startTime="<YYYY-MM-DDTHH:mm:ss>", endTime="<YYYY-MM-DDTHH:mm:ss>", description="<optional_description>")
- ACTION:READ_EVENTS(title="<event_title_query>")
- ACTION:UPDATE_EVENT(title="<event_title_query>", updates="<json_string_of_updates>")
- ACTION:DELETE_EVENT(title="<event_title_query>")

Example for UPDATE_EVENT: ACTION:UPDATE_EVENT(title="Team Meeting", updates="{\"description\":\"New description for the meeting.\"}")

- Do not include any other text, greetings, or explanations in your response.
- The current date is ${today}.
- If the user does not specify an end time for a new event, assume it is one hour long.
- If the user's request is not about managing events, provide a helpful, conversational response.`;

    try {
      const openai = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: process.env.EXPO_PUBLIC_OPENROUTER_API_KEY,
        defaultHeaders: {
          'X-Title': 'AI Calendar RN', // Optional
        },
        dangerouslyAllowBrowser: true, // Required for client-side usage
      });

      const completion = await openai.chat.completions.create({
        model: 'deepseek/deepseek-r1-0528:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
      });

      const aiMessage = completion.choices[0].message.content;
      return aiMessage?.trim() || 'Error: AI response was empty.';
    } catch (error) {
      console.error('Error calling AI service:', error);
      if (error instanceof OpenAI.APIError) {
        if (error.status === 401) {
          return 'Error: Invalid API Key. Please check your .env file and restart the app.';
        }
        return `Error: API request failed with status ${error.status}`;
      }
      return 'Error: Could not connect to the AI service.';
    }
  }
}

export default new AIService();
