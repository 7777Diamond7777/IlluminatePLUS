import { SACNUniverse, MulticastConfig } from '../types/sacn';

class SACNService {
  private static instance: SACNService;
  private universes: Map<number, SACNUniverse> = new Map();
  private socket: WebSocket | null = null;
  
  private constructor() {
    this.initializeWebSocket();
  }

  static getInstance(): SACNService {
    if (!SACNService.instance) {
      SACNService.instance = new SACNService();
    }
    return SACNService.instance;
  }

  private initializeWebSocket() {
    // In production, replace with your actual WebSocket server address
    this.socket = new WebSocket('ws://localhost:3000');
    
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'sacn-update') {
        this.handleSACNUpdate(data.universe, data.values);
      }
    };
  }

  private handleSACNUpdate(universeId: number, values: number[]) {
    const universe = this.universes.get(universeId);
    if (universe) {
      universe.slots = values;
      this.notifySubscribers(universeId);
    }
  }

  private subscribers: Map<number, Set<(values: number[]) => void>> = new Map();

  subscribe(universeId: number, callback: (values: number[]) => void) {
    if (!this.subscribers.has(universeId)) {
      this.subscribers.set(universeId, new Set());
    }
    this.subscribers.get(universeId)?.add(callback);
  }

  unsubscribe(universeId: number, callback: (values: number[]) => void) {
    this.subscribers.get(universeId)?.delete(callback);
  }

  private notifySubscribers(universeId: number) {
    const universe = this.universes.get(universeId);
    if (universe) {
      this.subscribers.get(universeId)?.forEach(callback => {
        callback(universe.slots);
      });
    }
  }

  sendDMXValues(universeId: number, values: number[]) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'dmx-update',
        universe: universeId,
        values
      }));
    }
  }
}

export default SACNService;