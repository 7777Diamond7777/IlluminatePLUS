import React from 'react';
import { Sliders, Lightbulb, Save } from 'lucide-react';
import { useDMXStore } from '../store/dmxStore';

const DMXControls = () => {
  const { universes, setChannelValue } = useDMXStore();
  const [selectedUniverse, setSelectedUniverse] = React.useState(universes[0].id);
  const [expandedFixture, setExpandedFixture] = React.useState<string | null>(null);

  const handleChannelChange = (channelId: number, value: number) => {
    setChannelValue(selectedUniverse, channelId, value);
  };

  const currentUniverse = universes.find(u => u.id === selectedUniverse);
  const fixtures = currentUniverse?.channels.reduce<Record<string, number[]>>((acc, channel) => {
    if (!acc[channel.fixture]) {
      acc[channel.fixture] = [];
    }
    acc[channel.fixture].push(channel.id);
    return acc;
  }, {});

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Sliders className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-white">DMX Control Panel</h3>
        </div>
        
        <select
          className="bg-gray-700 text-gray-300 rounded px-2 py-1"
          value={selectedUniverse}
          onChange={(e) => setSelectedUniverse(Number(e.target.value))}
        >
          {universes.map((universe) => (
            <option key={universe.id} value={universe.id}>
              {universe.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {fixtures && Object.entries(fixtures).map(([fixtureName, channels]) => (
          <div key={fixtureName} className="border border-gray-700 rounded-lg">
            <button
              className="w-full p-3 flex items-center justify-between text-gray-300 hover:bg-gray-700"
              onClick={() => setExpandedFixture(expandedFixture === fixtureName ? null : fixtureName)}
            >
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-4 w-4" />
                <span>{fixtureName}</span>
              </div>
              <span className="text-sm text-gray-500">{channels.length} channels</span>
            </button>
            
            {expandedFixture === fixtureName && (
              <div className="p-3 space-y-2 border-t border-gray-700">
                {channels.map((channelId) => {
                  const channel = currentUniverse?.channels.find(c => c.id === channelId);
                  if (!channel) return null;
                  
                  return (
                    <div key={channelId} className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400 w-24">
                        Ch {channelId} ({channel.function})
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="255"
                        value={channel.value}
                        onChange={(e) => handleChannelChange(channelId, Number(e.target.value))}
                        className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-sm text-gray-400 w-12 text-right">
                        {channel.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DMXControls;