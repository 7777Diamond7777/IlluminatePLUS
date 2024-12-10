import { EventEmitter } from '../../utils/events/EventEmitter';
import { NetworkStats, NetworkError, UniverseStats } from '../../types/network';

class NetworkDiagnostics extends EventEmitter {
  private static instance: NetworkDiagnostics;
  private stats: NetworkStats;
  private errorHistory: NetworkError[] = [];
  private packetCounters: Map<number, number> = new Map();
  private lastUpdate: number = Date.now();

  private constructor() {
    super();
    this.stats = {
      connected: false,
      latency: 0,
      packetsPerSecond: 0,
      errors: [],
      universeStats: new Map()
    };
    this.startMonitoring();
  }

  static getInstance(): NetworkDiagnostics {
    if (!NetworkDiagnostics.instance) {
      NetworkDiagnostics.instance = new NetworkDiagnostics();
    }
    return NetworkDiagnostics.instance;
  }

  private startMonitoring() {
    setInterval(() => this.updateStats(), 1000);
  }

  private updateStats() {
    const now = Date.now();
    const elapsed = (now - this.lastUpdate) / 1000;

    // Update packets per second
    this.packetCounters.forEach((count, universe) => {
      const pps = count / elapsed;
      const stats = this.stats.universeStats.get(universe) || {
        active: false,
        packetsPerSecond: 0,
        lastPacketTime: 0,
        errors: 0
      };

      stats.packetsPerSecond = pps;
      stats.active = pps > 0;
      this.stats.universeStats.set(universe, stats);
      this.packetCounters.set(universe, 0);
    });

    this.lastUpdate = now;
    this.emit('statsUpdated', this.stats);
  }

  recordPacket(universe: number) {
    const current = this.packetCounters.get(universe) || 0;
    this.packetCounters.set(universe, current + 1);

    const stats = this.stats.universeStats.get(universe) || {
      active: true,
      packetsPerSecond: 0,
      lastPacketTime: Date.now(),
      errors: 0
    };
    stats.lastPacketTime = Date.now();
    this.stats.universeStats.set(universe, stats);
  }

  recordError(error: NetworkError) {
    this.errorHistory.push(error);
    this.stats.errors = this.errorHistory
      .slice(-5)
      .map(e => e.message);

    if (error.universe) {
      const stats = this.stats.universeStats.get(error.universe);
      if (stats) {
        stats.errors++;
        this.stats.universeStats.set(error.universe, stats);
      }
    }

    this.emit('error', error);
  }

  getStats(): NetworkStats {
    return this.stats;
  }

  getErrorHistory(): NetworkError[] {
    return this.errorHistory;
  }

  clearErrorHistory() {
    this.errorHistory = [];
    this.stats.errors = [];
    this.emit('errorsCleared');
  }
}

export default NetworkDiagnostics.getInstance();