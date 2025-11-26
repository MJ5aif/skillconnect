import { useState } from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import CourseCard from '../components/CourseCard.jsx';
import heroLearningAnimation from '../assets/hero-learning.json';

const featuredCourses = [
  {
    title: 'Full-Stack Web Mentorship',
    description: 'Work 1-on-1 with senior engineers to build production-grade apps.',
    mentor: 'Robin Dey Rudro',
    price: 129,
    category: 'Development',
    level: 'Intermediate',
    sessions: 6,
    duration: '6 weeks',
    href: '/courses/full-stack-web-mentorship',
  },
  {
    title: 'Product Design Sprint Workshop',
    description: 'Collaborate on live product discovery sessions and craft winning UX flows.',
    mentor: 'Md. Abdullah Al Saim',
    price: 99,
    category: 'Design',
    level: 'All Levels',
    sessions: 4,
    duration: '4 weeks',
    href: '/courses/product-design-sprint',
  },
  {
    title: 'AI Career Fast Track',
    description: 'Structured curriculum plus mentoring to break into applied AI roles.',
    mentor: 'Md. Monowar Jahan Saif',
    price: 149,
    category: 'Data & AI',
    level: 'Advanced',
    sessions: 8,
    duration: '8 weeks',
    href: '/courses/ai-career-fast-track',
  },
];

const learnerSteps = [
  { title: 'Search', description: 'Discover curated mentors, courses, and cohorts by skill, price, or availability.' },
  { title: 'Book', description: 'Reserve 1-on-1 sessions or enroll in flexible cohort-based programs with a click.' },
  { title: 'Learn', description: 'Join live classrooms, track progress, and get tailored feedback from experts.' },
];

const teacherSteps = [
  { title: 'Create', description: 'Launch services, courses, or coaching packages with our guided gig builder.' },
  { title: 'Connect', description: 'Match with motivated learners who need exactly what you offer.' },
  { title: 'Earn', description: 'Monetize your expertise with transparent pricing and automated payouts.' },
];

function HowItWorksTabs() {
  const [activeTab, setActiveTab] = useState('learners');
  const activeSteps = activeTab === 'learners' ? learnerSteps : teacherSteps;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-sm font-semibold text-brand-blue">How it works</span>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">Built for learners and teachers alike</h2>
          <p className="mt-3 max-w-2xl text-base text-gray-500">
            SkillConnect combines the best of Coursera&apos;s structured learning, Upwork&apos;s professional matchmaking, and Fiverr&apos;s gig economy into one trusted platform.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('learners')}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              activeTab === 'learners'
                ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30'
                : 'border border-gray-200 bg-white text-gray-600 hover:border-brand-blue hover:text-brand-blue'
            }`}
          >
            For Learners
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('teachers')}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              activeTab === 'teachers'
                ? 'bg-brand-teal text-white shadow-lg shadow-brand-teal/30'
                : 'border border-gray-200 bg-white text-gray-600 hover:border-brand-teal hover:text-brand-teal'
            }`}
          >
            For Teachers
          </button>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {activeSteps.map((step, index) => (
            <div key={step.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-left">
              <span className="text-sm font-semibold uppercase tracking-wide text-brand-blue">
                Step {index + 1}
              </span>
              <h3 className="mt-3 text-xl font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LandingPage() {
  return (
    <>
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-white to-gray-50">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
            <div>
              <span className="inline-flex items-center rounded-full bg-brand-blue/10 px-3 py-1 text-sm font-semibold text-brand-blue">
                Learn • Teach • Grow
              </span>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                SkillConnect: Learn, Teach, Grow Together.
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Find expert mentors for 1-on-1 sessions or enroll in community-driven courses designed to accelerate your career.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue/30 transition hover:bg-blue-700"
                >
                  Start Learning
                </Link>
                <Link
                  to="/teach"
                  className="inline-flex items-center justify-center rounded-full border border-brand-blue px-6 py-3 text-sm font-semibold text-brand-blue transition hover:bg-brand-blue hover:text-white"
                >
                  Start Teaching
                </Link>
              </div>

              <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue/10 font-semibold text-brand-blue">4.9</span>
                  <div>
                    <p className="font-semibold text-gray-700">Avg mentor rating</p>
                    <p>Based on 1,200+ reviews</p>
                  </div>
                </div>
                <div className="hidden h-12 w-px bg-gray-200 sm:block" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-gray-700">Trusted by teams at</p>
                  <p>Founding School • Startup Studios • Global Communities</p>
                </div>
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-brand-blue/10 blur-3xl" aria-hidden="true" />
              <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-brand-teal/10 blur-3xl" aria-hidden="true" />
              <div className="relative w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-6 shadow-xl">
                <Lottie
                  animationData={heroLearningAnimation}
                  loop
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>
        </section>

        <HowItWorksTabs />

        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 text-center">
              <span className="mx-auto rounded-full bg-brand-teal/10 px-3 py-1 text-sm font-semibold text-brand-teal">Featured learning paths</span>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">What&apos;s trending on SkillConnect</h2>
              <p className="mx-auto max-w-2xl text-base text-gray-500">
                A snapshot of in-demand courses and mentorship experiences that learners are loving this week.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map((course) => (
                <CourseCard key={course.title} course={course} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
            <p className="text-lg font-semibold uppercase tracking-wide text-brand-blue">Social proof</p>
            <h2 className="text-3xl font-bold text-gray-900">As seen at Shahjalal University of Science and Technology</h2>
            <p className="max-w-2xl text-base text-gray-500">
              Our founding team piloted SkillConnect within the Shahjalal University community to bridge mentorship gaps and accelerate skill-sharing between alumni and students.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
              <span>Workshops</span>
              <span>Innovation Labs</span>
              <span>Career Hub</span>
              <span>Entrepreneurship Cell</span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default LandingPage;
