import React from 'react';
import { Save, Play, Plus } from 'lucide-react';
import { useDMXStore } from '../store/dmxStore';

const PresetControls = () => {
  const { presets, applyPreset, activePreset } = useDMXStore();

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Save className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-white">Lighting Presets</h3>
        </div>
        
        <button className="flex items-center space-x-1 bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-lg text-sm transition-colors">
          <Plus className="h-4 w-4" />
          <span>New Preset</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => applyPreset(preset.id)}
            className={`p-3 rounded-lg border transition-all ${
              activePreset === preset.id
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-gray-700 hover:border-purple-500'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-white">{preset.name}</span>
              <Play className="h-4 w-4 text-purple-500" />
            </div>
            <p className="text-sm text-gray-400 text-left">{preset.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PresetControls;