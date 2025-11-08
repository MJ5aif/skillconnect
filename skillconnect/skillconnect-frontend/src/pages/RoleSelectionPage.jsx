import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { HiAcademicCap, HiUserGroup } from 'react-icons/hi';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { auth, db } from '../firebase/config.js';

const cards = [
  {
    role: 'learner',
    title: 'I am a Learner',
    description: 'Find mentors and enroll in courses tailored to your goals.',
    icon: HiAcademicCap,
    accent: 'from-brand-blue/10 via-brand-blue/5 to-transparent',
    target: '/learner-onboarding',
  },
  {
    role: 'teacher',
    title: 'I am a Teacher',
    description: 'Offer your skills, create courses, and grow your teaching brand.',
    icon: HiUserGroup,
    accent: 'from-brand-teal/10 via-brand-teal/5 to-transparent',
    target: '/teacher-onboarding',
  },
];

function RoleSelectionPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        navigate('/signup', { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSelect = useCallback(
    async (option) => {
      if (!currentUser || isSaving) return;

      try {
        setIsSaving(true);
        setError('');

        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(
          userRef,
          {
            role: option.role,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );

        navigate(option.target, { replace: true });
      } catch (firebaseError) {
        setError('We hit a snag saving your selection. Please try again.');
        console.error('Role selection error:', firebaseError);
      } finally {
        setIsSaving(false);
      }
    },
    [currentUser, isSaving, navigate],
  );

  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl">
          <div className="text-center">
            <span className="inline-flex items-center rounded-full bg-brand-blue/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brand-blue">
              Choose your path
            </span>
            <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">Join as a Learner or a Teacher</h1>
            <p className="mt-3 text-base text-gray-500">
              Tell us how you&apos;d like to use SkillConnect so we can tailor your experience from the very first session.
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {cards.map((card) => (
              <button
                key={card.role}
                type="button"
                onClick={() => handleSelect(card)}
                disabled={isSaving}
                className="group relative flex h-full flex-col rounded-3xl border border-gray-200 bg-white p-8 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40 disabled:cursor-not-allowed"
              >
                <div className={`absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br ${card.accent} opacity-0 transition group-hover:opacity-100`} />
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-3 rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">
                    <card.icon className="h-5 w-5 text-brand-blue" />
                    {card.role === 'learner' ? 'For Learners' : 'For Teachers'}
                  </div>
                  <span className=" text-sm font-semibold uppercase tracking-wide text-brand-blue/80">
                    {isSaving ? 'Saving…' : 'Select'}
                  </span>
                </div>
                <h2 className="mt-6 text-2xl font-semibold text-gray-900">{card.title}</h2>
                <p className="mt-3 text-sm text-gray-500">{card.description}</p>
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-brand-blue">
                  <span>Continue</span>
                  <span aria-hidden="true">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default RoleSelectionPage;
