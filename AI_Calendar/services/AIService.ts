class AIService {
  async getAIResponse(message: string): Promise<string> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock response logic
    if (message.toLowerCase().includes('hello')) {
      return 'Hello there! How can I help you with your calendar today?';
    } else if (message.toLowerCase().includes('tomorrow')) {
        return 'ACTION:CREATE_EVENT(title=Project Stand-up, date=tomorrow, time=10am)';
    } else {
      return "I'm sorry, I didn't understand that. You can ask me to create events, e.g., 'add a meeting tomorrow at 3pm'.";
    }
  }
}

export default new AIService();
