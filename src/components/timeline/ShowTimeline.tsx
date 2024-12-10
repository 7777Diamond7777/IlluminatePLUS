import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat } from 'lucide-react';
import ShowEngine from '../../services/dmx/showEngine';
import { formatTime } from '../../utils/timeUtils';

const ShowTimeline: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loop, setLoop] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const engine = ShowEngine.getInstance();

    const handleFrameUpdate = (data: { time: number }) => {
      setCurrentTime(data.time);
    };

    const handleShowLoaded = () => {
      setDuration(engine.getDuration());
    };

    const handlePlaybackStarted = () => setIsPlaying(true);
    const handlePlaybackPaused = () => setIsPlaying(false);
    const handlePlaybackStopped = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    engine.on('frameUpdate', handleFrameUpdate);
    engine.on('showLoaded', handleShowLoaded);
    engine.on('playbackStarted', handlePlaybackStarted);
    engine.on('playbackPaused', handlePlaybackPaused);
    engine.on('playbackStopped', handlePlaybackStopped);

    return () => {
      engine.off('frameUpdate', handleFrameUpdate);
      engine.off('showLoaded', handleShowLoaded);
      engine.off('playbackStarted', handlePlaybackStarted);
      engine.off('playbackPaused', handlePlaybackPaused);
      engine.off('playbackStopped', handlePlaybackStopped);
    };
  }, []);

  const handlePlayPause = () => {
    const engine = ShowEngine.getInstance();
    if (isPlaying) {
      engine.pause();
    } else {
      engine.play();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const time = percentage * duration;

    ShowEngine.getInstance().seekToTime(time);
  };

  const handleLoop = () => {
    const newLoop = !loop;
    setLoop(newLoop);
    ShowEngine.getInstance().setLoop(newLoop);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => ShowEngine.getInstance().seekToTime(0)}
            className="p-2 hover:bg-gray-700 rounded-lg"
          >
            <SkipBack className="h-5 w-5 text-gray-400" />
          </button>
          <button
            onClick={handlePlayPause}
            className="p-2 hover:bg-gray-700 rounded-lg"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 text-gray-400" />
            ) : (
              <Play className="h-5 w-5 text-gray-400" />
            )}
          </button>
          <button
            onClick={() => ShowEngine.getInstance().seekToTime(duration)}
            className="p-2 hover:bg-gray-700 rounded-lg"
          >
            <SkipForward className="h-5 w-5 text-gray-400" />
          </button>
          <button
            onClick={handleLoop}
            className={`p-2 rounded-lg ${
              loop ? 'bg-blue-500 text-white' : 'hover:bg-gray-700 text-gray-400'
            }`}
          >
            <Repeat className="h-5 w-5" />
          </button>
        </div>
        <div className="text-gray-400 space-x-2 text-sm">
          <span>{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div
        ref={progressBarRef}
        className="h-2 bg-gray-700 rounded-full cursor-pointer"
        onClick={handleSeek}
      >
        <div
          className="h-full bg-blue-500 rounded-full relative"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        >
          <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
        </div>
      </div>
    </div>
  );
};

export default ShowTimeline;