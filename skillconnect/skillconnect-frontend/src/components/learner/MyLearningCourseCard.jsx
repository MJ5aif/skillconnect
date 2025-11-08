import { Link } from 'react-router-dom';

function MyLearningCourseCard({ course, status, onLeaveReview }) {
  const isCompleted = status === 'completed';

  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-brand-blue">
        <span>{course.category}</span>
        <span className="text-gray-300">•</span>
        <span>{course.level}</span>
      </div>

      <h3 className="mt-3 text-lg font-semibold text-gray-900">{course.title}</h3>
      <p className="mt-2 flex-1 text-sm text-gray-500">{course.description}</p>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div>
          <p className="font-semibold text-gray-900">{course.mentor}</p>
          <p className="text-xs text-gray-500">{course.sessions} sessions • {course.duration}</p>
        </div>
        <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue">
          {isCompleted ? 'Completed' : 'In Progress'}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
          <span>Progress</span>
          <span>{course.progress}%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-brand-blue" style={{ width: `${course.progress}%` }} />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          to={`/dashboard/learn/classroom/${course.id}`}
          className="inline-flex flex-1 items-center justify-center rounded-full border border-brand-blue px-4 py-2 text-sm font-semibold text-brand-blue transition hover:bg-brand-blue hover:text-white"
        >
          {isCompleted ? 'Review Lessons' : 'Resume Course'}
        </Link>
        {isCompleted && (
          <button
            type="button"
            onClick={() => onLeaveReview?.(course)}
            className="inline-flex flex-1 items-center justify-center rounded-full bg-brand-teal px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-600"
          >
            Leave a Review
          </button>
        )}
      </div>
    </article>
  );
}

export default MyLearningCourseCard;
