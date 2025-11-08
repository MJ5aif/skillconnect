import { useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { format, getDay, parse, startOfWeek } from 'date-fns';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import TeacherSidebar from '../../components/teacher/TeacherSidebar.jsx';
import { auth, db } from '../../firebase/config.js';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': undefined,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

function ManageAvailabilityPage() {
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [applyWeekly, setApplyWeekly] = useState(true);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;
  const mentorId = currentUser?.uid ?? 'demo-mentor';

  const fetchAvailability = useCallback(async () => {
    if (!mentorId) {
      setLoading(false);
      return;
    }

    try {
      const availabilityRef = collection(db, 'availability');
      const availabilityQuery = query(availabilityRef, where('mentorId', '==', mentorId));
      const snapshot = await getDocs(availabilityQuery);

      const slots = snapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data();
        const start = data.start?.toDate?.() ?? new Date(data.start);
        const end = data.end?.toDate?.() ?? new Date(data.end);

        return {
          id: docSnapshot.id,
          title: data.recurring ? 'Available (recurring)' : 'Available',
          start,
          end,
          recurring: Boolean(data.recurring),
          weekday: data.weekday ?? start.getDay(),
        };
      });

      setAvailabilitySlots(slots);
    } catch (error) {
      console.error('Failed to load availability:', error);
    } finally {
      setLoading(false);
    }
  }, [mentorId]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const handleSelectSlot = useCallback((slot) => {
    setSelectedSlot({ start: slot.start, end: slot.end });
  }, []);

  const saveAvailability = useCallback(async () => {
    if (!selectedSlot) {
      return;
    }

    try {
      const entries = applyWeekly
        ? Array.from({ length: 4 }).map((_, index) => ({
            start: new Date(selectedSlot.start.getTime() + index * 7 * 24 * 60 * 60 * 1000),
            end: new Date(selectedSlot.end.getTime() + index * 7 * 24 * 60 * 60 * 1000),
            recurring: true,
            weekday: selectedSlot.start.getDay(),
          }))
        : [
            {
              start: selectedSlot.start,
              end: selectedSlot.end,
              recurring: false,
              weekday: selectedSlot.start.getDay(),
            },
          ];

      await Promise.all(
        entries.map((entry) =>
          addDoc(collection(db, 'availability'), {
            mentorId,
            start: entry.start,
            end: entry.end,
            recurring: entry.recurring,
            weekday: entry.weekday,
          }),
        ),
      );

      setSelectedSlot(null);
      fetchAvailability();
    } catch (error) {
      console.error('Failed to save availability:', error);
    }
  }, [applyWeekly, fetchAvailability, mentorId, selectedSlot]);

  const removeAvailability = useCallback(
    async (slotId) => {
      try {
        await deleteDoc(doc(db, 'availability', slotId));
        fetchAvailability();
      } catch (error) {
        console.error('Failed to delete availability:', error);
      }
    },
    [fetchAvailability],
  );

  const eventStyleGetter = useCallback(
    (event) => ({
      style: {
        backgroundColor: event.recurring ? '#0f766e' : '#2563eb',
        borderRadius: '12px',
        border: 'none',
        color: '#ffffff',
        padding: '6px',
      },
    }),
    [],
  );

  const messages = useMemo(
    () => ({
      today: 'Today',
      previous: 'Back',
      next: 'Next',
      month: 'Month',
      week: 'Week',
      day: 'Day',
      agenda: 'Agenda',
      allDay: 'All day',
    }),
    [],
  );

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <TeacherSidebar />

        <main className="flex-1 pb-16">
          <header className="rounded-3xl bg-white p-8 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-500">Manage Availability</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">Set your bookable hours</h1>
            <p className="mt-3 text-sm text-gray-600">
              Click and drag across the calendar to add time blocks learners can book. Apply the block to recurring weeks to
              streamline your schedule.
            </p>
          </header>

          <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-3xl bg-white p-6 shadow-xl">
              {loading ? (
                <div className="flex h-[650px] items-center justify-center text-sm font-semibold text-gray-500">
                  Loading availability...
                </div>
              ) : (
                <Calendar
                  selectable
                  localizer={localizer}
                  events={availabilitySlots}
                  defaultView="week"
                  views={['week', 'day']}
                  step={30}
                  timeslots={1}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 650 }}
                  onSelectSlot={handleSelectSlot}
                  onSelectEvent={(event) => removeAvailability(event.id)}
                  eventPropGetter={eventStyleGetter}
                  messages={messages}
                />
              )}
            </div>

            <aside className="rounded-3xl bg-white p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-gray-900">Recurring availability</h2>
              <p className="text-sm text-gray-500">
                Configure whether the newly selected block repeats each week. Click an existing block to remove it.
              </p>

              {selectedSlot ? (
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-400">New time block</p>
                    <p className="mt-2 text-sm font-semibold text-gray-900">
                      {format(selectedSlot.start, 'EEEE, MMM d • h:mm a')} — {format(selectedSlot.end, 'h:mm a')}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-gray-100 p-4">
                    <input
                      id="apply-weekly"
                      type="checkbox"
                      checked={applyWeekly}
                      onChange={(event) => setApplyWeekly(event.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                    />
                    <label htmlFor="apply-weekly" className="text-sm font-semibold text-gray-700">
                      Apply to every {format(selectedSlot.start, 'EEEE')} for the next 4 weeks
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={saveAvailability}
                    className="inline-flex w-full items-center justify-center rounded-full bg-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-teal-600"
                  >
                    Save Availability Block
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedSlot(null)}
                    className="inline-flex w-full items-center justify-center rounded-full border border-gray-200 px-6 py-2 text-sm font-semibold text-gray-600 transition hover:border-teal-500 hover:text-teal-500"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                  Select a time block on the calendar to begin.
                </div>
              )}

              <div className="mt-8 space-y-3 text-xs text-gray-500">
                <p>Tips:</p>
                <ul className="space-y-2">
                  <li>• Click an existing block in the calendar to remove it.</li>
                  <li>• Learners see availability in their own time zone.</li>
                  <li>• Use recurring blocks to maintain regular mentorship windows.</li>
                </ul>
              </div>
            </aside>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default ManageAvailabilityPage;
