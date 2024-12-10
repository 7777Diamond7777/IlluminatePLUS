import { v4 as uuidv4 } from 'uuid';

export interface DMXUniverse {
  id: number;
  name: string;
  channelCount: number;
  channels: DMXChannel[];
}

export interface DMXChannel {
  id: number;
  value: number;
  function: string;
  fixture: string;
}

export interface ArenaZone {
  id: number;
  name: string;
  universeIds: number[];
  brightness: number;
  status: 'operational' | 'maintenance' | 'offline';
  temperature: number;
  occupancy: number;
  fixtureGroups: FixtureGroup[];
}

export interface DMXPreset {
  id: string;
  name: string;
  description: string;
  tags: string[];
  createdAt: Date;
  modifiedAt: Date;
  values: Record<number, number>;
  transitionTime?: number;
  isTemplate?: boolean;
}

export interface FixtureGroup {
  id: string;
  name: string;
  fixtures: string[];
  color?: string;
}

export interface ShowCue {
  id: string;
  name: string;
  presetId: string;
  transitionTime: number;
  holdTime: number;
  nextCueId?: string;
}

export interface ShowTimeline {
  id: string;
  name: string;
  cues: ShowCue[];
  isLooped: boolean;
}

export const createPreset = (
  name: string,
  description: string,
  values: Record<number, number>,
  tags: string[] = []
): DMXPreset => ({
  id: uuidv4(),
  name,
  description,
  tags,
  values,
  createdAt: new Date(),
  modifiedAt: new Date(),
  transitionTime: 2000
});

export const createFixtureGroup = (
  name: string,
  fixtures: string[] = []
): FixtureGroup => ({
  id: uuidv4(),
  name,
  fixtures,
  color: `#${Math.floor(Math.random()*16777215).toString(16)}`
});