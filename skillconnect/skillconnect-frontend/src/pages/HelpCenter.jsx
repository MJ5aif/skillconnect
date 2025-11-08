import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineLightningBolt, HiOutlineAcademicCap, HiOutlineCreditCard, HiOutlineClock, HiOutlineChatAlt2 } from 'react-icons/hi';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const learnerCategories = [
  {
    title: 'Getting Started',
    description: 'Create an account, find mentors, and set learning goals.',
    icon: HiOutlineAcademicCap,
    link: '/help/learners/getting-started',
  },
  {
    title: 'Payments',
    description: 'Understand pricing, billing cycles, and refunds.',
    icon: HiOutlineCreditCard,
    link: '/help/learners/payments',
  },
  {
    title: 'My Courses',
    description: 'Track cohorts, session replays, and certificates.',
    icon: HiOutlineClock,
    link: '/help/learners/courses',
  },
];

const teacherCategories = [
  {
    title: 'Creating Gigs',
    description: 'Publish offerings, set schedules, and manage demand.',
    icon: HiOutlineLightningBolt,
    link: '/help/teachers/creating-gigs',
  },
  {
    title: 'Earnings',
    description: 'Monitor payouts, platform fees, and financial reports.',
    icon: HiOutlineCreditCard,
    link: '/help/teachers/earnings',
  },
  {
    title: '1-on-1 Sessions',
    description: 'Host live sessions, share resources, and follow up.',
    icon: HiOutlineChatAlt2,
    link: '/help/teachers/1-on-1',
  },
];

const faqs = [
  {
    question: 'How do I book a mentor session?',
    answer:
      'After you sign in, browse the mentor marketplace, choose a service that matches your goals, and click “Book Session.” You can confirm times, complete payment, and receive reminders via email.',
  },
  {
    question: 'What payment methods are supported?',
    answer:
      'SkillConnect supports major credit/debit cards and mobile wallets. All transactions are processed securely through our payment partner, and receipts are stored in your account history.',
  },
  {
    question: 'Can I switch between learner and teacher roles?',
    answer:
      'Yes. Visit your account settings and request a role switch. Our team verifies mentor profiles before enabling teaching features to maintain community quality.',
  },
  {
    question: 'How are mentor ratings calculated?',
    answer:
      'Learners rate mentors after each session. Ratings combine timeliness, expertise, and learner feedback to present an overall score on mentor profiles.',
  },
  {
    question: 'What happens if I miss a live cohort session?',
    answer:
      'Session replays and resources are available in your learner dashboard within 24 hours. You can also message the mentor for clarifications or schedule a follow-up session.',
  },
];

function HelpCenter() {
  const renderedFAQs = useMemo(
    () =>
      faqs.map((item) => (
        <details key={item.question} className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-brand-blue/60">
          <summary className="cursor-pointer text-lg font-semibold text-gray-900 focus:outline-none group-open:text-brand-blue">
            {item.question}
          </summary>
          <p className="mt-3 text-base text-gray-600">{item.answer}</p>
        </details>
      )),
    [],
  );

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-r from-brand-blue to-teal-500 p-10 text-center text-white shadow-2xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-white/80">Help Center</p>
              <h1 className="mt-4 text-4xl font-bold sm:text-5xl">How can we help?</h1>
              <p className="mt-4 text-lg text-white/90">
                Find answers fast or explore guides built for both learners and mentors in the SkillConnect community.
              </p>
              <div className="mt-10 flex justify-center">
                <div className="w-full max-w-2xl overflow-hidden rounded-full bg-white p-2 shadow-xl">
                  <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3">
                    <span className="text-sm font-semibold uppercase tracking-wide text-brand-blue">Search</span>
                    <input
                      type="search"
                      placeholder="Search topics, guides, or FAQs"
                      className="h-10 flex-1 border-0 text-sm text-gray-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      className="rounded-full bg-brand-blue px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow transition hover:bg-brand-blue/90"
                    >
                      Go
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">For Learners</h2>
              <p className="mt-2 text-base text-gray-600">
                Explore how to get started, manage payments, and stay on top of your learning journey.
              </p>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {learnerCategories.map(({ title, description, icon: Icon, link }) => (
                  <Link
                    key={title}
                    to={link}
                    className="flex h-full flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-blue/60 hover:shadow-lg"
                  >
                    <Icon className="h-8 w-8 text-brand-blue" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                      <p className="mt-2 text-sm text-gray-600">{description}</p>
                    </div>
                    <span className="text-sm font-semibold text-brand-blue">View guides →</span>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">For Teachers</h2>
              <p className="mt-2 text-base text-gray-600">
                Learn how to create services, track earnings, and deliver personalized sessions efficiently.
              </p>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {teacherCategories.map(({ title, description, icon: Icon, link }) => (
                  <Link
                    key={title}
                    to={link}
                    className="flex h-full flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-blue/60 hover:shadow-lg"
                  >
                    <Icon className="h-8 w-8 text-teal-500" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                      <p className="mt-2 text-sm text-gray-600">{description}</p>
                    </div>
                    <span className="text-sm font-semibold text-teal-500">View guides →</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-blue">FAQ</p>
              <h2 className="mt-4 text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
              <p className="mt-3 text-base text-gray-600">Quick answers to the most common questions from our community.</p>
            </div>

            <div className="mt-10 space-y-6">{renderedFAQs}</div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default HelpCenter;
