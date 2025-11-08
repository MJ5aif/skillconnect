import { useEffect } from 'react';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const fallbackOrder = {
  title: 'SkillConnect Service',
  subtitle: 'Your order is confirmed and ready to access.',
  type: 'course',
};

function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order || fallbackOrder;

  useEffect(() => {
    if (!location.state?.order) {
      navigate('/browse', { replace: true });
    }
  }, [location.state, navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl rounded-3xl bg-white p-12 text-center shadow-2xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-teal-100 text-teal-600">
            <HiOutlineCheckCircle className="h-12 w-12" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">Thank you for your order!</h1>
          <p className="mt-3 text-base text-gray-600">
            {order.type === 'mentor' ? 'Your mentoring session is booked.' : 'Your course access is now live.'} {order.subtitle}
          </p>

          <div className="mt-8 rounded-2xl border border-gray-100 p-6 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">Purchased</p>
            <h2 className="mt-2 text-lg font-semibold text-gray-900">{order.title}</h2>
            {order.subtitle && <p className="mt-1 text-sm text-gray-500">{order.subtitle}</p>}
          </div>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/dashboard/learn/courses"
              className="inline-flex items-center justify-center rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition hover:bg-brand-blue/90"
            >
              Go to My Learning
            </Link>
            <Link
              to="/dashboard/learn/schedule"
              className="inline-flex items-center justify-center rounded-full border border-brand-blue px-6 py-3 text-sm font-semibold uppercase tracking-wide text-brand-blue transition hover:bg-brand-blue/10"
            >
              View My Schedule
            </Link>
          </div>

          <p className="mt-6 text-xs text-gray-400">
            We&apos;ve sent a confirmation email with your receipt and next steps.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default OrderConfirmationPage;
