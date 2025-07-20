

import OpenAI from 'openai';

class AIService {
  async getAIResponse(message: string): Promise<string> {
    const today = new Date().toISOString().split('T')[0];
        const systemPrompt = `You are an AI assistant for a calendar application. Your goal is to help users manage their schedule. You MUST respond ONLY with a command in the format ACTION:<COMMAND_NAME>(...). The current date is ${today}.

Supported Actions:
- ACTION:CREATE_EVENT(title="<event_title>", startTime="<YYYY-MM-DDTHH:mm:ss>", endTime="<YYYY-MM-DDTHH:mm:ss>", description="<optional_description>")
- ACTION:READ_EVENTS(title="<event_title_query>")
- ACTION:UPDATE_EVENT(title="<event_title_to_find>", updates="<json_string_of_updates>")
- ACTION:DELETE_EVENT(title="<event_title_to_find>")

Key instructions for UPDATE_EVENT:
- The 'title' parameter is for finding the event. Be flexible; the user might not say the exact title.
- The 'updates' parameter MUST be a valid JSON string. The keys in the JSON can be 'title', 'startTime', 'endTime', or 'description'.
- 'startTime' and 'endTime' values in the JSON MUST be in "YYYY-MM-DDTHH:mm:ss" format.

Examples for UPDATE_EVENT:
- User: "change the team meeting to 5pm"
  AI: ACTION:UPDATE_EVENT(title="team meeting", updates="{\"startTime\":\"${today}T17:00:00\"}")
- User: "update the project deadline's description to 'Final submission'"
  AI: ACTION:UPDATE_EVENT(title="project deadline", updates="{\"description\":\"Final submission\"}")
- User: "rename 'lunch' to 'Lunch with Bob'"
  AI: ACTION:UPDATE_EVENT(title="lunch", updates="{\"title\":\"Lunch with Bob\"}")
- User: "move the doctor appointment on July 28th from 2pm to 3:30pm"
  AI: ACTION:UPDATE_EVENT(title="doctor appointment", updates="{\"startTime\":\"2025-07-28T15:30:00\",\"endTime\":\"2025-07-28T16:30:00\"}")

General Rules:
- Do not include any other text, greetings, or explanations in your response. Just the ACTION.
- If the user does not specify an end time for a new event, assume it is one hour after the start time.
- If the user's request is not about managing events, provide a helpful, conversational response without using an ACTION.`;

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
