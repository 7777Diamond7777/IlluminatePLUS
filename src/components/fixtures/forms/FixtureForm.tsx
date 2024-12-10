import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Fixture, Channel } from '../../../types/fixtures';
import { fixtureProfiles, createFixtureFromProfile } from '../../../utils/fixtures/fixtureProfiles';

interface FixtureFormProps {
  onSubmit: (fixture: Fixture) => void;
  onCancel: () => void;
  initialFixture?: Fixture;
}

const FixtureForm: React.FC<FixtureFormProps> = ({
  onSubmit,
  onCancel,
  initialFixture
}) => {
  const [selectedProfile, setSelectedProfile] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [universe, setUniverse] = useState(initialFixture?.universe || 1);
  const [address, setAddress] = useState(initialFixture?.address || 1);
  const [name, setName] = useState(initialFixture?.name || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProfile || !selectedMode) return;

    const fixture = createFixtureFromProfile(selectedProfile, universe, address, selectedMode);
    fixture.name = name || fixture.name;
    
    onSubmit(fixture);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Add New Fixture</h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-gray-700 rounded-lg"
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Fixture Profile
          </label>
          <select
            value={selectedProfile}
            onChange={(e) => setSelectedProfile(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            required
          >
            <option value="">Select a profile...</option>
            {Object.entries(fixtureProfiles).map(([id, profile]) => (
              <option key={id} value={id}>
                {profile.manufacturer} - {profile.name}
              </option>
            ))}
          </select>
        </div>

        {selectedProfile && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Mode
            </label>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              required
            >
              <option value="">Select a mode...</option>
              {fixtureProfiles[selectedProfile].modes.map((mode) => (
                <option key={mode.name} value={mode.name}>
                  {mode.name} ({mode.channels.length} channels)
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Custom Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter custom name (optional)"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Universe
            </label>
            <input
              type="number"
              min="1"
              max="64"
              value={universe}
              onChange={(e) => setUniverse(Number(e.target.value))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Start Address
            </label>
            <input
              type="number"
              min="1"
              max="512"
              value={address}
              onChange={(e) => setAddress(Number(e.target.value))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
        >
          Add Fixture
        </button>
      </div>
    </form>
  );
};

export default FixtureForm;