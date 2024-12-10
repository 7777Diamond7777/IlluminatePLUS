import React from 'react';
import { FolderPlus, Folder } from 'lucide-react';
import { useFixtureStore } from '../../store/fixtureStore';

const FixtureGroups: React.FC = () => {
  const { groups, activeGroup, setActiveGroup } = useFixtureStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Groups</h3>
        <button className="p-1 hover:bg-gray-700 rounded">
          <FolderPlus className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      <div className="space-y-2">
        {groups.map(group => (
          <button
            key={group.id}
            onClick={() => setActiveGroup(group.id)}
            className={`w-full flex items-center space-x-2 p-2 rounded-lg transition-colors ${
              activeGroup === group.id
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Folder className="h-4 w-4" />
            <span>{group.name}</span>
            <span className="ml-auto text-sm opacity-75">
              {group.fixtures.length}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FixtureGroups;