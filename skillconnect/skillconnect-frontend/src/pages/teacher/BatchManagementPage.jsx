import { useMemo, useState } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import TeacherSidebar from '../../components/teacher/TeacherSidebar.jsx';

const batchCatalog = [
  {
    id: 'batch-ux-mentor-nov',
    title: 'UX Mentor Lab — November Cohort',
    serviceId: 'ux-mentor-lab',
    learners: [
      { id: 'learner-01', name: 'Ayesha Rahman', email: 'ayesha@example.com', progress: 'Session 2 of 6' },
      { id: 'learner-02', name: 'Tanvir Hasan', email: 'tanvir@example.com', progress: 'Session 1 of 6' },
      { id: 'learner-03', name: 'Farzana Karim', email: 'farzana@example.com', progress: 'Joined, upcoming intro call' },
    ],
  },
  {
    id: 'batch-career-sprint-dec',
    title: 'Career Sprint — December Cohort',
    serviceId: 'career-sprint',
    learners: [
      { id: 'learner-04', name: 'Zubair Ahmed', email: 'zubair@example.com', progress: 'Pre-work submitted' },
      { id: 'learner-05', name: 'Naznin Chowdhury', email: 'naznin@example.com', progress: 'Kickoff scheduled' },
    ],
  },
];

function BatchManagementPage() {
  const [selectedBatchId, setSelectedBatchId] = useState(batchCatalog[0]?.id ?? '');
  const [announcement, setAnnouncement] = useState('');
  const [isSending, setIsSending] = useState(false);

  const selectedBatch = useMemo(
    () => batchCatalog.find((batch) => batch.id === selectedBatchId) ?? batchCatalog[0],
    [selectedBatchId],
  );

  const handleSendAnnouncement = (event) => {
    event.preventDefault();

    if (!selectedBatch || !announcement.trim()) {
      return;
    }

    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setAnnouncement('');
      // Placeholder: integrate with group chat message creation in S-01 later
    }, 1200);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <TeacherSidebar />

        <main className="flex-1 pb-16">
          <header className="rounded-3xl bg-white p-8 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-500">Batch Management</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">Manage Group Courses</h1>
            <p className="mt-3 text-sm text-gray-600">
              Monitor cohort enrollment, track learner progress, and broadcast announcements to keep everyone aligned.
            </p>
          </header>

          <section className="mt-8 rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <label htmlFor="batch-select" className="text-sm font-semibold text-gray-900">
                  Select cohort
                </label>
                <select
                  id="batch-select"
                  value={selectedBatchId}
                  onChange={(event) => setSelectedBatchId(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 md:w-80"
                >
                  {batchCatalog.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Learners enrolled</span>
                <p className="text-lg font-bold text-teal-500">{selectedBatch?.learners.length ?? 0}</p>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <tr className="text-left">
                    <th className="px-4 py-3">Learner</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Progress</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
                  {selectedBatch?.learners.length ? (
                    selectedBatch.learners.map((learner) => (
                      <tr key={learner.id}>
                        <td className="px-4 py-4 font-semibold text-gray-900">{learner.name}</td>
                        <td className="px-4 py-4 text-gray-500">{learner.email}</td>
                        <td className="px-4 py-4">{learner.progress}</td>
                        <td className="px-4 py-4 text-right">
                          <button
                            type="button"
                            className="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 transition hover:border-teal-500 hover:text-teal-500"
                          >
                            View Profile
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center text-sm font-semibold text-gray-500">
                        No learners enrolled in this cohort yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-8 rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">Send announcement to batch</h2>
            <p className="text-sm text-gray-500">
              Share reminders, upcoming milestones, or resources. Messages will post in the cohort&apos;s shared chat.
            </p>
            <form onSubmit={handleSendAnnouncement} className="mt-6 space-y-4">
              <textarea
                rows={4}
                value={announcement}
                onChange={(event) => setAnnouncement(event.target.value)}
                placeholder="E.g., Don&apos;t forget to upload your sprint retro notes before Thursday."
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSending || !announcement.trim()}
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                >
                  {isSending ? 'Sending...' : 'Send Announcement'}
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default BatchManagementPage;
