import { Event } from '../types/Event';

// Mock data for now
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Team Meeting',
    startTime: new Date(new Date().setDate(new Date().getDate() + 1)),
    endTime: new Date(new Date().setDate(new Date().getDate() + 1)),
    description: 'Discuss project progress.'
  },
  {
    id: '2',
    title: 'Doctor Appointment',
    startTime: new Date(new Date().setDate(new Date().getDate() + 5)),
    endTime: new Date(new Date().setDate(new Date().getDate() + 5)),
  },
];

class CalendarService {
  private events: Event[] = mockEvents;
  private nextId = 3;

  getAllEvents(): Event[] {
    return this.events;
  }

  getEventsForDate(date: Date): Event[] {
    return this.events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.getFullYear() === date.getFullYear() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getDate() === date.getDate();
    });
  }

  createEvent(title: string, startTime: string, endTime: string, description?: string) {
    const newEvent: Event = {
      id: this.nextId.toString(),
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    };
    this.events.push(newEvent);
    this.nextId++;
        return newEvent;
  }

  getEventById(id: string): Event | undefined {
    return this.events.find(event => event.id === id);
  }

  updateEvent(id: string, title: string, description?: string): Event | undefined {
    const eventIndex = this.events.findIndex(event => event.id === id);
    if (eventIndex > -1) {
      const updatedEvent = { ...this.events[eventIndex], title, description };
      this.events[eventIndex] = updatedEvent;
      return updatedEvent;
    }
    return undefined;
  }

  deleteEvent(id: string): boolean {
    const initialLength = this.events.length;
    this.events = this.events.filter(event => event.id !== id);
    return this.events.length < initialLength;
  }
}

export default new CalendarService();
