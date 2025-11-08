import { useState } from 'react';

const ToggleSwitch = ({ enabled = false, onChange, disabled = false }) => {
  const [isEnabled, setIsEnabled] = useState(enabled);

  const handleToggle = () => {
    if (disabled) return;
    const newState = !isEnabled;
    setIsEnabled(newState);
    if (onChange) {
      onChange(newState);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={disabled}
      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        isEnabled
          ? 'bg-gradient-to-r from-teal-500 to-blue-600'
          : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
          isEnabled ? 'translate-x-8' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

export default ToggleSwitch;
