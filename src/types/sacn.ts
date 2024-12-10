export interface SACNUniverse {
  id: number;
  priority: number;
  startCode: number;
  slots: number[];
}

export interface MulticastConfig {
  address: string;
  port: number;
  ttl: number;
  sourceAddress: string;
}

export interface AIShowConfig {
  tempo: number;
  intensity: number;
  complexity: number;
  mood: 'energetic' | 'calm' | 'dramatic' | 'ambient';
}

export interface ShowSequence {
  id: string;
  name: string;
  duration: number;
  frames: ShowFrame[];
}

export interface ShowFrame {
  timestamp: number;
  universeValues: Record<number, number[]>;
}