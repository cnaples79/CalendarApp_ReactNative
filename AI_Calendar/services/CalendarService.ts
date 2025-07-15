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
}

export default new CalendarService();
