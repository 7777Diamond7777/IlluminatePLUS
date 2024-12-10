import React, { useState } from 'react';
import { Grid, Box, Layers, Search, Plus } from 'lucide-react';
import FixtureList from './FixtureList';
import FixtureGroups from './FixtureGroups';
import FixtureVisualizer from './FixtureVisualizer3D';
import { useFixtureStore } from '../../store/fixtureStore';
import { ViewMode } from '../../types/fixtures';

const FixtureManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const { fixtures } = useFixtureStore();

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${
              viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Grid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${
              viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Box className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('3d')}
            className={`p-2 rounded-lg ${
              viewMode === '3d' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Layers className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search fixtures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
            <Plus className="h-5 w-5" />
            <span>Add Fixture</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1">
          <FixtureGroups />
        </div>
        <div className="col-span-3">
          {viewMode === '3d' ? (
            <FixtureVisualizer />
          ) : (
            <FixtureList
              fixtures={fixtures}
              viewMode={viewMode}
              searchQuery={searchQuery}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FixtureManager;