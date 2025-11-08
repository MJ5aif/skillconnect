import SettingsSidebar from './SettingsSidebar';

const SettingsLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <SettingsSidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SettingsLayout;
