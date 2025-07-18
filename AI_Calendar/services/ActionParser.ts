import CalendarService from './CalendarService';

interface Action {
  type: 'CREATE_EVENT';
  params: { [key: string]: string };
}

class ActionParser {
  parse(actionString: string): Action | null {
    const match = actionString.match(/^ACTION:([A-Z_]+)\((.*)\)$/);
    if (!match) return null;

    const type = match[1];
    const paramsString = match[2];
    const params: { [key: string]: string } = {};

    if (paramsString) {
      const paramPairs = paramsString.split(/,\s*/);
      paramPairs.forEach(pair => {
        const [key, value] = pair.split('=');
        if (key && value) {
          // Remove quotes from the parsed value
          params[key.trim()] = value.trim().replace(/^"|"$/g, '');
        }
      });
    }

    if (type === 'CREATE_EVENT') {
      return { type, params };
    }

    return null;
  }

  async execute(action: Action): Promise<string> {
    switch (action.type) {
      case 'CREATE_EVENT':
        const { title, startTime, endTime, description } = action.params;
        if (!title || !startTime || !endTime) {
          return 'I need a title, start time, and end time to create an event.';
        }
        CalendarService.createEvent(title, startTime, endTime, description);
        return `OK, I've added "${title}" to your calendar.`;
      default:
        return 'Sorry, I can\'t perform that action.';
    }
  }
}

export default new ActionParser();
