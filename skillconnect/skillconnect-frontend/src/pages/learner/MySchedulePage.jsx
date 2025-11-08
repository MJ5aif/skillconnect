import { useCallback, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import LearnerSidebar from '../../components/learner/LearnerSidebar.jsx';
import { auth, db } from '../../firebase/config.js';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const fallbackEvents = (() => {
  const now = new Date();
  const firstStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 0, 0);
  const firstEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 0, 0);

  const secondDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 11, 0, 0);
  const secondEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 12, 15, 0);

  return [
    {
      id: 'demo-1',
      learnerId: 'placeholder',
      title: '1-hour Portfolio Critique',
      mentor: 'Robin Dey Rudro',
      type: '1-on-1',
      start: firstStart,
      end: firstEnd,
      serviceName: 'Portfolio Deep Dive',
      joinUrl: '/live-class?session=demo-1',
    },
    {
      id: 'demo-2',
      learnerId: 'placeholder',
      title: 'Group Sprint Retro',
      mentor: 'Nazrin Hossain',
      type: 'Group',
      start: secondDate,
      end: secondEnd,
      serviceName: 'Sprint Retrospective',
      joinUrl: '/live-class?session=demo-2',
    },
  ];
})();

function normalizeEvent(rawEvent) {
  const start = rawEvent.start?.toDate?.() ?? new Date(rawEvent.start);
  const end = rawEvent.end?.toDate?.() ?? new Date(rawEvent.end ?? rawEvent.start);

  return {
    id: rawEvent.id,
    title: rawEvent.title ?? rawEvent.serviceName ?? rawEvent.type ?? 'Session',
    mentor: rawEvent.mentor ?? 'Mentor TBD',
    serviceName: rawEvent.serviceName ?? rawEvent.title ?? 'Service TBD',
    joinUrl: rawEvent.joinUrl ?? '/live-class',
    start,
    end,
  };
}

function MySchedulePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const loadEvents = useCallback(async (userId) => {
    try {
      const sessionsRef = collection(db, 'sessions');
      const sessionsQuery = query(sessionsRef, where('learnerId', '==', userId));
      const snapshot = await getDocs(sessionsQuery);

      if (snapshot.empty) {
        setEvents(fallbackEvents.map((event) => normalizeEvent(event)));
        return;
      }

      const normalized = snapshot.docs.map((docSnapshot) =>
        normalizeEvent({ id: docSnapshot.id, ...docSnapshot.data() }),
      );
      setEvents(normalized);
    } catch (error) {
      console.error('Failed to load schedule:', error);
      setEvents(fallbackEvents.map((event) => normalizeEvent(event)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setEvents(fallbackEvents.map((event) => normalizeEvent(event)));
        setLoading(false);
        return;
      }

      loadEvents(user.uid).finally(() => setLoading(false));
    });

    return () => unsubscribe();
  }, [loadEvents]);

  const eventStyleGetter = useCallback(() => ({
    style: {
      backgroundColor: '#2563eb',
      borderRadius: '12px',
      border: 'none',
      color: '#ffffff',
      padding: '6px',
    },
  }), []);

  const calendarMessages = useMemo(
    () => ({
      today: 'Today',
      previous: 'Back',
      next: 'Next',
    }),
    [],
  );

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <LearnerSidebar />
        <main className="flex-1 pb-16">
          <header className="rounded-3xl bg-white p-8 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">Schedule</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">My Sessions</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage upcoming one-on-ones and group classes. Click an event to join or see details.
            </p>
          </header>

          <section className="mt-8 rounded-3xl bg-white p-6 shadow-xl">
            {loading ? (
              <div className="flex h-[600px] items-center justify-center text-sm font-semibold text-gray-500">
                Loading your schedule...
              </div>
            ) : (
              <Calendar
                selectable={false}
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 650 }}
                className="rounded-2xl"
                onSelectEvent={(event) => setSelectedEvent(event)}
                eventPropGetter={eventStyleGetter}
                messages={calendarMessages}
              />
            )}
          </section>
        </main>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">Upcoming session</p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">{selectedEvent.serviceName}</h2>
                <p className="mt-2 text-sm text-gray-600">with {selectedEvent.mentor}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {format(selectedEvent.start, 'EEEE, MMM d • h:mm a')} - {format(selectedEvent.end, 'h:mm a')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500 transition hover:bg-gray-200"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Session details</p>
                <p className="mt-2 text-sm text-gray-600">
                  Prepare any relevant files and join a few minutes early to check your camera and microphone.
                </p>
              </div>
              <a
                href={selectedEvent.joinUrl}
                className="flex items-center justify-center rounded-full bg-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-teal-600"
              >
                Join Class
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default MySchedulePage;
