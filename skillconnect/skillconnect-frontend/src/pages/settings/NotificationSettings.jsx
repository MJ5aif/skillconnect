import { useState } from 'react';
import SettingsLayout from '../../components/settings/SettingsLayout';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import { FaBell } from 'react-icons/fa';

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    newMessage: true,
    newOrder: true,
    postReplies: false,
    announcements: true,
    emailDigest: false,
    marketingEmails: false
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (key, value) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Save to backend/Firebase
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Notification preferences updated successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const notificationItems = [
    {
      key: 'newMessage',
      title: 'New Message in my Inbox',
      description: 'Get notified when someone sends you a message'
    },
    {
      key: 'newOrder',
      title: 'New Order (for Teachers)',
      description: 'Receive alerts when a student books your service'
    },
    {
      key: 'postReplies',
      title: 'Community Post Replies',
      description: 'Get notified when someone replies to your posts'
    },
    {
      key: 'announcements',
      title: 'Platform Announcements',
      description: 'Stay updated with important platform news and updates'
    },
    {
      key: 'emailDigest',
      title: 'Weekly Email Digest',
      description: 'Receive a weekly summary of your activity'
    },
    {
      key: 'marketingEmails',
      title: 'Marketing & Promotional Emails',
      description: 'Get updates about new features and special offers'
    }
  ];

  return (
    <SettingsLayout>
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Notification Preferences</h1>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-100 to-blue-100 flex items-center justify-center">
              <FaBell className="text-blue-600 text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Manage Notifications</h2>
              <p className="text-sm text-gray-600">Choose what notifications you want to receive</p>
            </div>
          </div>

          <div className="space-y-6">
            {notificationItems.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex-1 pr-4">
                  <h3 className="text-base font-semibold text-gray-800 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.description}
                  </p>
                </div>
                <ToggleSwitch
                  enabled={notifications[item.key]}
                  onChange={(value) => handleToggle(item.key, value)}
                />
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Changes are saved automatically
              </p>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
};

export default NotificationSettings;
