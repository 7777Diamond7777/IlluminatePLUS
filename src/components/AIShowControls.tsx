import React, { useState, useEffect } from 'react';
import { Wand2, AlertCircle, Play, Save, Loader2 } from 'lucide-react';
import showGenerator from '../services/ai/showGenerator';
import { AIShowConfig } from '../types/sacn';
import { useDMXStore } from '../store/dmxStore';
import ShowEngine from '../services/dmx/showEngine';

const AIShowControls: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<AIShowConfig>({
    tempo: 120,
    intensity: 75,
    complexity: 50,
    mood: 'energetic'
  });

  useEffect(() => {
    const initializeAI = async () => {
      try {
        await showGenerator.initialize();
        setError(null);
      } catch (err) {
        setError('Failed to initialize AI system');
      }
    };

    initializeAI();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const show = await showGenerator.generateShow(config);
      ShowEngine.getInstance().loadShow(show);
      ShowEngine.getInstance().play();
    } catch (err) {
      setError('Failed to generate show');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Wand2 className="h-5 w-5 text-indigo-500" />
          <h3 className="text-lg font-semibold text-white">AI Show Generator</h3>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg flex items-center space-x-2 text-red-500">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm text-gray-400">Tempo (BPM)</label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="60"
              max="200"
              value={config.tempo}
              onChange={(e) => setConfig({ ...config, tempo: Number(e.target.value) })}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-400 w-12">{config.tempo}</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-gray-400">Intensity</label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="100"
              value={config.intensity}
              onChange={(e) => setConfig({ ...config, intensity: Number(e.target.value) })}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-400 w-12">{config.intensity}%</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-gray-400">Complexity</label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="100"
              value={config.complexity}
              onChange={(e) => setConfig({ ...config, complexity: Number(e.target.value) })}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-400 w-12">{config.complexity}%</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-gray-400">Mood</label>
          <select
            value={config.mood}
            onChange={(e) => setConfig({ ...config, mood: e.target.value as AIShowConfig['mood'] })}
            className="w-full bg-gray-700 text-gray-300 rounded px-3 py-2"
          >
            <option value="energetic">Energetic</option>
            <option value="dramatic">Dramatic</option>
            <option value="ambient">Ambient</option>
            <option value="calm">Calm</option>
          </select>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Generate & Play</span>
              </>
            )}
          </button>
          <button
            onClick={() => {/* TODO: Save current show */}}
            className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
          >
            <Save className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIShowControls;