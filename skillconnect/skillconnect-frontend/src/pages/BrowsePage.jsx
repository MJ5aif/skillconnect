import { useMemo, useState } from 'react';
import CourseCard from '../components/CourseCard.jsx';
import TeacherCard from '../components/TeacherCard.jsx';

const categories = ['Design', 'Development', 'Career', 'Marketing', 'Security'];
const skills = ['UI/UX', 'Figma', 'React', 'Leadership', 'Cybersecurity', 'Interview Prep', 'Data Analysis'];

const listings = [
  {
    id: 'ux-mentor-lab',
    type: 'course',
    title: 'UX Mentor Lab: Weekly Design Critiques',
    description: 'Level up your portfolio with mentor-led critiques and collaborative challenges.',
    mentor: 'Robin Dey Rudro',
    category: 'Design',
    level: 'Intermediate',
    sessions: 6,
    duration: '6 weeks',
    price: 149,
    priceTier: '$$',
    rating: 4.8,
    skills: ['UI/UX', 'Figma'],
    href: '/courses/ux-mentor-lab',
  },
  {
    id: 'career-sprint',
    type: 'course',
    title: 'Career Sprint: Portfolio to First Job',
    description: 'Structured roadmap, job stories, and interview prep tailored for Bangladeshi learners.',
    mentor: 'Md.Abdullah Al Saim',
    category: 'Career',
    level: 'Advanced',
    sessions: 4,
    duration: '4 weeks',
    price: 99,
    priceTier: '$',
    rating: 4.6,
    skills: ['Leadership', 'Interview Prep'],
    href: '/courses/career-sprint',
  },
  {
    id: 'frontend-zero-to-hero',
    type: 'course',
    title: 'Frontend Zero to Hero',
    description: 'Step-by-step mastery of modern frontend development with real-world projects.',
    mentor: 'Shafin Chowdhury',
    category: 'Development',
    level: 'Beginner',
    sessions: 10,
    duration: '8 weeks',
    price: 0,
    priceTier: 'Free',
    rating: 4.4,
    skills: ['React', 'UI/UX'],
    href: '/courses/frontend-zero-to-hero',
  },
  {
    id: 'mentor-sadia',
    type: 'mentor',
    name: 'Sadia Khan',
    specialty: 'Product Design Mentor',
    bio: 'Senior Product Designer helping emerging talent build job-ready portfolios.',
    rating: 4.9,
    skills: ['UI/UX', 'Portfolio Review', 'Design Systems'],
    startingPrice: 35,
    priceTier: '$$',
    category: 'Design',
    href: '/mentors/sadia-khan',
  },
  {
    id: 'mentor-rahim',
    type: 'mentor',
    name: 'Rahim Uddin',
    specialty: 'Full-Stack Mentor',
    bio: 'CTO-level guidance for developers scaling their careers and startups.',
    rating: 4.7,
    skills: ['React', 'Leadership', 'Career Coaching'],
    startingPrice: 45,
    priceTier: '$$$',
    category: 'Development',
    href: '/mentors/rahim-uddin',
  },
  {
    id: 'mentor-samia',
    type: 'mentor',
    name: 'Samia Rahman',
    specialty: 'Cybersecurity Coach',
    bio: 'Helping learners master ethical hacking, threat modeling, and SOC workflows.',
    rating: 4.5,
    skills: ['Cybersecurity', 'Interview Prep'],
    startingPrice: 28,
    priceTier: '$',
    category: 'Security',
    href: '/mentors/samia-rahman',
  },
];

const ratingOptions = [
  { label: '4.5 stars & up', value: 4.5 },
  { label: '4.0 stars & up', value: 4.0 },
  { label: '3.0 stars & up', value: 3.0 },
];

const priceOptions = ['All', 'Free', '$', '$$', '$$$'];

function BrowsePage() {
  const [serviceType, setServiceType] = useState('All');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [ratingThreshold, setRatingThreshold] = useState(null);
  const [priceTier, setPriceTier] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSelection = (value, setter) => {
    setter((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      if (serviceType !== 'All' && item.type !== (serviceType === 'Courses' ? 'course' : 'mentor')) {
        return false;
      }

      if (selectedCategories.length > 0 && !selectedCategories.includes(item.category)) {
        return false;
      }

      if (selectedSkills.length > 0) {
        const itemSkills = item.skills || [];
        const hasSkillMatch = selectedSkills.some((skill) => itemSkills.includes(skill));
        if (!hasSkillMatch) {
          return false;
        }
      }

      if (ratingThreshold && item.rating < ratingThreshold) {
        return false;
      }

      if (priceTier !== 'All' && item.priceTier !== priceTier) {
        return false;
      }

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const haystack = `${item.title || item.name} ${item.description || ''} ${item.bio || ''} ${item.mentor || ''}`.toLowerCase();
        if (!haystack.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [serviceType, selectedCategories, selectedSkills, ratingThreshold, priceTier, searchTerm]);

  return (
    <>
      <main className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <aside className="hidden w-72 shrink-0 rounded-3xl bg-white p-6 shadow-xl lg:block">
          <div className="sticky top-24 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Search</p>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search services, mentors, or skills"
                className="mt-3 w-full rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            <details open>
              <summary className="cursor-pointer text-sm font-semibold text-gray-900">Service Type</summary>
              <div className="mt-3 space-y-2 text-sm">
                {['All', 'Courses', '1-on-1 Mentors'].map((option) => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="serviceType"
                      value={option}
                      checked={serviceType === option}
                      onChange={() => setServiceType(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </details>

            <details open>
              <summary className="cursor-pointer text-sm font-semibold text-gray-900">Topics & Categories</summary>
              <div className="mt-3 space-y-2 text-sm">
                {categories.map((category) => (
                  <label key={category} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleSelection(category, setSelectedCategories)}
                    />
                    {category}
                  </label>
                ))}
              </div>
            </details>

            <details>
              <summary className="cursor-pointer text-sm font-semibold text-gray-900">Skills</summary>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {skills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSelection(skill, setSelectedSkills)}
                    className={`rounded-full px-3 py-1 font-semibold ${
                      selectedSkills.includes(skill)
                        ? 'bg-brand-blue text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-brand-blue/10 hover:text-brand-blue'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </details>

            <details>
              <summary className="cursor-pointer text-sm font-semibold text-gray-900">Rating</summary>
              <div className="mt-3 space-y-2 text-sm">
                {ratingOptions.map((option) => (
                  <label key={option.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="rating"
                      value={option.value}
                      checked={ratingThreshold === option.value}
                      onChange={() => setRatingThreshold(option.value)}
                    />
                    {option.label}
                  </label>
                ))}
                <button
                  type="button"
                  onClick={() => setRatingThreshold(null)}
                  className="text-xs font-semibold text-brand-blue"
                >
                  Clear rating filter
                </button>
              </div>
            </details>

            <details>
              <summary className="cursor-pointer text-sm font-semibold text-gray-900">Price</summary>
              <div className="mt-3 space-y-2 text-sm">
                {priceOptions.map((option) => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="price"
                      value={option}
                      checked={priceTier === option}
                      onChange={() => setPriceTier(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </details>
          </div>
        </aside>

        <section className="flex-1">
          <header className="rounded-3xl bg-white p-6 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">Marketplace</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">Browse services and mentors</h1>
            <p className="mt-3 text-sm text-gray-600">
              Apply filters to fine-tune your search across self-paced courses and personalized mentorship experiences.
            </p>
          </header>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredListings.length > 0 ? (
              filteredListings.map((item) =>
                item.type === 'course' ? (
                  <CourseCard key={item.id} course={item} />
                ) : (
                  <TeacherCard key={item.id} mentor={item} />
                ),
              )
            ) : (
              <div className="col-span-full rounded-3xl bg-white p-12 text-center shadow-xl">
                <h2 className="text-xl font-semibold text-gray-900">No matches yet</h2>
                <p className="mt-3 text-sm text-gray-600">
                  Try adjusting your filters or search query to discover more mentors and courses.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      </main>
    </>
  );
}

export default BrowsePage;
