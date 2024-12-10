export interface Fixture {
  id: string;
  name: string;
  type: string;
  universe: number;
  address: number;
  mode: string;
  channels: Channel[];
  position?: Position3D;
  rotation?: Rotation3D;
  group?: string;
}

export interface Channel {
  id: number;
  name: string;
  type: ChannelType;
  defaultValue?: number;
  range?: {
    min: number;
    max: number;
  };
}

export type ChannelType =
  | 'intensity'
  | 'pan'
  | 'tilt'
  | 'color'
  | 'gobo'
  | 'focus'
  | 'zoom'
  | 'prism'
  | 'frost'
  | 'control';

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface Rotation3D {
  x: number;
  y: number;
  z: number;
}

export interface FixtureGroup {
  id: string;
  name: string;
  fixtures: string[];
  color?: string;
}

export type ViewMode = 'grid' | 'list' | '3d';