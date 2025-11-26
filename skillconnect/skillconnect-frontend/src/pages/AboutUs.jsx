const teamMembers = [
  {
    name: 'Robin Dey Rudro',
    title: 'UX and Frontend Design',
    description:
      'Crafts intuitive product journeys and visual systems that make SkillConnect feel welcoming for every learner and mentor.',
  },
  {
    name: 'Md.Abdullah Al Saim',
    title: 'Backend Development',
    description:
      'Builds the reliable infrastructure behind SkillConnect, ensuring secure authentication, real-time data, and scalable services.',
  },
  {
    name: 'Md.Monowar Jahan Saif',
    title: 'Deployment & Integration',
    description:
      'Owns cloud deployment, DevOps, and integrations so new features reach the community quickly and safely.',
  },
];

function AboutUs() {
  return (
    <>
      <main className="flex-1">
        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-blue">Our Mission</p>
            <h1 className="mt-4 text-4xl font-bold text-gray-900 sm:text-5xl">
              SkillConnect is a community service platform linking learners and mentors across Bangladesh.
            </h1>
            <p className="mt-6 text-lg text-gray-700">
              We started SkillConnect to bridge the opportunity gap faced by learners who want practical skills but lack access to
              mentors. By blending cohort-based learning, on-demand coaching, and curated service listings, we make expertise more
              accessible for everyone.
            </p>
            <div className="mt-10 grid gap-8 rounded-3xl bg-gray-100 p-8 sm:grid-cols-2">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Problem Statements</h2>
                <p className="mt-4 text-base text-gray-700">
                  Traditional classrooms rarely provide individualized guidance, and talented local mentors struggle to reach the
                  learners who need them most. We built SkillConnect to give mentors a streamlined way to productize their services
                  while helping learners discover trusted guidance that fits their goals, schedule, and budget.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Our Vision</h2>
                <p className="mt-4 text-base text-gray-700">
                  We imagine a future where skill-based education is collaborative, transparent, and inclusive. Every learner should
                  be able to track their progress, join live sessions, and book targeted mentorship without friction. Every mentor
                  should have the tools to showcase their expertise, launch offerings, and earn fairly for their time.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-blue">Meet the Team</p>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">The creators behind SkillConnect</h2>
            <p className="mt-3 text-base text-gray-600">
              A multidisciplinary team aligned around the same goal: empower learners and mentors through thoughtful technology.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <article key={member.name} className="flex h-full flex-col rounded-3xl bg-white p-8 shadow-xl">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue/10 text-xl font-bold text-brand-blue">
                  {member.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-gray-900">{member.name}</h3>
                <p className="mt-2 text-sm font-medium uppercase tracking-wide text-brand-blue">{member.title}</p>
                <p className="mt-4 text-base text-gray-600">{member.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-r from-brand-blue to-teal-500 p-10 text-white shadow-2xl">
              <h2 className="text-3xl font-bold sm:text-4xl">Building together for mastery and mentorship</h2>
              <p className="mt-4 text-lg text-white/90">
                Whether you&apos;re joining as a learner or a mentor, SkillConnect is designed to help you grow. Explore curated pathways,
                book focused sessions, and unlock professional opportunities through community-powered learning.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/signup"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-brand-blue shadow-lg transition hover:bg-gray-100"
                >
                  Join SkillConnect
                </a>
                <a
                  href="/browse"
                  className="rounded-full border border-white/70 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white/10"
                >
                  Discover mentors
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      </main>
    </>
  );
}

export default AboutUs;
