import { useMemo, useState } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import TeacherSidebar from '../../components/teacher/TeacherSidebar.jsx';

const statsSummary = [
  { id: 'earnings', label: 'Earnings (30 Days)', value: '$2,450' },
  { id: 'activeOrders', label: 'Active Orders', value: '6' },
  { id: 'pending', label: 'Pending Clearance', value: '$640' },
  { id: 'rating', label: 'Avg. Rating', value: '4.8/5.0' },
];

const initialOrders = [
  {
    id: 'order-001',
    learner: 'Ayesha Rahman',
    service: 'UX Mentor Lab: Weekly Design Critiques',
    date: 'Nov 10, 2025',
    status: 'pending',
  },
  {
    id: 'order-002',
    learner: 'Tanvir Hasan',
    service: 'Career Sprint: Portfolio to First Job',
    date: 'Nov 12, 2025',
    status: 'pending',
  },
  {
    id: 'order-003',
    learner: 'Farzana Karim',
    service: 'Advanced UI Prototyping in Figma',
    date: 'Nov 14, 2025',
    status: 'pending',
  },
];

const activityFeed = [
  {
    id: 'activity-1',
    detail: "Ayesha Rahman just purchased your 'UX Mentor Lab' program.",
    timestamp: '2 hours ago',
  },
  {
    id: 'activity-2',
    detail: 'You delivered the milestone for Career Sprint: Portfolio to First Job.',
    timestamp: '6 hours ago',
  },
  {
    id: 'activity-3',
    detail: 'Tanvir Hasan sent a follow-up question via Messages.',
    timestamp: 'Yesterday',
  },
];

function TeacherDashboard() {
  const [orders, setOrders] = useState(initialOrders);

  const actionableOrders = useMemo(() => orders.filter((order) => order.status === 'pending'), [orders]);

  const handleOrderDecision = (orderId, decision) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, status: decision === 'accept' ? 'accepted' : 'declined' } : order,
      ),
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <TeacherSidebar />

        <main className="flex-1 pb-16">
          <header className="rounded-3xl bg-white p-8 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-500">Teacher Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">Welcome back, mentor!</h1>
            <p className="mt-3 text-sm text-gray-600">
              Track your performance, act on new orders, and monitor learner activity across the SkillConnect marketplace.
            </p>
          </header>

          <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {statsSummary.map((stat) => (
              <article key={stat.id} className="rounded-3xl bg-white p-6 shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{stat.label}</p>
                <p className="mt-4 text-3xl font-bold text-teal-500">{stat.value}</p>
              </article>
            ))}
          </section>

          <section className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">New Orders</h2>
                  <p className="text-sm text-gray-500">Accept or decline learner bookings awaiting your response.</p>
                </div>
                <span className="rounded-full bg-teal-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-teal-600">
                  {actionableOrders.length} Pending
                </span>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <th className="px-4 py-3">Learner</th>
                      <th className="px-4 py-3">Service</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
                    {orders.map((order) => (
                      <tr key={order.id} className={order.status !== 'pending' ? 'bg-gray-50' : ''}>
                        <td className="px-4 py-4 font-semibold text-gray-900">{order.learner}</td>
                        <td className="px-4 py-4">{order.service}</td>
                        <td className="px-4 py-4">{order.date}</td>
                        <td className="px-4 py-4 text-right">
                          {order.status === 'pending' ? (
                            <div className="flex justify-end gap-3">
                              <button
                                type="button"
                                onClick={() => handleOrderDecision(order.id, 'decline')}
                                className="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-500 transition hover:border-red-400 hover:text-red-500"
                              >
                                Decline
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOrderDecision(order.id, 'accept')}
                                className="rounded-full bg-teal-500 px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-teal-600"
                              >
                                Accept
                              </button>
                            </div>
                          ) : (
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                                order.status === 'accepted'
                                  ? 'bg-teal-500/10 text-teal-600'
                                  : 'bg-red-500/10 text-red-500'
                              }`}
                            >
                              {order.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <aside className="rounded-3xl bg-white p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-gray-900">Activity Feed</h2>
              <p className="text-sm text-gray-500">Stay informed about learner actions and platform updates.</p>
              <ul className="mt-6 space-y-4">
                {activityFeed.map((activity) => (
                  <li key={activity.id} className="rounded-2xl border border-gray-100 p-4">
                    <p className="text-sm font-semibold text-gray-900">{activity.detail}</p>
                    <p className="mt-2 text-xs uppercase tracking-wide text-gray-400">{activity.timestamp}</p>
                  </li>
                ))}
              </ul>
            </aside>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default TeacherDashboard;
