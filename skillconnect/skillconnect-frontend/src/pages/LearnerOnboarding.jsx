import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { auth, db } from '../firebase/config.js';

const interestCategories = [
  {
    name: 'Technology & Development',
    items: ['Full-stack Engineering', 'AI & Machine Learning', 'No-code & Automation', 'Cybersecurity'],
  },
  {
    name: 'Design & Product',
    items: ['UX/UI Design', 'Product Strategy', 'Design Systems', 'Service Design'],
  },
  {
    name: 'Business & Growth',
    items: ['Marketing & Growth', 'Sales Enablement', 'Startup Playbooks', 'Operations Excellence'],
  },
  {
    name: 'Career & Leadership',
    items: ['Leadership Coaching', 'Career Switching', 'Interview Prep', 'Communication Skills'],
  },
];

function LearnerOnboarding() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedInterests, setSelectedInterests] = useState([]);
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

  const toggleInterest = useCallback((interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest],
    );
  }, []);

  const isInterestSelected = useCallback(
    (interest) => selectedInterests.includes(interest),
    [selectedInterests],
  );

  const recommendedCount = useMemo(() => ({ min: 3, max: 10 }), []);

  const handleSubmit = useCallback(async () => {
    if (!currentUser || isSaving) return;

    try {
      setIsSaving(true);
      setError('');

      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(
        userRef,
        {
          role: 'learner',
          interests: selectedInterests,
          onboarding: ['learner-profile'],
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      navigate('/learner-dashboard', { replace: true });
    } catch (firebaseError) {
      setError('We could not save your interests. Please try again.');
      console.error('Learner onboarding error:', firebaseError);
    } finally {
      setIsSaving(false);
    }
  }, [currentUser, isSaving, navigate, selectedInterests]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="flex flex-1 flex-col px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-lg lg:p-12">
            <div className="text-center">
              <span className="inline-flex items-center rounded-full bg-brand-teal/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brand-teal">
                Learner onboarding
              </span>
              <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">Which skills are you excited to grow?</h1>
              <p className="mt-3 text-sm text-gray-500">
                Choose a few interest areas so we can personalize your dashboard with mentors, courses, and cohorts.
              </p>
            </div>

            {error && (
              <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {interestCategories.map((category) => (
                <div key={category.name} className="rounded-3xl border border-gray-100 bg-gray-50/60 p-6">
                  <h2 className="text-lg font-semibold text-gray-800">{category.name}</h2>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {category.items.map((interest) => {
                      const selected = isInterestSelected(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                            selected
                              ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20'
                              : 'border border-gray-200 bg-white text-gray-600 hover:border-brand-blue hover:text-brand-blue'
                          }`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-6 text-sm text-gray-500">
              <span>
                Selected {selectedInterests.length} interests — we recommend {recommendedCount.min}-{recommendedCount.max} to start.
              </span>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={selectedInterests.length < recommendedCount.min || selectedInterests.length > recommendedCount.max || isSaving}
                className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {isSaving ? 'Saving…' : 'Finish onboarding'}
                <HiOutlineArrowNarrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default LearnerOnboarding;
