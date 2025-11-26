import { Outlet } from 'react-router-dom';
import SettingsSidebar from '../components/settings/SettingsSidebar';

const SettingsLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <SettingsSidebar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SettingsLayout;
