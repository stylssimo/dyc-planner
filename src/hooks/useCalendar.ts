import { useState, useEffect } from 'react';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export type EventType = 'appointment' | 'meeting' | 'personal' | 'interview' | 'task' | 'event' | 'holiday' | 'travel' | 'consultation';

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  notes?: string;
  time?: string;
  date: string; // ISO date string
  userId: string;
  userEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  title: string;
  type: EventType;
  notes?: string;
  time?: string;
  date: string;
}

export const useCalendar = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's calendar events
  const fetchEvents = async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get user's calendar document
      const userCalendarRef = doc(db, 'calendar', user.email);
      const userCalendarSnap = await getDoc(userCalendarRef);

      if (userCalendarSnap.exists()) {
        const calendarData = userCalendarSnap.data();
        const eventsList = calendarData.events || [];
        setEvents(eventsList);
      } else {
        // Initialize empty calendar for new users
        await setDoc(userCalendarRef, {
          userEmail: user.email,
          events: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        setEvents([]);
      }
    } catch (err) {
      console.error('Error fetching calendar events:', err);
      setError('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  };

  // Add new event
  const addEvent = async (eventData: CreateEventData): Promise<CalendarEvent | null> => {
    if (!user?.email) {
      setError('User not authenticated');
      return null;
    }

    try {
      const newEvent: CalendarEvent = {
        id: crypto.randomUUID(),
        ...eventData,
        userId: user.uid,
        userEmail: user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const userCalendarRef = doc(db, 'calendar', user.email);
      const updatedEvents = [...events, newEvent];

      await updateDoc(userCalendarRef, {
        events: updatedEvents,
        updatedAt: new Date().toISOString()
      });

      setEvents(updatedEvents);
      return newEvent;
    } catch (err) {
      console.error('Error adding calendar event:', err);
      setError('Failed to add calendar event');
      return null;
    }
  };

  // Update existing event
  const updateEvent = async (eventId: string, updates: Partial<CreateEventData>): Promise<boolean> => {
    if (!user?.email) {
      setError('User not authenticated');
      return false;
    }

    try {
      const updatedEvents = events.map(event => 
        event.id === eventId 
          ? { ...event, ...updates, updatedAt: new Date().toISOString() }
          : event
      );

      const userCalendarRef = doc(db, 'calendar', user.email);
      await updateDoc(userCalendarRef, {
        events: updatedEvents,
        updatedAt: new Date().toISOString()
      });

      setEvents(updatedEvents);
      return true;
    } catch (err) {
      console.error('Error updating calendar event:', err);
      setError('Failed to update calendar event');
      return false;
    }
  };

  // Delete event
  const deleteEvent = async (eventId: string): Promise<boolean> => {
    if (!user?.email) {
      setError('User not authenticated');
      return false;
    }

    try {
      const updatedEvents = events.filter(event => event.id !== eventId);

      const userCalendarRef = doc(db, 'calendar', user.email);
      await updateDoc(userCalendarRef, {
        events: updatedEvents,
        updatedAt: new Date().toISOString()
      });

      setEvents(updatedEvents);
      return true;
    } catch (err) {
      console.error('Error deleting calendar event:', err);
      setError('Failed to delete calendar event');
      return false;
    }
  };

  // Add consultation event (called when booking consultation)
  const addConsultationEvent = async (consultationData: {
    tripName: string;
    date: string;
    time: string;
    notes?: string;
  }): Promise<CalendarEvent | null> => {
    return await addEvent({
      title: `Consultation: ${consultationData.tripName}`,
      type: 'consultation',
      date: consultationData.date,
      time: consultationData.time,
      notes: consultationData.notes || `Travel consultation for ${consultationData.tripName}`
    });
  };

  // Get events for a specific date
  const getEventsForDate = (date: string): CalendarEvent[] => {
    return events.filter(event => event.date === date);
  };

  // Get events for a specific month
  const getEventsForMonth = (year: number, month: number): CalendarEvent[] => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
  };

  // Clear error
  const clearError = () => setError(null);

  useEffect(() => {
    fetchEvents();
  }, [user?.email]);

  return {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    addConsultationEvent,
    getEventsForDate,
    getEventsForMonth,
    refetch: fetchEvents,
    clearError
  };
}; 