import { Link } from 'react-router-dom';
import { HiOutlineStar } from 'react-icons/hi';

function TeacherCard({ mentor }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
        <div className="flex items-center gap-1 text-sm font-semibold text-yellow-500">
          <HiOutlineStar className="h-4 w-4" />
          <span>{mentor.rating.toFixed(1)}</span>
        </div>
      </div>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-brand-blue">{mentor.specialty}</p>
      <p className="mt-3 flex-1 text-sm text-gray-500">{mentor.bio}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {mentor.skills.map((skill) => (
          <span key={skill} className="rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue">
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">Starting from</p>
          <p className="text-lg font-bold text-brand-teal">${mentor.startingPrice}</p>
        </div>
        <Link
          to={mentor.href}
          className="rounded-full border border-brand-blue px-4 py-2 text-sm font-semibold text-brand-blue transition hover:bg-brand-blue hover:text-white"
        >
          View Profile
        </Link>
      </div>
    </article>
  );
}

export default TeacherCard;
