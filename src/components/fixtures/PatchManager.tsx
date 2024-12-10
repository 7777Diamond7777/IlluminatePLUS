import React, { useState } from 'react';
import { Plus, Upload, Download, Search } from 'lucide-react';
import FixtureList from './FixtureList';
import FixtureForm from './forms/FixtureForm';
import { useFixtureStore } from '../../store/fixtureStore';
import { Fixture } from '../../types/fixtures';
import { fixtureProfiles } from '../../utils/fixtures/fixtureProfiles';
import { validateFixture } from '../../utils/fixtures/fixtureValidation';

const PatchManager: React.FC = () => {
  const [isAddingFixture, setIsAddingFixture] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { fixtures, addFixture } = useFixtureStore();

  const handleAddFixture = (fixture: Fixture) => {
    const errors = validateFixture(fixture);
    if (errors.length > 0) {
      console.error('Validation errors:', errors);
      return;
    }
    addFixture(fixture);
    setIsAddingFixture(false);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            data.fixtures.forEach((fixture: Fixture) => {
              addFixture(fixture);
            });
          } catch (error) {
            console.error('Error importing fixtures:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExport = () => {
    const data = {
      fixtures,
      version: '1.0',
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fixture-patch.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Fixture Patch Manager</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleImport}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
          >
            <Upload className="h-4 w-4" />
            <span>Import</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setIsAddingFixture(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
          >
            <Plus className="h-4 w-4" />
            <span>Add Fixture</span>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search fixtures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FixtureList
            fixtures={fixtures.filter(f =>
              f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              f.type.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            viewMode="list"
            searchQuery={searchQuery}
          />
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Available Profiles</h3>
          <div className="space-y-2">
            {Object.entries(fixtureProfiles).map(([id, profile]) => (
              <div
                key={id}
                className="p-3 bg-gray-800 rounded-lg hover:bg-gray-600 cursor-pointer"
                onClick={() => setIsAddingFixture(true)}
              >
                <h4 className="font-medium text-white">{profile.name}</h4>
                <p className="text-sm text-gray-400">{profile.manufacturer}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {profile.modes.length} modes available
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isAddingFixture && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl">
            <FixtureForm
              onSubmit={handleAddFixture}
              onCancel={() => setIsAddingFixture(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PatchManager;