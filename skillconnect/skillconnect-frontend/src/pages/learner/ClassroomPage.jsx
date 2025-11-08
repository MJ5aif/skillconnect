import { useMemo, useState } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import LearnerSidebar from '../../components/learner/LearnerSidebar.jsx';

const modules = [
  {
    id: 'module-1',
    title: 'Module 1 • Foundations',
    description: 'Frame problems and understand your learner journey before wireframing.',
    lessons: [
      {
        id: 'lesson-1',
        title: 'Lesson 1 • Classroom Orientation',
        duration: '12 min',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        resources: ['Orientation Slides.pdf', 'Session Checklist.txt'],
      },
      {
        id: 'lesson-2',
        title: 'Lesson 2 • Learner Outcomes',
        duration: '18 min',
        videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        resources: ['Learning Outcomes Canvas.docx'],
      },
    ],
  },
  {
    id: 'module-2',
    title: 'Module 2 • Design Sprints',
    description: 'Prototype with mentors asynchronously and iterate faster.',
    lessons: [
      {
        id: 'lesson-3',
        title: 'Lesson 3 • Sprint Planning',
        duration: '22 min',
        videoUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
        resources: ['Sprint Board Template.fig', 'Mentor Feedback Loop.md'],
      },
      {
        id: 'lesson-4',
        title: 'Lesson 4 • Usability Testing',
        duration: '27 min',
        videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        resources: ['Test Script Template.pdf', 'Participant Outreach Email.eml'],
      },
    ],
  },
  {
    id: 'module-3',
    title: 'Module 3 • Career Toolkit',
    description: 'Package your outcomes into portfolios and interview stories.',
    lessons: [
      {
        id: 'lesson-5',
        title: 'Lesson 5 • Case Study Deep Dive',
        duration: '16 min',
        videoUrl: 'https://www.w3schools.com/html/movie.mp4',
        resources: ['Case Study Outline.docx', 'Portfolio Grid.fig'],
      },
      {
        id: 'lesson-6',
        title: 'Lesson 6 • Interview Readiness',
        duration: '24 min',
        videoUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
        resources: ['Interview Tracker.xlsx', 'Mentor Feedback Notes.docx'],
      },
    ],
  },
];

const qaThreads = [
  {
    id: 'thread-1',
    author: 'Ayesha Rahman',
    role: 'Learner',
    message: 'How detailed should the sprint retrospective be for submission?',
    responses: [
      {
        id: 'response-1',
        author: 'Robin Dey Rudro',
        role: 'Mentor',
        message: 'Aim for a 2-page narrative with screenshots of key decisions and next steps.',
      },
    ],
  },
  {
    id: 'thread-2',
    author: 'Tanvir Hasan',
    role: 'Learner',
    message: 'Any examples of strong interview stories from past cohorts?',
    responses: [
      {
        id: 'response-2',
        author: 'Nazrin Hossain',
        role: 'Career Mentor',
        message: 'Check the Case Study Deep Dive resources — we included two anonymized recordings with annotations.',
      },
    ],
  },
];

const announcements = [
  {
    id: 'announcement-1',
    title: 'Sprint Demo Submissions',
    detail: 'Upload your sprint demo by Sunday 11:59 PM. Late submissions lose peer review slots.',
    date: 'Posted 2 days ago',
  },
  {
    id: 'announcement-2',
    title: 'Mentor AMA Session',
    detail: 'Join the live AMA on Thursday at 8 PM for case study feedback and portfolio reviews.',
    date: 'Posted yesterday',
  },
];

function ClassroomPage() {
  const [expandedModules, setExpandedModules] = useState(() => modules.map((module) => module.id));
  const [currentLesson, setCurrentLesson] = useState(modules[0].lessons[0]);
  const [activeTab, setActiveTab] = useState('notes');
  const [notes, setNotes] = useState('');

    const currentModule = useMemo(
      () => modules.find((module) => module.lessons.some((lesson) => lesson.id === currentLesson.id)),
      [currentLesson],
    );

    const currentResources = useMemo(
      () => currentLesson.resources ?? [],
      [currentLesson],
    );

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId],
    );
  };

  const renderTabContent = () => {
    if (activeTab === 'notes') {
      return (
        <div className="space-y-4">
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Capture key takeaways, action items, or timestamps..."
            className="min-h-[200px] w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 shadow-inner focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
          />
          <p className="text-xs text-gray-500">Notes autosave will arrive later — copy elsewhere before leaving the page.</p>
        </div>
      );
    }

    if (activeTab === 'qa') {
      return (
        <div className="space-y-6">
          {qaThreads.map((thread) => (
            <div key={thread.id} className="rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{thread.author}</p>
                  <p className="text-xs uppercase tracking-wide text-gray-400">{thread.role}</p>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-500 transition hover:border-brand-blue hover:text-brand-blue"
                >
                  Follow
                </button>
              </div>
              <p className="mt-3 text-sm text-gray-700">{thread.message}</p>
              <div className="mt-4 space-y-4 border-t border-gray-100 pt-4">
                {thread.responses.map((response) => (
                  <div key={response.id} className="rounded-xl bg-brand-blue/5 p-3">
                    <p className="text-sm font-semibold text-brand-blue">{response.author}</p>
                    <p className="text-xs uppercase tracking-wide text-brand-blue/60">{response.role}</p>
                    <p className="mt-2 text-sm text-brand-blue/90">{response.message}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
            Posting is coming soon. Bring your questions to the AMA in the meantime.
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {announcements.map((announcementItem) => (
          <div key={announcementItem.id} className="rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-gray-400">{announcementItem.date}</p>
            <h3 className="mt-2 text-lg font-semibold text-gray-900">{announcementItem.title}</h3>
            <p className="mt-3 text-sm text-gray-700">{announcementItem.detail}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-900">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-10 text-white sm:px-6 lg:px-8">
        <LearnerSidebar />
        <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <main className="space-y-6">
            <div className="overflow-hidden rounded-3xl bg-black shadow-2xl">
              <div className="aspect-video bg-black">
                <video
                  key={currentLesson.id}
                  controls
                  className="h-full w-full rounded-3xl object-cover"
                  src={currentLesson.videoUrl}
                >
                  <track kind="captions" srcLang="en" label="English" />
                </video>
              </div>
              <div className="space-y-2 p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue/80">Currently playing</p>
                <h1 className="text-2xl font-bold text-white">{currentLesson.title}</h1>
                <p className="text-sm text-gray-400">{currentModule?.title}</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{currentLesson.duration}</p>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 text-gray-900 shadow-xl">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'notes', label: 'Notes' },
                  { id: 'qa', label: 'Q&A' },
                  { id: 'announcements', label: 'Announcements' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      activeTab === tab.id
                        ? 'bg-brand-blue text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="mt-6">{renderTabContent()}</div>
            </div>

            <section className="rounded-3xl bg-white/10 p-6">
              <h2 className="text-lg font-semibold text-white">Resources</h2>
              {currentResources.length === 0 ? (
                <p className="mt-3 text-sm text-gray-400">No resources attached yet.</p>
              ) : (
                <ul className="mt-4 space-y-3 text-sm text-gray-200">
                  {currentResources.map((resource) => (
                    <li key={resource} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                      <span>{resource}</span>
                      <button
                        type="button"
                        className="rounded-full border border-white/30 px-3 py-1 text-xs font-semibold text-white transition hover:border-white hover:bg-white/10"
                      >
                        Download
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </main>

          <aside className="rounded-3xl bg-white p-6 text-gray-900 shadow-xl lg:sticky lg:top-24 lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900">Curriculum</h2>
            <p className="mt-2 text-sm text-gray-500">Track progress and jump between lessons without leaving the classroom.</p>
            <div className="mt-6 space-y-4">
              {modules.map((module) => {
                const isExpanded = expandedModules.includes(module.id);
                return (
                  <div key={module.id} className="rounded-2xl border border-gray-100">
                    <button
                      type="button"
                      onClick={() => toggleModule(module.id)}
                      className="flex w-full items-center justify-between rounded-2xl bg-gray-50 px-4 py-3 text-left"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{module.title}</p>
                        <p className="text-xs text-gray-500">{module.description}</p>
                      </div>
                      <span className="text-xs font-semibold text-brand-blue">
                        {isExpanded ? 'Hide' : 'Show'}
                      </span>
                    </button>
                    {isExpanded && (
                      <ul className="divide-y divide-gray-100">
                        {module.lessons.map((lesson) => {
                          const isActiveLesson = lesson.id === currentLesson.id;
                          return (
                            <li key={lesson.id}>
                              <button
                                type="button"
                                onClick={() => {
                                  setCurrentLesson(lesson);
                                  setActiveTab('notes');
                                }}
                                className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition ${
                                  isActiveLesson
                                    ? 'bg-brand-blue/10 font-semibold text-brand-blue'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                              >
                                <span>{lesson.title}</span>
                                <span className="text-xs text-gray-400">{lesson.duration}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ClassroomPage;
