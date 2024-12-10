import React, { useState } from 'react';
import { Clock, Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { ShowTimeline, ShowCue } from '../types/dmx';
import { format } from 'date-fns';
import { useDMXStore } from '../store/dmxStore';

interface ShowTimelineProps {
  timeline: ShowTimeline;
}

const ShowTimelineView: React.FC<ShowTimelineProps> = ({ timeline }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentCueId, setCurrentCueId] = useState<string | null>(null);
  const { presets, applyPreset } = useDMXStore();

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && timeline.cues.length > 0) {
      const firstCue = timeline.cues[0];
      setCurrentCueId(firstCue.id);
      applyPreset(firstCue.presetId);
    }
  };

  const handleNext = () => {
    if (!currentCueId || timeline.cues.length === 0) return;
    
    const currentIndex = timeline.cues.findIndex(cue => cue.id === currentCueId);
    if (currentIndex === -1) return;
    
    const nextIndex = (currentIndex + 1) % timeline.cues.length;
    const nextCue = timeline.cues[nextIndex];
    
    setCurrentCueId(nextCue.id);
    applyPreset(nextCue.presetId);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-white">{timeline.name}</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePlayPause}
            className="p-2 rounded-lg hover:bg-gray-700 text-gray-300"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-lg hover:bg-gray-700 text-gray-300"
          >
            <SkipForward className="h-5 w-5" />
          </button>
          {timeline.isLooped && (
            <RotateCcw className="h-4 w-4 text-yellow-500" />
          )}
        </div>
      </div>

      <div className="space-y-2">
        {timeline.cues.map((cue, index) => {
          const preset = presets.find(p => p.id === cue.presetId);
          
          return (
            <div
              key={cue.id}
              className={`p-3 rounded-lg border ${
                currentCueId === cue.id
                  ? 'border-yellow-500 bg-yellow-500/10'
                  : 'border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white font-medium">
                    {index + 1}. {cue.name}
                  </span>
                  <p className="text-sm text-gray-400">
                    {preset?.name || 'Unknown preset'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-400">
                    {format(cue.transitionTime, 's.SS')}s
                  </span>
                  <p className="text-xs text-gray-500">
                    Hold: {format(cue.holdTime, 's')}s
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShowTimelineView;