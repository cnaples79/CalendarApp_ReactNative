import calendarService from './CalendarService';

import { Event } from '../types/Event';

interface Action {
  type: 'CREATE_EVENT' | 'READ_EVENTS' | 'UPDATE_EVENT' | 'DELETE_EVENT';
  params: { [key: string]: any };
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
      case 'CREATE_EVENT': {
        const { title, startTime, endTime, description } = action.params;
        if (title && startTime && endTime) {
          calendarService.createEvent(title, startTime, endTime, description);
          return 'Event created successfully.';
        } else {
          throw new Error('Missing parameters for CREATE_EVENT');
        }
      }
      case 'READ_EVENTS': {
        const { title } = action.params;
        if (title) {
          const events = calendarService.findEventsByTitle(title);
          if (events.length === 0) {
            return 'No events found with that title.';
          }
          const eventList = events.map(e => `- ${e.title} at ${new Date(e.startTime).toLocaleString()}`).join('\n');
          return `Found ${events.length} event(s):\n${eventList}`;
        } else {
          throw new Error('Missing title parameter for READ_EVENTS');
        }
      }
      case 'UPDATE_EVENT': {
        const { title, updates } = action.params;
        if (title && updates) {
          try {
            const parsedUpdates = JSON.parse(updates);
            const updatedEvent = calendarService.updateEventByTitle(title, parsedUpdates);
            return updatedEvent ? 'Event updated successfully.' : 'Event not found.';
          } catch (error) {
            throw new Error('Invalid JSON format for updates parameter.');
          }
        } else {
          throw new Error('Missing parameters for UPDATE_EVENT');
        }
      }
      case 'DELETE_EVENT': {
        const { title } = action.params;
        if (title) {
          const success = calendarService.deleteEventByTitle(title);
          return success ? 'Event deleted successfully.' : 'Event not found.';
        } else {
          throw new Error('Missing title parameter for DELETE_EVENT');
        }
      }
      default:
        return 'Sorry, I can\'t perform that action.';
    }
  }
}

export default new ActionParser();
