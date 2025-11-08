import { useState, useRef } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';
import SettingsLayout from '../../components/settings/SettingsLayout';
import { FaCamera, FaTimes } from 'react-icons/fa';

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    displayName: 'John Doe',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&size=200&background=0D8ABC&color=fff',
    headline: 'MERN Stack Mentor & Web Developer',
    bio: 'Passionate educator with 5+ years of experience in full-stack development. I love helping students master modern web technologies.',
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript', 'Tailwind CSS']
  });

  const [newSkill, setNewSkill] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      // Upload to Firebase Storage
      const storageRef = ref(storage, `avatars/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      setProfile(prev => ({ ...prev, avatar: downloadURL }));
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Save to Firebase/backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SettingsLayout>
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Public Profile</h1>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Avatar Section */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Profile Picture
            </label>
            <div className="flex items-center gap-6">
              <div className="relative group">
                <img
                  src={profile.avatar}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-md"
                />
                {isUploading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent" />
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <FaCamera className="text-white text-2xl" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {isUploading ? 'Uploading...' : 'Change Picture'}
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Display Name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={profile.displayName}
              onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your name"
            />
          </div>

          {/* Headline */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Professional Headline
            </label>
            <input
              type="text"
              value={profile.headline}
              onChange={(e) => setProfile(prev => ({ ...prev, headline: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., MERN Stack Mentor & Web Developer"
            />
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Detailed Bio
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Skills */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Skills
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-red-600 transition-colors"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a skill (press Enter)"
              />
              <button
                onClick={handleAddSkill}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
};

export default ProfileSettings;
