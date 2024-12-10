import { v4 as uuidv4 } from 'uuid';
import { Fixture, Channel, ChannelType } from '../../types/fixtures';

export interface FixtureProfile {
  name: string;
  manufacturer: string;
  modes: {
    name: string;
    channels: {
      name: string;
      type: ChannelType;
      range?: { min: number; max: number };
      defaultValue?: number;
    }[];
  }[];
}

export const fixtureProfiles: Record<string, FixtureProfile> = {
  'generic-moving-head': {
    name: 'Generic Moving Head',
    manufacturer: 'Generic',
    modes: [
      {
        name: 'Standard',
        channels: [
          { name: 'Intensity', type: 'intensity', range: { min: 0, max: 255 } },
          { name: 'Pan', type: 'pan', range: { min: 0, max: 540 } },
          { name: 'Tilt', type: 'tilt', range: { min: 0, max: 270 } },
          { name: 'Color', type: 'color' },
          { name: 'Gobo', type: 'gobo' },
          { name: 'Focus', type: 'focus' },
          { name: 'Zoom', type: 'zoom' }
        ]
      }
    ]
  },
  'led-par': {
    name: 'LED PAR',
    manufacturer: 'Generic',
    modes: [
      {
        name: 'RGB',
        channels: [
          { name: 'Red', type: 'color', range: { min: 0, max: 255 } },
          { name: 'Green', type: 'color', range: { min: 0, max: 255 } },
          { name: 'Blue', type: 'color', range: { min: 0, max: 255 } }
        ]
      },
      {
        name: 'RGBW',
        channels: [
          { name: 'Red', type: 'color', range: { min: 0, max: 255 } },
          { name: 'Green', type: 'color', range: { min: 0, max: 255 } },
          { name: 'Blue', type: 'color', range: { min: 0, max: 255 } },
          { name: 'White', type: 'color', range: { min: 0, max: 255 } }
        ]
      }
    ]
  },
  'beam-mover': {
    name: 'Beam Mover',
    manufacturer: 'Generic',
    modes: [
      {
        name: 'Extended',
        channels: [
          { name: 'Intensity', type: 'intensity', range: { min: 0, max: 255 } },
          { name: 'Pan', type: 'pan', range: { min: 0, max: 540 } },
          { name: 'Pan Fine', type: 'pan', range: { min: 0, max: 255 } },
          { name: 'Tilt', type: 'tilt', range: { min: 0, max: 270 } },
          { name: 'Tilt Fine', type: 'tilt', range: { min: 0, max: 255 } },
          { name: 'Color Wheel', type: 'color' },
          { name: 'Gobo Wheel', type: 'gobo' },
          { name: 'Gobo Rotation', type: 'gobo' },
          { name: 'Prism', type: 'prism' },
          { name: 'Prism Rotation', type: 'prism' },
          { name: 'Focus', type: 'focus' },
          { name: 'Zoom', type: 'zoom' },
          { name: 'Frost', type: 'frost' },
          { name: 'Control', type: 'control' }
        ]
      }
    ]
  },
  'matrix-panel': {
    name: 'LED Matrix Panel',
    manufacturer: 'Generic',
    modes: [
      {
        name: 'Pixel',
        channels: Array.from({ length: 64 }, (_, i) => ({
          name: `Pixel ${i + 1}`,
          type: 'intensity',
          range: { min: 0, max: 255 }
        }))
      },
      {
        name: 'RGB Pixel',
        channels: Array.from({ length: 64 }, (_, i) => [
          { name: `Pixel ${i + 1} Red`, type: 'color', range: { min: 0, max: 255 } },
          { name: `Pixel ${i + 1} Green`, type: 'color', range: { min: 0, max: 255 } },
          { name: `Pixel ${i + 1} Blue`, type: 'color', range: { min: 0, max: 255 } }
        ]).flat()
      }
    ]
  }
};

export function createFixtureFromProfile(
  profileId: string,
  universe: number,
  address: number,
  mode = 'Standard'
): Fixture {
  const profile = fixtureProfiles[profileId];
  if (!profile) throw new Error(`Profile ${profileId} not found`);

  const selectedMode = profile.modes.find(m => m.name === mode);
  if (!selectedMode) throw new Error(`Mode ${mode} not found in profile ${profileId}`);

  const channels: Channel[] = selectedMode.channels.map((channel, index) => ({
    id: index + 1,
    name: channel.name,
    type: channel.type,
    defaultValue: channel.defaultValue || 0,
    range: channel.range
  }));

  return {
    id: uuidv4(),
    name: `${profile.name} ${universe}.${address}`,
    type: profile.name,
    universe,
    address,
    mode,
    channels,
    position: { x: 0, y: 2, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  };
}