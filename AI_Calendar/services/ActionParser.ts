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
          params[key.trim()] = value.trim();
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
        const { title, description } = action.params;
        if (!title) {
          return 'I need a title to create an event.';
        }
        // Note: Date/time parsing from natural language is a complex feature
        // we will add later. For now, we create it for the current day.
        CalendarService.createEvent(title, description);
        return `OK, I've added "${title}" to your calendar.`;
      default:
        return 'Sorry, I can\'t perform that action.';
    }
  }
}

export default new ActionParser();
