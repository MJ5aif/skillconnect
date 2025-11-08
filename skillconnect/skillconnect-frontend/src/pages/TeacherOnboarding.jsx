import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { arrayUnion, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { HiAcademicCap, HiBriefcase, HiCheckCircle, HiOutlineArrowNarrowLeft, HiOutlineArrowNarrowRight } from 'react-icons/hi';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { auth, db } from '../firebase/config.js';

const steps = [
  {
    id: 'professional-info',
    title: 'Professional Info',
    description: 'Introduce yourself to learners with a standout headline and bio.',
    icon: HiBriefcase,
  },
  {
    id: 'skills',
    title: 'Skills & Focus Areas',
    description: 'Highlight the expertise you offer for coaching, mentoring, or teaching.',
    icon: HiCheckCircle,
  },
  {
    id: 'experience',
    title: 'Experience & Education',
    description: 'Boost trust by showcasing your professional background and education.',
    icon: HiAcademicCap,
  },
];

const initialForm = {
  headline: '',
  bio: '',
  skills: [],
  skillInput: '',
  experience: '',
  education: '',
};

function TeacherOnboarding() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const activeStep = steps[activeStepIndex];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        navigate('/signup', { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const canGoNext = useMemo(() => {
    if (activeStep.id === 'professional-info') {
      return form.headline.trim().length > 5 && form.bio.trim().length > 20;
    }

    if (activeStep.id === 'skills') {
      return form.skills.length > 0;
    }

    if (activeStep.id === 'experience') {
      return form.experience.trim().length > 10 && form.education.trim().length > 10;
    }

    return false;
  }, [activeStep.id, form.bio, form.education, form.experience, form.headline, form.skills]);

  const handleSkillAdd = useCallback(() => {
    const trimmed = form.skillInput.trim();
    if (!trimmed) return;

    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(trimmed) ? prev.skills : [...prev.skills, trimmed],
      skillInput: '',
    }));
  }, [form.skillInput]);

  const handleSkillRemove = useCallback((skill) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((item) => item !== skill),
    }));
  }, []);

  const goToNext = useCallback(() => {
    if (!canGoNext) return;
    setActiveStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  }, [canGoNext]);

  const goToPrevious = useCallback(() => {
    setActiveStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!currentUser || isSaving) return;

    try {
      setIsSaving(true);
      setError('');

      const teacherRef = doc(db, 'teachers', currentUser.uid);
      await setDoc(
        teacherRef,
        {
          profile: {
            headline: form.headline.trim(),
            bio: form.bio.trim(),
            skills: form.skills,
            experience: form.experience.trim(),
            education: form.education.trim(),
            updatedAt: serverTimestamp(),
          },
        },
        { merge: true },
      );

      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(
        userRef,
        {
          onboarding: arrayUnion('teacher-profile'),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      navigate('/teacher-dashboard', { replace: true });
    } catch (firebaseError) {
      setError('We could not save your onboarding information. Please retry.');
      console.error('Teacher onboarding error:', firebaseError);
    } finally {
      setIsSaving(false);
    }
  }, [currentUser, form.bio, form.education, form.experience, form.headline, form.skills, isSaving, navigate]);

  const renderStepContent = () => {
    switch (activeStep.id) {
      case 'professional-info':
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="headline" className="text-sm font-semibold text-gray-700">
                Professional Headline
              </label>
              <input
                id="headline"
                type="text"
                value={form.headline}
                onChange={(event) => setForm((prev) => ({ ...prev, headline: event.target.value }))}
                placeholder="Senior UX Strategist & Mentor"
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
              />
            </div>
            <div>
              <label htmlFor="bio" className="text-sm font-semibold text-gray-700">
                Mentor Bio
              </label>
              <textarea
                id="bio"
                rows={6}
                value={form.bio}
                onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
                placeholder="Highlight your expertise, teaching style, and what learners can expect when working with you."
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
              />
              <p className="mt-1 text-xs text-gray-400">Aim for 150-200 words that show credibility and warmth.</p>
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="skillInput" className="text-sm font-semibold text-gray-700">
                Add skills or focus areas
              </label>
              <div className="mt-2 flex gap-3">
                <input
                  id="skillInput"
                  type="text"
                  value={form.skillInput}
                  onChange={(event) => setForm((prev) => ({ ...prev, skillInput: event.target.value }))}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleSkillAdd();
                    }
                  }}
                  placeholder="e.g. Full-stack mentoring"
                  className="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
                />
                <button
                  type="button"
                  onClick={handleSkillAdd}
                  className="rounded-2xl bg-brand-teal px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-600"
                >
                  Add Skill
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-400">Add at least one skill to help learners find you.</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {form.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-blue/10 px-4 py-2 text-sm font-semibold text-brand-blue"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleSkillRemove(skill)}
                    className="text-xs font-bold text-brand-blue/70 hover:text-brand-blue"
                    aria-label={`Remove ${skill}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="experience" className="text-sm font-semibold text-gray-700">
                Experience summary
              </label>
              <textarea
                id="experience"
                rows={4}
                value={form.experience}
                onChange={(event) => setForm((prev) => ({ ...prev, experience: event.target.value }))}
                placeholder="Share notable roles, achievements, or coaching wins."
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
              />
            </div>
            <div>
              <label htmlFor="education" className="text-sm font-semibold text-gray-700">
                Education & credentials
              </label>
              <textarea
                id="education"
                rows={4}
                value={form.education}
                onChange={(event) => setForm((prev) => ({ ...prev, education: event.target.value }))}
                placeholder="List degrees, certifications, or relevant training programs."
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="flex flex-1 flex-col px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-lg lg:p-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
              <aside className="flex flex-col gap-4 lg:w-64">
                <span className="inline-flex items-center rounded-full bg-brand-blue/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brand-blue">
                  Teacher onboarding
                </span>
                <h1 className="text-3xl font-bold text-gray-900">Let&apos;s build your mentor profile</h1>
                <p className="text-sm text-gray-500">
                  We&apos;ll use this info to showcase your expertise on SkillConnect and connect you with the right learners.
                </p>

                <ol className="mt-4 space-y-3 text-sm">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === activeStepIndex;
                    const isCompleted = index < activeStepIndex;

                    return (
                      <li
                        key={step.id}
                        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                          isActive
                            ? 'border-brand-blue/30 bg-brand-blue/5 text-brand-blue'
                            : isCompleted
                              ? 'border-brand-teal/30 bg-brand-teal/5 text-brand-teal'
                              : 'border-gray-200 bg-white text-gray-500'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide">Step {index + 1}</p>
                          <p className="font-medium">{step.title}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </aside>

              <section className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">
                      Step {activeStepIndex + 1} of {steps.length}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-gray-900">{activeStep.title}</h2>
                    <p className="mt-2 text-sm text-gray-500">{activeStep.description}</p>
                  </div>
                  <div className="hidden text-sm font-semibold text-gray-400 lg:block">
                    {canGoNext ? 'Ready to continue' : 'Complete the fields to proceed'}
                  </div>
                </div>

                <div className="mt-8 space-y-6">{renderStepContent()}</div>

                {error && (
                  <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div className="mt-10 flex flex-col justify-between gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center">
                  <div className="text-xs text-gray-400">
                    Your information is encrypted and can be edited later in Settings.
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={goToPrevious}
                      disabled={activeStepIndex === 0 || isSaving}
                      className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <HiOutlineArrowNarrowLeft className="h-4 w-4" />
                      Back
                    </button>
                    {activeStepIndex < steps.length - 1 ? (
                      <button
                        type="button"
                        onClick={goToNext}
                        disabled={!canGoNext || isSaving}
                        className="inline-flex items-center gap-2 rounded-2xl bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                      >
                        Continue
                        <HiOutlineArrowNarrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!canGoNext || isSaving}
                        className="inline-flex items-center gap-2 rounded-2xl bg-brand-teal px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:bg-teal-300"
                      >
                        {isSaving ? 'Saving…' : 'Complete onboarding'}
                      </button>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default TeacherOnboarding;
