import { useState } from 'react';
import { HiOutlineLocationMarker, HiOutlineStar } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import CourseCard from '../components/CourseCard.jsx';

const teacher = {
  id: 'robin-dey-rudro',
  name: 'Robin Dey Rudro',
  headline: 'Product Design Mentor & UX Strategist',
  rating: 4.9,
  location: 'Dhaka, Bangladesh',
  bio: `I help emerging designers ship credible, user-centered experiences and present compelling case studies.

Over the past 8 years, I’ve led design teams at early-stage startups and guided 300+ learners transitioning into Product Design roles across Asia Pacific. My mentorship mixes structured fundamentals with real-time critiques, ensuring that every project you build tells a human story and aligns with business goals.

Expect accountability, honest feedback, and deep dives into systems thinking, storytelling, and inclusive product principles tailored for the Bangladeshi market.`,
  skills: ['Product Strategy', 'UX Research', 'Design Systems', 'Prototyping', 'Career Coaching', 'Figma'],
  services: [
    {
      id: 'ux-mentor-lab',
      title: 'UX Mentor Lab: Weekly Design Critiques',
      description: 'Level up your portfolio with mentor-led critiques and collaborative challenges.',
      mentor: 'Robin Dey Rudro',
      category: 'Design',
      level: 'Intermediate',
      sessions: 6,
      duration: '6 weeks',
      price: 149,
      href: '/courses/ux-mentor-lab',
    },
    {
      id: 'ux-systems',
      title: 'Design Systems Foundations',
      description: 'Build scalable design systems with tokens, documentation, and handoff standards.',
      mentor: 'Robin Dey Rudro',
      category: 'Design',
      level: 'Advanced',
      sessions: 5,
      duration: '4 weeks',
      price: 179,
      href: '/courses/design-systems-foundations',
    },
    {
      id: 'ux-career-clinic',
      title: 'UX Career Clinic',
      description: 'Personalized strategy workshops to define your niche, positioning, and interview narrative.',
      mentor: 'Robin Dey Rudro',
      category: 'Career',
      level: 'Advanced',
      sessions: 3,
      duration: '3 weeks',
      price: 129,
      href: '/courses/ux-career-clinic',
    },
  ],
  portfolio: [
    {
      title: 'Inclusive Banking App',
      description: 'Human-centered redesign for rural microcredit providers, improving loan workflows by 42%.',
      link: '#',
    },
    {
      title: 'Telehealth Service Platform',
      description: 'End-to-end UX for a telehealth startup, covering onboarding, chat, and symptom triage.',
      link: '#',
    },
    {
      title: 'Design System Rollout',
      description: 'Led system adoption across a 40-person product org, introducing accessibility-first components.',
      link: '#',
    },
  ],
  reviews: [
    {
      id: 1,
      name: 'Afsana Karim',
      role: 'UI Designer at NextGen Labs',
      comment: 'Robin’s frameworks helped me finally explain my design process with clarity and confidence.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Tahmid Chowdhury',
      role: 'Product Designer at Learnify',
      comment: 'The accountability pods kept me shipping every week. His feedback is direct but encouraging.',
      rating: 4.8,
    },
    {
      id: 3,
      name: 'Simran Patel',
      role: 'UX Lead at StellarPay',
      comment: 'We revamped our entire onboarding journey using insights from Robin’s heuristics checklist.',
      rating: 4.9,
    },
  ],
};

const sessionPackages = [
  {
    name: '30-Minute Consultation',
    price: 35,
    description: 'Quick alignment call to audit your portfolio or discuss design career direction.',
  },
  {
    name: '1-Hour Case Study Review',
    price: 60,
    description: 'Deep-dive critique of one portfolio project with actionable next steps.',
  },
  {
    name: 'Career Strategy Intensive',
    price: 110,
    description: 'Two sessions covering positioning, interview readiness, and storytelling practice.',
  },
];

function TeacherProfilePage() {
  const [selectedPackage, setSelectedPackage] = useState(sessionPackages[1]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-1 gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <article className="flex-1 space-y-10">
          <header className="rounded-3xl bg-white p-8 shadow-xl">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <img
                src="https://i.pravatar.cc/160?img=12"
                alt={teacher.name}
                className="h-32 w-32 rounded-full border-4 border-white shadow-xl ring-4 ring-brand-blue/10"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">Top Rated Mentor</p>
                <h1 className="mt-2 text-3xl font-bold text-gray-900">{teacher.name}</h1>
                <p className="mt-1 text-lg text-gray-700">{teacher.headline}</p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="inline-flex items-center gap-2">
                    <HiOutlineStar className="h-5 w-5 text-yellow-500" />
                    <span className="font-semibold text-gray-900">{teacher.rating}</span>
                    <span>Avg. rating</span>
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <HiOutlineLocationMarker className="h-5 w-5 text-brand-blue" />
                    {teacher.location}
                  </span>
                </div>
              </div>
            </div>
          </header>

          <section className="rounded-3xl bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-900">Overview</h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-600">{teacher.bio}</p>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-900">Skills</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {teacher.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-brand-blue/10 px-4 py-2 text-sm font-semibold text-brand-blue">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Portfolio</h2>
              <Link to="#" className="text-sm font-semibold text-brand-blue">
                View all projects
              </Link>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {teacher.portfolio.map((project) => (
                <article key={project.title} className="rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                  <p className="mt-3 text-sm text-gray-600">{project.description}</p>
                  <Link to={project.link} className="mt-4 inline-block text-sm font-semibold text-brand-blue">
                    View case study →
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Services offered</h2>
              <Link to="/browse" className="text-sm font-semibold text-brand-blue">
                Explore marketplace
              </Link>
            </div>
            <div className="mt-6 overflow-x-auto pb-2">
              <div className="flex gap-6">
                {teacher.services.map((service) => (
                  <div key={service.id} className="w-72 shrink-0">
                    <CourseCard course={service} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-900">Reviews</h2>
            <div className="mt-6 space-y-6">
              {teacher.reviews.map((review) => (
                <article key={review.id} className="rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{review.name}</p>
                      <p className="text-xs text-gray-500">{review.role}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold text-yellow-500">
                      <HiOutlineStar className="h-4 w-4" />
                      <span>{review.rating}</span>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">{review.comment}</p>
                </article>
              ))}
            </div>
          </section>
        </article>

        <aside className="hidden w-80 shrink-0 lg:block">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-2xl">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">Book a 1-on-1</p>
              <h3 className="mt-3 text-xl font-semibold text-gray-900">Choose a session</h3>
              <div className="mt-4 space-y-3">
                {sessionPackages.map((pkg) => (
                  <button
                    key={pkg.name}
                    type="button"
                    onClick={() => setSelectedPackage(pkg)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                      selectedPackage.name === pkg.name
                        ? 'border-brand-blue bg-brand-blue/10 text-brand-blue shadow-inner'
                        : 'border-gray-200 text-gray-700 hover:border-brand-blue/60 hover:bg-brand-blue/10'
                    }`}
                  >
                    <p className="text-sm font-semibold">{pkg.name}</p>
                    <p className="text-xs text-gray-500">${pkg.price}</p>
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-gray-500">{selectedPackage.description}</p>
              <Link
                to={`/checkout?title=${encodeURIComponent(`${selectedPackage.name} with ${teacher.name}`)}&subtitle=${encodeURIComponent(teacher.headline)}&price=${selectedPackage.price}&type=mentor`}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition hover:bg-brand-blue/90"
              >
                Book Now
              </Link>
              <p className="mt-3 text-xs text-gray-400">Secure payments • Reschedule up to 12 hours before session</p>
            </div>

            <div className="rounded-3xl bg-white p-6 text-sm text-gray-600 shadow-xl">
              <h4 className="text-lg font-semibold text-gray-900">Need help?</h4>
              <p className="mt-2">
                Message Robin directly with project links or questions before booking. He usually replies within 4 hours.
              </p>
              <Link to="/messages" className="mt-4 inline-block text-sm font-semibold text-brand-blue">
                Start a conversation →
              </Link>
            </div>
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  );
}

export default TeacherProfilePage;
