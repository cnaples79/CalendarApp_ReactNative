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

type Subscriber = () => void;

class CalendarService {
  private events: Event[] = mockEvents;
  private nextId = 3;
  private subscribers: Subscriber[] = [];

  subscribe(callback: Subscriber) {
    this.subscribers.push(callback);
  }

  unsubscribe(callback: Subscriber) {
    this.subscribers = this.subscribers.filter(sub => sub !== callback);
  }

  private notify() {
    this.subscribers.forEach(callback => callback());
  }

  getAllEvents(): Event[] {
    return this.events;
  }

  getEventsForDate(date: Date): Event[] {
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    return this.events.filter(event => {
      const eventDate = new Date(event.startTime);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === selectedDate.getTime();
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
    this.notify();
    return newEvent;
  }

  findEventsByTitle(titleQuery: string): Event[] {
    const lowercasedQuery = titleQuery.toLowerCase();
    return this.events.filter(event => event.title.toLowerCase().includes(lowercasedQuery));
  }

  updateEventByTitle(titleQuery: string, updates: Partial<Event>): Event | undefined {
    const eventToUpdate = this.events.find(
      event => event.title.toLowerCase().includes(titleQuery.toLowerCase())
    );
    if (eventToUpdate) {
      Object.assign(eventToUpdate, updates);
      this.notify();
      return eventToUpdate;
    }
    return undefined;
  }

  deleteEventByTitle(titleQuery: string): boolean {
    const eventToDelete = this.findEventsByTitle(titleQuery)[0];
    if (eventToDelete) {
      this.events = this.events.filter(event => event.id !== eventToDelete.id);
      this.notify();
      return true;
    }
    return false;
  }

  getEventById(id: string): Event | undefined {
    return this.events.find(event => event.id === id);
  }

  updateEvent(id: string, title: string, description?: string): Event | undefined {
    const eventIndex = this.events.findIndex(event => event.id === id);
    if (eventIndex > -1) {
      const updatedEvent = { ...this.events[eventIndex], title, description };
      this.events[eventIndex] = updatedEvent;
      this.notify();
      return updatedEvent;
    }
    return undefined;
  }

  deleteEvent(id: string): boolean {
    const initialLength = this.events.length;
    this.events = this.events.filter(event => event.id !== id);
    this.notify();
    return this.events.length < initialLength;
  }
}

const calendarService = new CalendarService();
export default calendarService;
