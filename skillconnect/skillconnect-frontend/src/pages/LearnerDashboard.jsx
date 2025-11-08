import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

function LearnerDashboard() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-3xl rounded-3xl bg-white p-12 text-center shadow-xl">
          <h1 className="text-3xl font-bold text-gray-900">Learner Dashboard</h1>
          <p className="mt-4 text-lg text-gray-600">
            Thanks for signing in! The full learner dashboard experience is being built next. For now, this placeholder confirms your
            successful authentication and redirect flow.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default LearnerDashboard;
