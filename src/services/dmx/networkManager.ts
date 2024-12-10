import { io, Socket } from 'socket.io-client';
import UniverseManager from './universeManager';
import { MulticastConfig } from '../../types/sacn';

class NetworkManager {
  private socket: Socket | null = null;
  private static instance: NetworkManager;
  private multicastConfig: MulticastConfig = {
    address: '239.255.0.1',
    port: 5568,
    ttl: 128,
    sourceAddress: '0.0.0.0'
  };

  private constructor() {
    this.initializeSocket();
  }

  static getInstance(): NetworkManager {
    if (!NetworkManager.instance) {
      NetworkManager.instance = new NetworkManager();
    }
    return NetworkManager.instance;
  }

  private initializeSocket() {
    this.socket = io('ws://localhost:3000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000
    });

    this.socket.on('connect', () => {
      console.log('Connected to sACN server');
      this.joinMulticastGroups();
    });

    this.socket.on('sacn-data', (data: { universe: number; slots: number[] }) => {
      UniverseManager.getInstance().setMultipleChannels(
        data.universe,
        0,
        data.slots
      );
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from sACN server');
    });
  }

  private joinMulticastGroups() {
    if (!this.socket) return;

    // Join multicast groups for all universes
    for (let universe = 1; universe <= 64; universe++) {
      const multicastAddress = `239.255.${Math.floor(universe / 256)}.${universe % 256}`;
      this.socket.emit('join-universe', { universe, address: multicastAddress });
    }
  }

  sendDMXData(universe: number, data: number[]): void {
    if (!this.socket) return;

    this.socket.emit('dmx-data', {
      universe,
      slots: data,
      priority: 100
    });
  }

  setMulticastConfig(config: Partial<MulticastConfig>): void {
    this.multicastConfig = { ...this.multicastConfig, ...config };
    if (this.socket) {
      this.socket.emit('config-update', this.multicastConfig);
    }
  }

  getNetworkStatus(): {
    connected: boolean;
    latency: number;
    packetsPerSecond: number;
  } {
    return {
      connected: this.socket?.connected ?? false,
      latency: this.socket?.io.engine?.transport?.pingTimeout ?? 0,
      packetsPerSecond: 0 // Implement packet counter
    };
  }
}

export default NetworkManager.getInstance();