import { SACNUniverse } from '../../types/sacn';
import { EventEmitter } from '../../utils/events/EventEmitter';

class UniverseManager extends EventEmitter {
  private universes: Map<number, SACNUniverse> = new Map();
  private static instance: UniverseManager;

  private constructor() {
    super();
    // Initialize with 64 universes (industry maximum)
    for (let i = 1; i <= 64; i++) {
      this.universes.set(i, {
        id: i,
        priority: 100,
        startCode: 0,
        slots: new Array(512).fill(0)
      });
    }
  }

  static getInstance(): UniverseManager {
    if (!UniverseManager.instance) {
      UniverseManager.instance = new UniverseManager();
    }
    return UniverseManager.instance;
  }

  getUniverse(id: number): SACNUniverse | undefined {
    return this.universes.get(id);
  }

  setChannelValue(universe: number, channel: number, value: number): void {
    const targetUniverse = this.universes.get(universe);
    if (targetUniverse && channel >= 0 && channel < 512) {
      targetUniverse.slots[channel] = value;
      this.emit('channelUpdate', { universe, channel, value });
    }
  }

  setMultipleChannels(universe: number, startChannel: number, values: number[]): void {
    const targetUniverse = this.universes.get(universe);
    if (targetUniverse) {
      values.forEach((value, index) => {
        const channel = startChannel + index;
        if (channel < 512) {
          targetUniverse.slots[channel] = value;
        }
      });
      this.emit('bulkUpdate', { universe, startChannel, values });
    }
  }

  getChannelValue(universe: number, channel: number): number {
    return this.universes.get(universe)?.slots[channel] ?? 0;
  }

  clearUniverse(universe: number): void {
    const targetUniverse = this.universes.get(universe);
    if (targetUniverse) {
      targetUniverse.slots.fill(0);
      this.emit('universeCleared', universe);
    }
  }

  clearAllUniverses(): void {
    this.universes.forEach((universe) => {
      universe.slots.fill(0);
    });
    this.emit('allUniversesCleared');
  }

  subscribeToUniverse(universe: number, callback: (slots: number[]) => void): () => void {
    return this.on('universeUpdate', (data: { universe: number; slots: number[] }) => {
      if (data.universe === universe) {
        callback(data.slots);
      }
    });
  }
}

export default UniverseManager.getInstance();