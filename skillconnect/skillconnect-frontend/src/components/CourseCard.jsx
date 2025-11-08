import { Link } from 'react-router-dom';

function CourseCard({ course }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-brand-blue">
        <span>{course.category}</span>
        <span className="text-gray-300">•</span>
        <span>{course.level}</span>
      </div>

      <h3 className="mt-3 text-lg font-semibold text-gray-900">{course.title}</h3>
      <p className="mt-2 flex-1 text-sm text-gray-500">{course.description}</p>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">{course.mentor}</p>
          <p className="text-xs text-gray-500">{course.sessions} sessions • {course.duration}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">Starting at</p>
          <p className="text-lg font-bold text-brand-teal">${course.price}</p>
        </div>
      </div>

      {typeof course.progress === 'number' && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-brand-blue"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>
      )}

      <Link
        to={course.href}
        className="mt-6 inline-flex items-center justify-center rounded-full border border-brand-blue px-4 py-2 text-sm font-semibold text-brand-blue transition hover:bg-brand-blue hover:text-white"
      >
        View Details
      </Link>
    </article>
  );
}

export default CourseCard;
