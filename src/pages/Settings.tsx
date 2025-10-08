import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Settings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure your application preferences and account settings.
          </p>
        </div>
      </div>
      
      <div className="card p-8 text-center">
        <p className="text-gray-500">Settings page coming soon...</p>
      </div>
    </div>
  );
};

export default Settings;