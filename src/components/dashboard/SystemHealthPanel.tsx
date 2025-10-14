import React from 'react';

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  services: {
    database: 'up' | 'down';
    api: 'up' | 'down';
  };
}

interface SystemHealthPanelProps {
  healthStatus: HealthStatus | null;
}

export const SystemHealthPanel: React.FC<SystemHealthPanelProps> = ({ healthStatus }) => {
  if (!healthStatus) {
    return null;
  }

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">System Status</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Current system health</p>
        </div>
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            healthStatus.status === 'healthy'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {healthStatus.status === 'healthy' ? 'All systems operational' : 'Issues detected'}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <div
            className={`h-2 w-2 rounded-full mr-2 ${
              healthStatus.services.database === 'up' ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-sm text-gray-600 dark:text-gray-300">Database</span>
        </div>
        <div className="flex items-center">
          <div
            className={`h-2 w-2 rounded-full mr-2 ${
              healthStatus.services.api === 'up' ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-sm text-gray-600 dark:text-gray-300">API</span>
        </div>
      </div>
    </div>
  );
};