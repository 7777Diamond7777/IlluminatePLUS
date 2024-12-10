import React from 'react';
import { Sun, Users, Thermometer } from 'lucide-react';
import { ArenaZone } from '../types/dmx';
import { useDMXStore } from '../store/dmxStore';

interface ArenaStatusProps extends ArenaZone {}

const statusColors = {
  operational: 'bg-green-500',
  maintenance: 'bg-yellow-500',
  offline: 'bg-red-500'
};

const ArenaStatus = ({ id, name, brightness, status, temperature, occupancy }: ArenaStatusProps) => {
  const { updateZoneBrightness } = useDMXStore();

  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateZoneBrightness(id, Number(e.target.value));
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-all">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-white">{name}</h3>
        <div className={`h-3 w-3 rounded-full ${statusColors[status]}`} />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-gray-300">
          <Sun className="h-5 w-5" />
          <div className="flex-1">
            <div className="h-2 bg-gray-700 rounded-full">
              <div 
                className="h-2 bg-blue-500 rounded-full transition-all"
                style={{ width: `${brightness}%` }}
              />
            </div>
          </div>
          <input
            type="number"
            value={brightness}
            onChange={handleBrightnessChange}
            className="w-16 bg-gray-700 rounded px-2 py-1 text-sm"
            min="0"
            max="100"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2 text-gray-300">
            <Thermometer className="h-4 w-4" />
            <span className="text-sm">{temperature}°C</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-300">
            <Users className="h-4 w-4" />
            <span className="text-sm">{occupancy.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArenaStatus;