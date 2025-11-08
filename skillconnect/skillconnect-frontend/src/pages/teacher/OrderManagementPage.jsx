import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import TeacherSidebar from '../../components/teacher/TeacherSidebar.jsx';

const tabs = ['pending', 'active', 'completed', 'cancelled'];

const ordersDataset = [
  {
    id: 'order-001',
    buyer: 'Ayesha Rahman',
    service: 'UX Mentor Lab: Weekly Design Critiques',
    price: 149,
    dueOn: 'Nov 18, 2025',
    status: 'pending',
    chatId: 'chat-order-001',
  },
  {
    id: 'order-002',
    buyer: 'Tanvir Hasan',
    service: 'Career Sprint: Portfolio to First Job',
    price: 99,
    dueOn: 'Nov 20, 2025',
    status: 'active',
    chatId: 'chat-order-002',
  },
  {
    id: 'order-003',
    buyer: 'Farzana Karim',
    service: 'Advanced UI Prototyping in Figma',
    price: 129,
    dueOn: 'Nov 05, 2025',
    status: 'completed',
    chatId: 'chat-order-003',
  },
  {
    id: 'order-004',
    buyer: 'Zubair Ahmed',
    service: 'Career Sprint: Portfolio to First Job',
    price: 99,
    dueOn: 'Oct 28, 2025',
    status: 'cancelled',
    chatId: 'chat-order-004',
  },
];

const statusLabels = {
  pending: 'Pending',
  active: 'Active',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

function OrderManagementPage() {
  const [activeTab, setActiveTab] = useState('pending');

  const tabCounts = useMemo(() => {
    return tabs.reduce((result, tab) => {
      result[tab] = ordersDataset.filter((order) => order.status === tab).length;
      return result;
    }, {});
  }, []);

  const filteredOrders = useMemo(
    () => ordersDataset.filter((order) => order.status === activeTab),
    [activeTab],
  );

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <TeacherSidebar />

        <main className="flex-1 pb-16">
          <header className="rounded-3xl bg-white p-8 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-500">Order Management</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">Stay on top of every learner engagement</h1>
            <p className="mt-3 text-sm text-gray-600">
              Review new purchases, deliver ongoing work, and revisit completed collaborations from one central hub.
            </p>
          </header>

          <section className="mt-8 rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex flex-wrap gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-wide transition ${
                    activeTab === tab
                      ? 'bg-teal-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {statusLabels[tab]}{' '}
                  <span className="text-xs font-semibold">
                    ({tabCounts[tab] ?? 0})
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <tr className="text-left">
                    <th className="px-4 py-3">Buyer</th>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Due On</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-sm font-semibold text-gray-500">
                        No orders in this view.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-4 py-4 font-semibold text-gray-900">{order.buyer}</td>
                        <td className="px-4 py-4">
                          <p className="font-semibold text-gray-900">{order.service}</p>
                          <p className="text-xs uppercase tracking-wide text-gray-400">Order ID: {order.id}</p>
                        </td>
                        <td className="px-4 py-4 font-semibold text-gray-900">${order.price}</td>
                        <td className="px-4 py-4">{order.dueOn}</td>
                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                              order.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : order.status === 'active'
                                ? 'bg-blue-100 text-blue-700'
                                : order.status === 'completed'
                                ? 'bg-teal-100 text-teal-600'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {statusLabels[order.status]}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Link
                            to={`/messages/${order.chatId}`}
                            className="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 transition hover:border-teal-500 hover:text-teal-500"
                          >
                            View Chat
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default OrderManagementPage;
