import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import TeacherSidebar from '../../components/teacher/TeacherSidebar.jsx';

const earningsSummary = [
  { id: 'pending', label: 'Pending Clearance', value: '$640' },
  { id: 'available', label: 'Available for Withdrawal', value: '$1,820' },
  { id: 'withdrawn', label: 'Total Withdrawn', value: '$6,300' },
  { id: 'earned', label: 'Total Earned', value: '$8,760' },
];

const revenueData = [
  { month: 'Jun', value: 620 },
  { month: 'Jul', value: 840 },
  { month: 'Aug', value: 910 },
  { month: 'Sep', value: 1_100 },
  { month: 'Oct', value: 1_230 },
  { month: 'Nov', value: 1_460 },
];

const topServices = [
  { id: 'ux-mentor', title: 'UX Mentor Lab: Weekly Design Critiques', revenue: '$3,240', orders: 18 },
  { id: 'career-sprint', title: 'Career Sprint: Portfolio to First Job', revenue: '$2,180', orders: 14 },
  { id: 'figma-pro', title: 'Advanced UI Prototyping in Figma', revenue: '$1,760', orders: 11 },
];

function EarningsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <TeacherSidebar />

        <main className="flex-1 pb-16">
          <header className="rounded-3xl bg-white p-8 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-500">Earnings & Analytics</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">Track revenue and unlock growth insights</h1>
            <p className="mt-3 text-sm text-gray-600">
              Monitor your balance, see what&apos;s pending clearance, and understand which services are performing best.
            </p>
          </header>

          <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {earningsSummary.map((stat) => (
              <article key={stat.id} className="rounded-3xl bg-white p-6 shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{stat.label}</p>
                <p className="mt-4 text-3xl font-bold text-teal-500">{stat.value}</p>
              </article>
            ))}
          </section>

          <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Revenue Over Time</h2>
                  <p className="text-sm text-gray-500">Monthly gross sales across all services.</p>
                </div>
                <span className="rounded-full bg-gray-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Last 6 months
                </span>
              </div>
              <div className="mt-6">
                <div className="flex h-64 items-end gap-4 rounded-2xl bg-gray-50 p-6">
                  {revenueData.map((entry) => (
                    <div key={entry.month} className="flex flex-1 flex-col items-center justify-end gap-3">
                      <div
                        className="w-full rounded-t-2xl bg-blue-600"
                        style={{ height: `${(entry.value / 1500) * 100}%`, minHeight: '40px' }}
                      />
                      <div className="text-xs font-semibold text-gray-500">{entry.month}</div>
                      <span className="text-xs text-gray-400">${entry.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="rounded-3xl bg-white p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-gray-900">Top Performing Services</h2>
              <p className="text-sm text-gray-500">Identify which offerings drive the most revenue.</p>
              <ul className="mt-6 space-y-4">
                {topServices.map((service) => (
                  <li key={service.id} className="rounded-2xl border border-gray-100 p-4">
                    <p className="text-sm font-semibold text-gray-900">{service.title}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <span>Revenue: {service.revenue}</span>
                      <span>Orders: {service.orders}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>
          </section>

          <section className="mt-8 rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Ready to withdraw?</h2>
                <p className="text-sm text-gray-500">Transfer available funds to your connected payout method.</p>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
              >
                Withdraw Funds
              </button>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default EarningsPage;
