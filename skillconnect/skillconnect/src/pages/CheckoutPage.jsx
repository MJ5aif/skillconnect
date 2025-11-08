import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const fallbackOrder = {
  title: '1-Hour Strategy Session',
  subtitle: 'with SkillConnect Mentor',
  price: 99,
  type: 'mentor',
};

function parseOrder(searchParams) {
  const params = new URLSearchParams(searchParams);
  const title = params.get('title');
  const subtitle = params.get('subtitle');
  const price = params.get('price');
  const type = params.get('type');

  if (!title || !price) {
    return fallbackOrder;
  }

  return {
    title,
    subtitle: subtitle || fallbackOrder.subtitle,
    price: Number.parseFloat(price),
    type: type || 'course',
  };
}

function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const order = parseOrder(location.search);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);
      navigate('/checkout/confirmation', {
        replace: true,
        state: {
          order,
        },
      });
    }, 1200);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col-reverse gap-8 px-4 py-10 sm:flex-row sm:px-6 lg:px-8">
        <section className="flex-1 rounded-3xl bg-white p-8 shadow-xl">
          <h1 className="text-2xl font-semibold text-gray-900">Payment details</h1>
          <p className="mt-3 text-sm text-gray-600">
            Enter your card details below. We process payments securely and send a receipt instantly.
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-semibold text-gray-700">
                Card Number
              </label>
              <input
                id="cardNumber"
                type="text"
                inputMode="numeric"
                placeholder="4242 4242 4242 4242"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                required
              />
            </div>

            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="flex-1">
                <label htmlFor="expiry" className="block text-sm font-semibold text-gray-700">
                  Expiry
                </label>
                <input
                  id="expiry"
                  type="text"
                  inputMode="numeric"
                  placeholder="MM / YY"
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  required
                />
              </div>

              <div className="flex-1">
                <label htmlFor="cvc" className="block text-sm font-semibold text-gray-700">
                  CVC
                </label>
                <input
                  id="cvc"
                  type="text"
                  inputMode="numeric"
                  placeholder="123"
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                Name on Card
              </label>
              <input
                id="name"
                type="text"
                placeholder="Full name"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition hover:bg-brand-blue/90 disabled:cursor-not-allowed disabled:bg-brand-blue/60"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Confirm & Pay'}
            </button>

            <p className="text-xs text-gray-400">
              By confirming, you agree to the SkillConnect Terms of Service and acknowledge our privacy policy.
            </p>
          </form>
        </section>

        <aside className="w-full shrink-0 rounded-3xl bg-white p-8 shadow-xl sm:w-80">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">Order summary</p>
          <div className="mt-4 rounded-2xl border border-gray-100 p-5">
            <p className="text-sm font-semibold text-gray-900">{order.type === 'mentor' ? '1-on-1 Session' : 'Course Access'}</p>
            <p className="mt-2 text-base font-semibold text-gray-900">{order.title}</p>
            {order.subtitle && <p className="mt-1 text-xs text-gray-500">{order.subtitle}</p>}
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <dt>Subtotal</dt>
                <dd>${order.price.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between text-gray-600">
                <dt>Platform Fee</dt>
                <dd>$3.50</dd>
              </div>
              <div className="flex justify-between text-gray-600">
                <dt>Processing</dt>
                <dd>$1.25</dd>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-semibold text-gray-900">
                <dt>Total</dt>
                <dd>${(order.price + 4.75).toFixed(2)}</dd>
              </div>
            </dl>
          </div>
          <p className="mt-4 text-xs text-gray-400">Need help? Contact support@skillconnect.com</p>
        </aside>
      </main>
      <Footer />
    </div>
  );
}

export default CheckoutPage;
