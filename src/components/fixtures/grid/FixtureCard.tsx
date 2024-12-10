import React from 'react';
import { Settings, Move } from 'lucide-react';
import { Fixture } from '../../../types/fixtures';

interface FixtureCardProps {
  fixture: Fixture;
  onEdit: () => void;
  onMove: () => void;
}

const FixtureCard: React.FC<FixtureCardProps> = ({ fixture, onEdit, onMove }) => {
  return (
    <div className="bg-gray-700 rounded-lg p-4 hover:border-blue-500 border border-transparent transition-all">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-white">{fixture.name}</h3>
        <div className="flex items-center space-x-2">
          <button 
            onClick={onMove}
            className="p-1 hover:bg-gray-600 rounded"
          >
            <Move className="h-4 w-4 text-gray-400" />
          </button>
          <button 
            onClick={onEdit}
            className="p-1 hover:bg-gray-600 rounded"
          >
            <Settings className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Type:</span>
          <span className="text-white">{fixture.type}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Universe:</span>
          <span className="text-white">{fixture.universe}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Address:</span>
          <span className="text-white">{fixture.address}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Mode:</span>
          <span className="text-white">{fixture.mode}</span>
        </div>
      </div>
    </div>
  );
};

export default FixtureCard;