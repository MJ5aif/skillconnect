import { useState } from 'react';
import { HiOutlineStar, HiOutlineClock, HiOutlineVideoCamera, HiOutlineUserGroup } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const course = {
  id: 'ux-mentor-lab',
  title: 'UX Mentor Lab: Weekly Design Critiques',
  rating: 4.8,
  reviewCount: 126,
  level: 'Intermediate',
  duration: '6 weeks',
  sessions: 6,
  category: 'Product Design',
  teacher: {
    name: 'Robin Dey Rudro',
    role: 'Senior Product Designer & Mentor',
    href: '/mentors/robin-dey-rudro',
    bio: 'Robin leads design teams across Dhaka-based startups, guiding emerging designers through portfolio development, systems thinking, and storytelling.',
  },
  learnings: [
    'Run effective design critiques and communicate design intent clearly.',
    'Translate user research into actionable design decisions and prototypes.',
    'Build a repeatable workflow for portfolio-ready case studies.',
    'Use peer accountability to stay consistent with weekly practice.',
  ],
  curriculum: [
    {
      module: 'Module 1 • Setting the Foundation',
      lessons: ['UX case study framework', 'Revisiting personas & journeys', 'Design critique best practices'],
    },
    {
      module: 'Module 2 • Crafting Impactful Stories',
      lessons: ['Structuring problem statements', 'Metrics that matter', 'Storyboarding your narrative'],
    },
    {
      module: 'Module 3 • Presenting with Confidence',
      lessons: ['Visual storytelling in Figma', 'Feedback loops & iteration', 'Preparing for mentor showcase'],
    },
  ],
  aboutTeacher:
    'Robin has mentored over 300 learners transitioning into product design roles globally. His mentorship blends strategic thinking, systems design, and inclusive product principles tailored for Bangladeshi creators.',
  reviews: [
    {
      id: 1,
      name: 'Afsana Karim',
      role: 'UI Designer at NextGen Labs',
      comment:
        'The weekly critiques were game-changing. Robin helped me reframe my case studies and boosted my confidence before applying to new roles.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Tahmid Chowdhury',
      role: 'Product Designer at Learnify',
      comment:
        'Loved the balance between structure and flexibility. The community accountability made me keep showing up every week.',
      rating: 4.5,
    },
  ],
};

const packages = [
  {
    name: 'Basic',
    price: 89,
    description: 'Full course access with downloadable resources and weekly assignments.',
    include: ['6 mentor-led workshops', 'Downloadable templates', 'Peer feedback group'],
  },
  {
    name: 'Standard',
    price: 139,
    description: 'Includes everything in Basic plus weekly Q&A office hours with Robin.',
    include: ['Everything in Basic', 'Live weekly Q&A', 'Portfolio checkpoint review'],
  },
  {
    name: 'Premium',
    price: 199,
    description: 'Best for career transitions. Includes personal coaching and final portfolio review.',
    include: ['Everything in Standard', 'Two 1-on-1 coaching sessions', 'Final portfolio overhaul with feedback'],
  },
];

function CourseDetailPage() {
  const [activePackage, setActivePackage] = useState(packages[1]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-1 gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <article className="flex-1">
          <header className="rounded-3xl bg-white p-8 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">{course.category}</p>
            <h1 className="mt-3 text-4xl font-bold text-gray-900">{course.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <span className="inline-flex items-center gap-2">
                <HiOutlineStar className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold text-gray-900">{course.rating}</span>
                <span>({course.reviewCount} reviews)</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <HiOutlineClock className="h-5 w-5 text-brand-blue" />
                {course.duration}
              </span>
              <span className="inline-flex items-center gap-2">
                <HiOutlineVideoCamera className="h-5 w-5 text-brand-blue" />
                {course.sessions} live sessions
              </span>
              <span className="inline-flex items-center gap-2">
                <HiOutlineUserGroup className="h-5 w-5 text-brand-blue" />
                {course.level}
              </span>
            </div>
            <div className="mt-6 text-sm text-gray-600">
              Hosted by{' '}
              <Link to={course.teacher.href} className="font-semibold text-brand-blue">
                {course.teacher.name}
              </Link>{' '}
              — {course.teacher.role}
            </div>
          </header>

          <section className="mt-10 rounded-3xl bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-900">What you&apos;ll learn</h2>
            <ul className="mt-4 space-y-3">
              {course.learnings.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-gray-700">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-blue" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10 rounded-3xl bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-900">Course syllabus</h2>
            <div className="mt-6 space-y-4">
              {course.curriculum.map((module) => (
                <details key={module.module} className="group rounded-2xl border border-gray-200 p-5">
                  <summary className="cursor-pointer text-lg font-semibold text-gray-900 group-open:text-brand-blue">
                    {module.module}
                  </summary>
                  <ul className="mt-4 space-y-2 pl-5 text-sm text-gray-600">
                    {module.lessons.map((lesson) => (
                      <li key={lesson} className="list-disc">
                        {lesson}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </section>

          <section className="mt-10 rounded-3xl bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-900">About the teacher</h2>
            <p className="mt-3 text-sm text-gray-600">{course.aboutTeacher}</p>
            <Link to={course.teacher.href} className="mt-4 inline-block text-sm font-semibold text-brand-blue">
              View full mentor profile →
            </Link>
          </section>

          <section className="mt-10 rounded-3xl bg-white p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Reviews & ratings</h2>
              <span className="text-sm font-medium text-gray-600">Overall {course.rating} / 5</span>
            </div>
            <div className="mt-6 space-y-6">
              {course.reviews.map((review) => (
                <div key={review.id} className="rounded-2xl border border-gray-100 p-5">
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
                </div>
              ))}
            </div>
          </section>
        </article>

        <aside className="hidden w-80 shrink-0 lg:block">
          <div className="sticky top-24 rounded-3xl bg-white p-6 shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">Packages</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs font-semibold uppercase tracking-wide">
              {packages.map((pkg) => (
                <button
                  key={pkg.name}
                  type="button"
                  onClick={() => setActivePackage(pkg)}
                  className={`rounded-full px-3 py-2 transition ${
                    activePackage.name === pkg.name
                      ? 'bg-brand-blue text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-brand-blue/10 hover:text-brand-blue'
                  }`}
                >
                  {pkg.name}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-gray-100 p-5">
              <p className="text-sm font-semibold text-gray-900">{activePackage.name} Package</p>
              <p className="mt-2 text-3xl font-bold text-brand-teal">${activePackage.price}</p>
              <p className="mt-3 text-sm text-gray-600">{activePackage.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                {activePackage.include.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-blue" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to={`/checkout?title=${encodeURIComponent(`${course.title} • ${activePackage.name} Package`)}&subtitle=${encodeURIComponent(course.teacher.name)}&price=${activePackage.price}&type=course`}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition hover:bg-brand-blue/90"
            >
              Buy Now
            </Link>

            <p className="mt-4 text-xs text-gray-400">
              Secure checkout • 7-day refund policy • Instant cohort access
            </p>
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  );
}

export default CourseDetailPage;
