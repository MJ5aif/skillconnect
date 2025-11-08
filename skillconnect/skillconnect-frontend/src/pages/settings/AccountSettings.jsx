import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase/config';
import SettingsLayout from '../../components/settings/SettingsLayout';
import { FaEnvelope, FaLock, FaExclamationTriangle } from 'react-icons/fa';

const AccountSettings = () => {
  const [email] = useState('john.doe@example.com');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePasswordReset = async () => {
    setIsProcessing(true);
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent! Please check your inbox.');
    } catch (error) {
      console.error('Error sending password reset:', error);
      alert('Failed to send password reset email. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!newEmail.trim() || !newEmail.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setIsProcessing(true);
    try {
      // TODO: Implement email change via Firebase
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Email change request sent! Please check both your old and new email for verification.');
      setShowChangeEmailModal(false);
      setNewEmail('');
    } catch (error) {
      console.error('Error changing email:', error);
      alert('Failed to change email. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      alert('Please type DELETE to confirm account deletion');
      return;
    }

    setIsProcessing(true);
    try {
      // TODO: Implement account deletion
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Account deletion initiated. You will be logged out shortly.');
      // Redirect to login or home page
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again or contact support.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SettingsLayout>
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Account & Security</h1>

        <div className="space-y-6">
          {/* Email Address Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <FaEnvelope className="text-blue-600 text-xl" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Email Address</h2>
                <p className="text-gray-600 mb-4">
                  Your current email: <span className="font-medium">{email.replace(/(.{2})(.*)(@.*)/, '$1***$3')}</span>
                </p>
                <button
                  onClick={() => setShowChangeEmailModal(true)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Change Email
                </button>
              </div>
            </div>
          </div>

          {/* Password Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                <FaLock className="text-teal-600 text-xl" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Password</h2>
                <p className="text-gray-600 mb-4">
                  Keep your account secure by using a strong password
                </p>
                <button
                  onClick={handlePasswordReset}
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Sending...' : 'Change Password'}
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-red-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <FaExclamationTriangle className="text-red-600 text-xl" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-red-700 mb-2">Danger Zone</h2>
                <p className="text-gray-600 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                >
                  Delete My Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Email Modal */}
      {showChangeEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Change Email Address</h3>
            <p className="text-gray-600 text-sm mb-4">
              Enter your new email address. You'll need to verify both your current and new email.
            </p>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="new.email@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowChangeEmailModal(false);
                  setNewEmail('');
                }}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleChangeEmail}
                disabled={isProcessing}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <FaExclamationTriangle className="text-red-600 text-xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Delete Account</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </p>
            <p className="text-gray-800 font-semibold text-sm mb-2">
              Please type <span className="text-red-600">DELETE</span> to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Type DELETE"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                }}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isProcessing || deleteConfirmation !== 'DELETE'}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </SettingsLayout>
  );
};

export default AccountSettings;
