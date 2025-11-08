import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import TeacherSidebar from '../../components/teacher/TeacherSidebar.jsx';

const initialServices = [
  {
    id: 'gig-ux-mentor',
    title: 'UX Mentor Lab: Weekly Design Critiques',
    price: 149,
    status: 'active',
    thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&q=60',
  },
  {
    id: 'gig-career-sprint',
    title: 'Career Sprint: Portfolio to First Job',
    price: 99,
    status: 'paused',
    thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=60',
  },
  {
    id: 'gig-figma-boost',
    title: 'Advanced UI Prototyping in Figma',
    price: 129,
    status: 'active',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=60',
  },
];

function MyServicesPage() {
  const [services, setServices] = useState(initialServices);

  const activeCount = useMemo(() => services.filter((service) => service.status === 'active').length, [services]);

  const handleToggleService = (serviceId) => {
    setServices((current) =>
      current.map((service) =>
        service.id === serviceId
          ? { ...service, status: service.status === 'active' ? 'paused' : 'active' }
          : service,
      ),
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <TeacherSidebar />

        <main className="flex-1 pb-16">
          <header className="flex flex-col gap-4 rounded-3xl bg-white p-8 shadow-xl sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-500">Services</p>
              <h1 className="mt-2 text-3xl font-bold text-gray-900">My Services</h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage the programs and mentoring offers you provide across the SkillConnect marketplace.
              </p>
            </div>
            <Link
              to="/dashboard/teach/services/new"
              className="inline-flex items-center justify-center rounded-full bg-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-teal-600"
            >
              Create New Service
            </Link>
          </header>

          <section className="mt-8 rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">
                Active offerings: <span className="text-teal-500">{activeCount}</span>
              </p>
              <span className="rounded-full bg-gray-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                {services.length} total services
              </span>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
                  {services.map((service) => (
                    <tr key={service.id}>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-14 overflow-hidden rounded-2xl bg-gray-200">
                            <img src={service.thumbnail} alt="" className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{service.title}</p>
                            <p className="text-xs uppercase tracking-wide text-gray-400">ID: {service.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-semibold text-gray-900">Starts at ${service.price}</td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => handleToggleService(service.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                            service.status === 'active'
                              ? 'bg-teal-500'
                              : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                              service.status === 'active' ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                          {service.status === 'active' ? 'Active' : 'Paused'}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            to={`/dashboard/teach/services/${service.id}/edit`}
                            className="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 transition hover:border-teal-500 hover:text-teal-500"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-500 opacity-60"
                            disabled
                          >
                            Insights
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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

export default MyServicesPage;
