import { Outlet } from 'react-router-dom';
import TeacherSidebar from '../components/teacher/TeacherSidebar';

const TeacherDashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default TeacherDashboardLayout;
