export interface NetworkStats {
  connected: boolean;
  latency: number;
  packetsPerSecond: number;
  errors: string[];
  universeStats: Map<number, UniverseStats>;
}

export interface UniverseStats {
  active: boolean;
  packetsPerSecond: number;
  lastPacketTime: number;
  errors: number;
}

export interface NetworkError {
  timestamp: number;
  type: 'connection' | 'packet' | 'universe';
  message: string;
  universe?: number;
}