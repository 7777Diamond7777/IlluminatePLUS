import React from 'react';
import { Settings, Move } from 'lucide-react';
import { Fixture, ViewMode } from '../../types/fixtures';
import { useFixtureStore } from '../../store/fixtureStore';

interface FixtureListProps {
  fixtures: Fixture[];
  viewMode: ViewMode;
  searchQuery: string;
}

const FixtureList: React.FC<FixtureListProps> = ({ fixtures, viewMode, searchQuery }) => {
  const { updateFixture } = useFixtureStore();

  const filteredFixtures = fixtures.filter(fixture =>
    fixture.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fixture.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`grid ${viewMode === 'grid' ? 'grid-cols-3' : 'grid-cols-1'} gap-4`}>
      {filteredFixtures.map(fixture => (
        <div
          key={fixture.id}
          className="bg-gray-700 rounded-lg p-4 hover:border-blue-500 border border-transparent transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">{fixture.name}</h3>
            <div className="flex items-center space-x-2">
              <button className="p-1 hover:bg-gray-600 rounded">
                <Move className="h-4 w-4 text-gray-400" />
              </button>
              <button className="p-1 hover:bg-gray-600 rounded">
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
      ))}
    </div>
  );
};

export default FixtureList;