import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineVideoCamera } from 'react-icons/hi';
import LearnerSidebar from '../../components/learner/LearnerSidebar.jsx';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import CourseCard from '../../components/CourseCard.jsx';

const learnerProfile = {
  name: 'Ayesha Rahman',
  interests: ['Product Design', 'Career Growth', 'UI/UX'],
};

const enrolledCourses = [
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
    progress: 68,
  },
  {
    id: 'career-sprint',
    title: 'Career Sprint: Portfolio to First Job',
    description: 'Structured roadmap, job stories, and interview prep tailored for Bangladeshi learners.',
    mentor: 'Md.Abdullah Al Saim',
    category: 'Career',
    level: 'Advanced',
    sessions: 4,
    duration: '4 weeks',
    price: 99,
    href: '/courses/career-sprint',
    progress: 35,
  },
  {
    id: 'figma-bootcamp',
    title: 'Figma Bootcamp for Emerging Designers',
    description: 'Hands-on cohort covering wireframes, design systems, and responsive mockups.',
    mentor: 'Md.Monowar Jahan Saif',
    category: 'Design',
    level: 'Beginner',
    sessions: 8,
    duration: 'Self-paced',
    price: 59,
    href: '/courses/figma-bootcamp',
    progress: 82,
  },
];

const upcomingSessions = [
  { id: 1, mentor: 'Nazrin Hossain', topic: 'Portfolio Review', time: 'Thu, Nov 13 • 7:00 PM' },
  { id: 2, mentor: 'Rezaul Karim', topic: 'Career Mapping', time: 'Sat, Nov 15 • 11:00 AM' },
  { id: 3, mentor: 'Tasnim Akter', topic: 'UI Animation Basics', time: 'Mon, Nov 17 • 8:30 PM' },
];

const catalog = [
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
    tags: ['Product Design', 'UI/UX', 'Career Growth'],
  },
  {
    id: 'career-sprint',
    title: 'Career Sprint: Portfolio to First Job',
    description: 'Structured roadmap, job stories, and interview prep tailored for Bangladeshi learners.',
    mentor: 'Md.Abdullah Al Saim',
    category: 'Career',
    level: 'Advanced',
    sessions: 4,
    duration: '4 weeks',
    price: 99,
    href: '/courses/career-sprint',
    tags: ['Career Growth', 'Job Readiness'],
  },
  {
    id: 'ethical-hacking',
    title: 'Ethical Hacking Fundamentals',
    description: 'Hands-on labs covering penetration testing and cyber hygiene for beginners.',
    mentor: 'Farhan Hossain',
    category: 'Security',
    level: 'Beginner',
    sessions: 5,
    duration: 'Self-paced',
    price: 79,
    href: '/courses/ethical-hacking',
    tags: ['Cybersecurity', 'Career Growth'],
  },
  {
    id: 'ui-prototyping',
    title: 'Advanced UI Prototyping in Figma',
    description: 'Micro-interactions, motion design, and design handoff best practices.',
    mentor: 'Sharmeen Ahmed',
    category: 'Design',
    level: 'Advanced',
    sessions: 3,
    duration: '2 weeks',
    price: 129,
    href: '/courses/ui-prototyping',
    tags: ['Product Design', 'UI/UX'],
  },
];

function LearnerDashboard() {
  const recommendedCourses = useMemo(() => {
    const matches = catalog.filter((course) =>
      course.tags?.some((tag) => learnerProfile.interests.includes(tag)),
    );

    if (matches.length >= 4) {
      return matches;
    }

    return catalog.slice(0, 4);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <LearnerSidebar />

        <main className="flex-1 pb-16">
          <header className="rounded-3xl bg-gradient-to-r from-brand-blue to-teal-500 p-8 text-white shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-white/80">Welcome back</p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Hi {learnerProfile.name}, ready for the next milestone?</h1>
            <p className="mt-4 max-w-2xl text-base text-white/90">
              Continue where you left off, manage upcoming sessions, and explore recommendations curated from your onboarding
              interests.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold uppercase tracking-wide">
              <Link
                to="/dashboard/learn/courses"
                className="rounded-full bg-white px-6 py-2 text-brand-blue shadow-lg transition hover:bg-gray-100"
              >
                Resume Learning
              </Link>
              <Link
                to="/browse"
                className="rounded-full border border-white/70 px-6 py-2 text-white transition hover:bg-white/10"
              >
                Discover more
              </Link>
            </div>
          </header>

          <section className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">My Learning</h2>
              <Link to="/dashboard/learn/courses" className="text-sm font-semibold text-brand-blue">
                View all
              </Link>
            </div>
            <div className="mt-6 overflow-x-auto pb-2">
              <div className="flex gap-6">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="w-72 shrink-0">
                    <CourseCard course={course} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-8 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">My Schedule</h3>
                <Link to="/dashboard/learn/schedule" className="text-sm font-semibold text-brand-blue">
                  See calendar
                </Link>
              </div>
              <ul className="mt-6 space-y-4">
                {upcomingSessions.map((session) => (
                  <li key={session.id} className="flex items-start gap-4 rounded-2xl border border-gray-100 p-4 shadow-sm">
                    <div className="mt-1 rounded-full bg-brand-blue/10 p-3 text-brand-blue">
                      <HiOutlineVideoCamera className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{session.topic}</p>
                      <p className="text-xs text-gray-500">with {session.mentor}</p>
                      <p className="mt-2 text-sm font-medium text-gray-700">{session.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-900">Progress Overview</h3>
              <p className="mt-3 text-sm text-gray-600">
                Track pace across cohorts and personal mentorship. Stay consistent to unlock certificates and mentor badges.
              </p>
              <div className="mt-6 space-y-4">
                {enrolledCourses.map((course) => (
                  <div key={`${course.id}-progress`} className="rounded-2xl border border-gray-100 p-4">
                    <p className="text-sm font-semibold text-gray-900">{course.title}</p>
                    <div className="mt-3 h-2 rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-brand-blue"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <div className="mt-2 flex justify-between text-xs font-medium text-gray-500">
                      <span>{course.progress}% complete</span>
                      <span>{course.sessions} sessions • {course.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-12">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Recommended for you</h2>
                <p className="text-sm text-gray-600">Based on your interests: {learnerProfile.interests.join(', ')}</p>
              </div>
              <Link to="/browse" className="text-sm font-semibold text-brand-blue">
                Explore marketplace
              </Link>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {recommendedCourses.map((course) => (
                <CourseCard key={`rec-${course.id}`} course={course} />
              ))}
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default LearnerDashboard;
