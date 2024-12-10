import React from 'react';
import { NetworkStats } from '../../types/network';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface UniverseStatusProps {
  stats: NetworkStats;
}

const UniverseStatus: React.FC<UniverseStatusProps> = ({ stats }) => {
  const getStatusIcon = (status: 'active' | 'inactive' | 'error') => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {Array.from({ length: 64 }, (_, i) => i + 1).map(universe => {
        const universeStats = stats.universeStats.get(universe);
        const status = universeStats?.active ? 'active' : 'inactive';

        return (
          <div
            key={universe}
            className={`p-2 rounded-lg border ${
              status === 'active'
                ? 'border-green-500/20 bg-green-500/10'
                : 'border-gray-700 bg-gray-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Universe {universe}</span>
              {getStatusIcon(status)}
            </div>
            {status === 'active' && (
              <div className="mt-1 text-xs text-gray-500">
                {universeStats?.packetsPerSecond} pps
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UniverseStatus;