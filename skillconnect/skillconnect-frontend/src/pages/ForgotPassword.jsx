import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { auth } from '../firebase/config.js';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setStatusMessage('');

    try {
      await sendPasswordResetEmail(auth, email);
      setStatusMessage('Password reset email sent. Please check your inbox.');
    } catch (error) {
      setErrorMessage('We could not send a reset email. Please verify the address and try again.');
      console.error('Error sending password reset email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl">
          <div className="text-center">
            <span className="inline-flex items-center rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-blue">
              Need Assistance
            </span>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">Reset your password</h1>
            <p className="mt-2 text-sm text-gray-500">
              Enter the email linked to your SkillConnect account and we&apos;ll send you a secure reset link.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
                required
                disabled={isSubmitting || statusMessage !== ''}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-brand-blue px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-md transition hover:bg-brand-blue/90 focus:outline-none focus:ring-2 focus:ring-brand-blue/40 disabled:cursor-not-allowed disabled:bg-brand-blue/60"
              disabled={isSubmitting || statusMessage !== ''}
            >
              {isSubmitting ? 'Sending...' : 'Send reset link'}
            </button>

            {statusMessage && <p className="text-sm font-medium text-teal-600">{statusMessage}</p>}
            {errorMessage && <p className="text-sm font-medium text-red-600">{errorMessage}</p>}

            <p className="text-center text-xs text-gray-400">
              Remembered your password?{' '}
              <a href="/signin" className="font-semibold text-brand-blue">
                Return to sign in
              </a>
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ForgotPassword;
