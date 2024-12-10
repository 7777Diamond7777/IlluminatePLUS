import React from 'react';
import { Sliders, Palette, Maximize, RotateCw } from 'lucide-react';
import { Channel } from '../../../types/fixtures';

interface ChannelControlProps {
  channel: Channel;
  onChange: (value: number) => void;
}

const channelIcons = {
  intensity: <Sliders className="h-4 w-4" />,
  color: <Palette className="h-4 w-4" />,
  zoom: <Maximize className="h-4 w-4" />,
  pan: <RotateCw className="h-4 w-4" />
};

const ChannelControl: React.FC<ChannelControlProps> = ({ channel, onChange }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-gray-300">
          {channelIcons[channel.type as keyof typeof channelIcons]}
          <span>{channel.name}</span>
        </div>
        <span className="text-sm text-gray-400">
          {channel.defaultValue || 0}
        </span>
      </div>
      <input
        type="range"
        min={channel.range?.min || 0}
        max={channel.range?.max || 255}
        value={channel.defaultValue || 0}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};

export default ChannelControl;