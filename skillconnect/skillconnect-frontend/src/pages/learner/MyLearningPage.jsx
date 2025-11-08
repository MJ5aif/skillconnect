import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import LearnerSidebar from '../../components/learner/LearnerSidebar.jsx';
import MyLearningCourseCard from '../../components/learner/MyLearningCourseCard.jsx';
import LeaveReviewModal from '../../components/modals/LeaveReviewModal.jsx';
import { auth, db } from '../../firebase/config.js';

const fallbackEnrollments = [
  {
    id: 'ux-mentor-lab',
    title: 'UX Mentor Lab: Weekly Design Critiques',
    description: 'Level up your portfolio with mentor-led critiques and collaborative challenges.',
    mentor: 'Robin Dey Rudro',
    category: 'Design',
    level: 'Intermediate',
    sessions: 6,
    duration: '6 weeks',
    progress: 68,
    status: 'inProgress',
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
    progress: 100,
    status: 'completed',
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
    progress: 54,
    status: 'inProgress',
  },
];

function MyLearningPage() {
  const [activeTab, setActiveTab] = useState('inProgress');
  const [enrollments, setEnrollments] = useState(fallbackEnrollments);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setEnrollments(fallbackEnrollments);
        setLoading(false);
        return;
      }

      try {
        const enrollmentRef = collection(db, 'enrollments');
        const userEnrollmentsQuery = query(enrollmentRef, where('userId', '==', user.uid));
        const snapshot = await getDocs(userEnrollmentsQuery);

        if (snapshot.empty) {
          setEnrollments([]);
        } else {
          const data = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
          setEnrollments(
            data.map((item) => ({
              id: item.courseId ?? item.id,
              title: item.title,
              description: item.description,
              mentor: item.mentor,
              category: item.category,
              level: item.level,
              sessions: item.sessions,
              duration: item.duration,
              progress: item.progress ?? 0,
              status: item.status ?? 'inProgress',
            })),
          );
        }
      } catch (error) {
        console.error('Failed to load enrolled courses:', error);
        setEnrollments(fallbackEnrollments);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const filteredCourses = useMemo(
    () => enrollments.filter((course) => course.status === activeTab),
    [enrollments, activeTab],
  );

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <LearnerSidebar />
        <main className="flex-1 pb-16">
          <header className="flex flex-col gap-4 rounded-3xl bg-white p-8 shadow-xl sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">Library</p>
              <h1 className="mt-2 text-3xl font-bold text-gray-900">My Learning</h1>
              <p className="mt-2 text-sm text-gray-600">
                Continue where you left off, and share feedback once you complete a course.
              </p>
            </div>
          </header>

          <div className="mt-8 rounded-3xl bg-white p-4 shadow-xl">
            <div className="flex gap-2 rounded-2xl bg-gray-100 p-2 text-sm font-semibold text-gray-500">
              <button
                type="button"
                onClick={() => setActiveTab('inProgress')}
                className={`flex-1 rounded-xl px-4 py-2 transition ${
                  activeTab === 'inProgress' ? 'bg-white text-brand-blue shadow-md' : 'hover:text-gray-900'
                }`}
              >
                In Progress
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('completed')}
                className={`flex-1 rounded-xl px-4 py-2 transition ${
                  activeTab === 'completed' ? 'bg-white text-brand-blue shadow-md' : 'hover:text-gray-900'
                }`}
              >
                Completed
              </button>
            </div>

            <section className="mt-6">
              {loading ? (
                <div className="flex h-40 items-center justify-center text-sm font-semibold text-gray-500">
                  Loading your courses...
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                  <h2 className="text-lg font-semibold text-gray-900">No courses found</h2>
                  <p className="mt-3 text-sm text-gray-600">
                    {activeTab === 'completed'
                      ? 'Complete a course to see it here and share your review.'
                      : 'Browse the marketplace to start learning with mentors you trust.'}
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filteredCourses.map((course) => (
                    <MyLearningCourseCard
                      key={`${activeTab}-${course.id}`}
                      course={course}
                      status={activeTab}
                      onLeaveReview={(selected) => setSelectedCourse(selected)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      {selectedCourse && (
        <LeaveReviewModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onSubmitted={() => setSelectedCourse(null)}
        />
      )}

      <Footer />
    </div>
  );
}

export default MyLearningPage;