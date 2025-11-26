import { Outlet } from 'react-router-dom';
import LearnerSidebar from '../components/learner/LearnerSidebar';

const LearnerDashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <LearnerSidebar />
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default LearnerDashboardLayout;
