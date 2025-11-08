import { Link } from 'react-router-dom';

const footerLinks = [
  { label: 'About', to: '/about' },
  { label: 'Help', to: '/help' },
  { label: 'Terms', to: '/terms' },
  { label: 'Privacy', to: '/privacy' },
];

function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="font-medium text-gray-700">© {new Date().getFullYear()} SkillConnect. All rights reserved.</p>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {footerLinks.map((link) => (
            <Link key={link.label} to={link.to} className="transition hover:text-brand-blue">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
