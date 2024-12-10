import { EventEmitter as TinyEmitter } from 'tiny-emitter';
import { v4 as uuidv4 } from 'uuid';

type EventCallback = (...args: any[]) => void;

export class EventEmitter {
  private emitter: TinyEmitter;
  private listeners: Map<string, Map<string, EventCallback>>;

  constructor() {
    this.emitter = new TinyEmitter();
    this.listeners = new Map();
  }

  on(event: string, callback: EventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Map());
    }

    const id = uuidv4();
    this.listeners.get(event)!.set(id, callback);
    this.emitter.on(event, callback);

    return () => {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        eventListeners.delete(id);
        if (eventListeners.size === 0) {
          this.listeners.delete(event);
        }
      }
      this.emitter.off(event, callback);
    };
  }

  off(event: string, callback: EventCallback): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      for (const [id, cb] of eventListeners.entries()) {
        if (cb === callback) {
          eventListeners.delete(id);
          break;
        }
      }
      if (eventListeners.size === 0) {
        this.listeners.delete(event);
      }
    }
    this.emitter.off(event, callback);
  }

  emit(event: string, ...args: any[]): void {
    this.emitter.emit(event, ...args);
  }

  once(event: string, callback: EventCallback): void {
    const unsubscribe = this.on(event, (...args) => {
      callback(...args);
      unsubscribe();
    });
  }

  removeAllListeners(event?: string): void {
    if (event) {
      this.listeners.delete(event);
      this.emitter.off(event);
    } else {
      this.listeners.clear();
      // TinyEmitter doesn't have a direct method to remove all listeners
      // but since we're creating a new instance, all listeners are effectively removed
      this.emitter = new TinyEmitter();
    }
  }

  listenerCount(event: string): number {
    return this.listeners.get(event)?.size ?? 0;
  }
}