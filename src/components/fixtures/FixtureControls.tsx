import React from 'react';
import { Sliders, Palette, Maximize, RotateCw } from 'lucide-react';
import { Fixture, Channel } from '../../types/fixtures';
import { useFixtureStore } from '../../store/fixtureStore';

interface FixtureControlsProps {
  fixture: Fixture;
}

const FixtureControls: React.FC<FixtureControlsProps> = ({ fixture }) => {
  const { updateFixture } = useFixtureStore();

  const handleChannelChange = (channelId: number, value: number) => {
    const updatedChannels = fixture.channels.map(channel =>
      channel.id === channelId ? { ...channel, defaultValue: value } : channel
    );
    updateFixture(fixture.id, { channels: updatedChannels });
  };

  const renderChannelControl = (channel: Channel) => {
    const icons = {
      intensity: <Sliders className="h-4 w-4" />,
      color: <Palette className="h-4 w-4" />,
      zoom: <Maximize className="h-4 w-4" />,
      pan: <RotateCw className="h-4 w-4" />
    };

    return (
      <div key={channel.id} className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-300">
            {icons[channel.type as keyof typeof icons]}
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
          onChange={(e) => handleChannelChange(channel.id, Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    );
  };

  return (
    <div className="space-y-4 p-4 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-4">
        {fixture.name} Controls
      </h3>
      <div className="space-y-6">
        {fixture.channels.map(renderChannelControl)}
      </div>
    </div>
  );
};

export default FixtureControls;