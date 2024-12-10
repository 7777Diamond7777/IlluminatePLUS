import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import { AIShowConfig, ShowSequence, ShowFrame } from '../../types/sacn';
import { SequenceClassifier } from './models/sequenceClassifier';
import { PatternClustering } from './models/patternClustering';

class ShowGenerator {
  private sequenceClassifier: SequenceClassifier;
  private patternClustering: PatternClustering;
  private initialized = false;

  constructor() {
    this.sequenceClassifier = new SequenceClassifier();
    this.patternClustering = new PatternClustering();
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      await tf.ready();
      await tf.setBackend('webgl');
      await this.sequenceClassifier.initialize();
      await this.patternClustering.initialize();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize AI Show Generator:', error);
      throw new Error('Failed to initialize AI Show Generator');
    }
  }

  async generateShow(config: AIShowConfig): Promise<ShowSequence> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      // Generate base sequence
      const baseSequence = await this.generateBaseSequence(config);
      
      // Analyze and enhance the sequence
      const enhancedSequence = await this.enhanceSequence(baseSequence, config);
      
      // Generate variations
      const variations = await this.generateVariations(enhancedSequence, config);
      
      // Combine sequences
      return this.combineSequences(enhancedSequence, variations);
    } catch (error) {
      console.error('Error generating show:', error);
      throw new Error('Failed to generate show');
    }
  }

  private async generateBaseSequence(config: AIShowConfig): Promise<ShowSequence> {
    const duration = 60; // 1 minute base sequence
    const framesPerBeat = Math.floor(60 / config.tempo * 30); // 30fps
    const totalFrames = duration * 30;
    
    const frames: ShowFrame[] = [];
    
    for (let i = 0; i < totalFrames; i++) {
      const phase = (i % framesPerBeat) / framesPerBeat;
      const intensity = this.calculateIntensity(phase, config.intensity);
      
      frames.push({
        timestamp: (i * 1000) / 30,
        universeValues: {
          1: this.generateFrameValues(intensity, config)
        }
      });
    }

    return {
      id: `base-${Date.now()}`,
      name: 'Base Sequence',
      duration,
      frames
    };
  }

  private async enhanceSequence(sequence: ShowSequence, config: AIShowConfig): Promise<ShowSequence> {
    // Analyze sequence type
    const eventType = await this.sequenceClassifier.predictEventType(sequence);
    
    // Apply event-specific enhancements
    const enhancedFrames = sequence.frames.map(frame => ({
      ...frame,
      universeValues: {
        ...frame.universeValues,
        1: this.enhanceFrameValues(frame.universeValues[1], eventType, config)
      }
    }));

    return {
      ...sequence,
      id: `enhanced-${Date.now()}`,
      name: `Enhanced ${eventType} Sequence`,
      frames: enhancedFrames
    };
  }

  private async generateVariations(sequence: ShowSequence, config: AIShowConfig): Promise<ShowSequence[]> {
    const variations: ShowSequence[] = [];
    const variationCount = Math.floor(config.complexity / 25);
    
    for (let i = 0; i < variationCount; i++) {
      const variation = await this.patternClustering.generateVariation(sequence);
      variations.push(variation);
    }
    
    return variations;
  }

  private combineSequences(base: ShowSequence, variations: ShowSequence[]): ShowSequence {
    const combinedFrames = base.frames.map((frame, index) => {
      const variantValues = variations.map(v => v.frames[index]?.universeValues[1] || []);
      
      return {
        ...frame,
        universeValues: {
          1: this.blendFrameValues([frame.universeValues[1], ...variantValues])
        }
      };
    });

    return {
      id: `final-${Date.now()}`,
      name: 'AI Generated Show',
      duration: base.duration,
      frames: combinedFrames
    };
  }

  private calculateIntensity(phase: number, baseIntensity: number): number {
    const intensity = baseIntensity / 100;
    return Math.sin(phase * Math.PI) * intensity;
  }

  private generateFrameValues(intensity: number, config: AIShowConfig): number[] {
    const values = new Array(512).fill(0);
    const complexity = config.complexity / 100;
    
    for (let i = 0; i < 512; i++) {
      const noise = Math.random() * complexity;
      values[i] = Math.floor(intensity * 255 * (1 + noise));
    }
    
    return values;
  }

  private enhanceFrameValues(values: number[], eventType: string, config: AIShowConfig): number[] {
    const enhanced = [...values];
    const moodFactor = this.getMoodFactor(config.mood);
    
    switch (eventType) {
      case 'concert':
        this.enhanceConcertValues(enhanced, moodFactor);
        break;
      case 'theatre':
        this.enhanceTheatreValues(enhanced, moodFactor);
        break;
      case 'architectural':
        this.enhanceArchitecturalValues(enhanced, moodFactor);
        break;
      case 'broadcast':
        this.enhanceBroadcastValues(enhanced, moodFactor);
        break;
    }
    
    return enhanced;
  }

  private getMoodFactor(mood: AIShowConfig['mood']): number {
    const moodFactors = {
      energetic: 1.2,
      dramatic: 1.0,
      ambient: 0.8,
      calm: 0.6
    };
    return moodFactors[mood];
  }

  private enhanceConcertValues(values: number[], moodFactor: number): void {
    for (let i = 0; i < values.length; i++) {
      values[i] = Math.min(255, Math.floor(values[i] * moodFactor * 1.2));
    }
  }

  private enhanceTheatreValues(values: number[], moodFactor: number): void {
    for (let i = 0; i < values.length; i++) {
      values[i] = Math.min(255, Math.floor(values[i] * moodFactor * 0.9));
    }
  }

  private enhanceArchitecturalValues(values: number[], moodFactor: number): void {
    for (let i = 0; i < values.length; i++) {
      values[i] = Math.min(255, Math.floor(values[i] * moodFactor * 0.7));
    }
  }

  private enhanceBroadcastValues(values: number[], moodFactor: number): void {
    for (let i = 0; i < values.length; i++) {
      values[i] = Math.min(255, Math.floor(values[i] * moodFactor * 0.8));
    }
  }

  private blendFrameValues(valueArrays: number[][]): number[] {
    const blended = new Array(512).fill(0);
    
    for (let i = 0; i < 512; i++) {
      let sum = 0;
      valueArrays.forEach(values => {
        sum += values[i] || 0;
      });
      blended[i] = Math.min(255, Math.floor(sum / valueArrays.length));
    }
    
    return blended;
  }
}

export default new ShowGenerator();