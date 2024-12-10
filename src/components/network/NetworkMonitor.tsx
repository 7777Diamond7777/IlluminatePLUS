import React, { useEffect, useState } from 'react';
import { Activity, Wifi, AlertTriangle, Clock } from 'lucide-react';
import NetworkManager from '../../services/dmx/networkManager';
import { NetworkStats } from '../../types/network';
import NetworkGraph from './NetworkGraph';
import UniverseStatus from './UniverseStatus';

const NetworkMonitor: React.FC = () => {
  const [stats, setStats] = useState<NetworkStats>({
    connected: false,
    latency: 0,
    packetsPerSecond: 0,
    errors: [],
    universeStats: new Map()
  });

  useEffect(() => {
    const networkManager = NetworkManager.getInstance();
    const interval = setInterval(() => {
      const status = networkManager.getNetworkStatus();
      setStats(prev => ({
        ...prev,
        ...status
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Activity className="h-6 w-6 text-blue-500" />
          <span>Network Monitor</span>
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Wifi className={`h-5 w-5 ${stats.connected ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`${stats.connected ? 'text-green-500' : 'text-red-500'}`}>
              {stats.connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <span className="text-gray-300">{stats.latency}ms</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Real-time Metrics</h3>
            <NetworkGraph stats={stats} />
          </div>

          {stats.errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-semibold text-red-500">Network Alerts</h3>
              </div>
              <ul className="space-y-2">
                {stats.errors.map((error, index) => (
                  <li key={index} className="text-red-400 text-sm">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Universe Status</h3>
          <div className="space-y-2">
            <UniverseStatus stats={stats} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkMonitor;