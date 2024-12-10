import { create } from 'zustand';
import { DMXUniverse, DMXPreset, ArenaZone } from '../types/dmx';

interface DMXStore {
  universes: DMXUniverse[];
  presets: DMXPreset[];
  zones: ArenaZone[];
  activePreset: number | null;
  setChannelValue: (universeId: number, channelId: number, value: number) => void;
  applyPreset: (presetId: number) => void;
  updateZoneBrightness: (zoneId: number, brightness: number) => void;
  updateZoneStatus: (zoneId: number, status: ArenaZone['status']) => void;
}

export const useDMXStore = create<DMXStore>((set) => ({
  universes: Array.from({ length: 4 }, (_, i) => ({
    id: i + 1,
    name: `Universe ${i + 1}`,
    channelCount: 512,
    channels: Array.from({ length: 512 }, (_, j) => ({
      id: j + 1,
      value: 0,
      function: 'Intensity',
      fixture: `Fixture ${Math.floor(j / 16) + 1}`
    }))
  })),
  presets: [
    {
      id: 1,
      name: 'Full House',
      description: 'All house lights at 100%',
      values: {}
    },
    {
      id: 2,
      name: 'Performance',
      description: 'Stage lights up, house down',
      values: {}
    }
  ],
  zones: [
    {
      id: 1,
      name: 'Main Stage',
      universeIds: [1, 2],
      brightness: 85,
      status: 'operational',
      temperature: 22,
      occupancy: 8500
    },
    {
      id: 2,
      name: 'Upper Bowl',
      universeIds: [3],
      brightness: 65,
      status: 'maintenance',
      temperature: 23,
      occupancy: 1200
    }
  ],
  activePreset: null,
  
  setChannelValue: (universeId, channelId, value) =>
    set((state) => ({
      universes: state.universes.map((universe) =>
        universe.id === universeId
          ? {
              ...universe,
              channels: universe.channels.map((channel) =>
                channel.id === channelId ? { ...channel, value } : channel
              )
            }
          : universe
      )
    })),
    
  applyPreset: (presetId) =>
    set((state) => {
      const preset = state.presets.find((p) => p.id === presetId);
      if (!preset) return state;
      
      return {
        activePreset: presetId,
        universes: state.universes.map((universe) => ({
          ...universe,
          channels: universe.channels.map((channel) => ({
            ...channel,
            value: preset.values[`${universe.id}.${channel.id}`] ?? channel.value
          }))
        }))
      };
    }),
    
  updateZoneBrightness: (zoneId, brightness) =>
    set((state) => ({
      zones: state.zones.map((zone) =>
        zone.id === zoneId ? { ...zone, brightness } : zone
      )
    })),
    
  updateZoneStatus: (zoneId, status) =>
    set((state) => ({
      zones: state.zones.map((zone) =>
        zone.id === zoneId ? { ...zone, status } : zone
      )
    }))
}));