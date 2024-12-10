import React from 'react';
import { AlertCircle, Bell } from 'lucide-react';

interface Alert {
  id: number;
  type: 'warning' | 'danger' | 'info';
  message: string;
  timestamp: string;
}

const alerts: Alert[] = [
  {
    id: 1,
    type: 'warning',
    message: 'Arena 3 brightness below optimal levels',
    timestamp: '2 min ago'
  },
  {
    id: 2,
    type: 'danger',
    message: 'Emergency lighting activated in Arena 7',
    timestamp: '5 min ago'
  },
  {
    id: 3,
    type: 'info',
    message: 'Scheduled maintenance completed for Arena 5',
    timestamp: '10 min ago'
  }
];

const alertStyles = {
  warning: 'bg-yellow-500/10 border-yellow-500 text-yellow-500',
  danger: 'bg-red-500/10 border-red-500 text-red-500',
  info: 'bg-blue-500/10 border-blue-500 text-blue-500'
};

const AlertSystem = () => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-white">Active Alerts</h3>
        </div>
        <span className="bg-blue-500 text-xs px-2 py-1 rounded-full text-white">
          {alerts.length} New
        </span>
      </div>
      
      <div className="space-y-3">
        {alerts.map(alert => (
          <div
            key={alert.id}
            className={`p-3 rounded-lg border ${alertStyles[alert.type]} flex items-start space-x-3`}
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm">{alert.message}</p>
              <span className="text-xs opacity-75">{alert.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertSystem;