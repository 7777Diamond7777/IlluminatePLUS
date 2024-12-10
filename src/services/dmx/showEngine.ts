import { ShowSequence, ShowFrame } from '../../types/sacn';
import UniverseManager from './universeManager';
import { EventEmitter } from '../../utils/events/EventEmitter';

class ShowEngine extends EventEmitter {
  private static instance: ShowEngine;
  private currentShow: ShowSequence | null = null;
  private isPlaying: boolean = false;
  private currentFrame: number = 0;
  private startTime: number = 0;
  private animationFrame: number | null = null;
  private loop: boolean = false;

  private constructor() {
    super();
  }

  static getInstance(): ShowEngine {
    if (!ShowEngine.instance) {
      ShowEngine.instance = new ShowEngine();
    }
    return ShowEngine.instance;
  }

  loadShow(show: ShowSequence): void {
    this.currentShow = show;
    this.currentFrame = 0;
    this.emit('showLoaded', show);
  }

  play(): void {
    if (!this.currentShow || this.isPlaying) return;

    this.isPlaying = true;
    this.startTime = performance.now() - (this.currentFrame * 1000 / 30);
    this.animate();
    this.emit('playbackStarted');
  }

  pause(): void {
    this.isPlaying = false;
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.emit('playbackPaused');
  }

  stop(): void {
    this.pause();
    this.currentFrame = 0;
    if (this.loop) {
      this.play();
    } else {
      this.emit('playbackStopped');
    }
  }

  setLoop(loop: boolean): void {
    this.loop = loop;
    this.emit('loopChanged', loop);
  }

  seekToTime(time: number): void {
    if (!this.currentShow) return;

    this.currentFrame = Math.floor(time * 30);
    if (this.currentFrame < this.currentShow.frames.length) {
      this.applyFrame(this.currentShow.frames[this.currentFrame]);
    }
    this.emit('playbackSeeked', time);
  }

  getCurrentTime(): number {
    return this.currentFrame / 30;
  }

  getDuration(): number {
    return this.currentShow?.duration || 0;
  }

  private animate(): void {
    if (!this.currentShow || !this.isPlaying) return;

    const currentTime = performance.now();
    const elapsedTime = (currentTime - this.startTime) / 1000;
    this.currentFrame = Math.floor(elapsedTime * 30);

    if (this.currentFrame < this.currentShow.frames.length) {
      this.applyFrame(this.currentShow.frames[this.currentFrame]);
      this.animationFrame = requestAnimationFrame(() => this.animate());
      this.emit('frameUpdate', {
        frame: this.currentFrame,
        time: elapsedTime,
        totalFrames: this.currentShow.frames.length
      });
    } else {
      this.stop();
    }
  }

  private applyFrame(frame: ShowFrame): void {
    Object.entries(frame.universeValues).forEach(([universe, values]) => {
      UniverseManager.getInstance().setMultipleChannels(
        parseInt(universe),
        0,
        values
      );
    });
    this.emit('frameApplied', frame);
  }
}

export default ShowEngine.getInstance();