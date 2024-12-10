import * as tf from '@tensorflow/tfjs';
import { ShowSequence } from '../../../types/sacn';

export class PatternClustering {
  private encoder: tf.LayersModel | null = null;
  private decoder: tf.LayersModel | null = null;

  async initialize() {
    // Encoder
    this.encoder = tf.sequential({
      layers: [
        tf.layers.dense({ units: 256, activation: 'relu', inputShape: [512] }),
        tf.layers.dense({ units: 128, activation: 'relu' }),
        tf.layers.dense({ units: 32, activation: 'relu' }) // Latent space
      ]
    });

    // Decoder
    this.decoder = tf.sequential({
      layers: [
        tf.layers.dense({ units: 128, activation: 'relu', inputShape: [32] }),
        tf.layers.dense({ units: 256, activation: 'relu' }),
        tf.layers.dense({ units: 512, activation: 'sigmoid' })
      ]
    });

    // Compile models
    this.encoder.compile({ optimizer: 'adam', loss: 'mse' });
    this.decoder.compile({ optimizer: 'adam', loss: 'mse' });
  }

  async trainOnSequences(sequences: ShowSequence[]) {
    if (!this.encoder || !this.decoder) throw new Error('Models not initialized');

    const data = sequences.map(seq => this.sequenceToFeatures(seq));
    const xs = tf.tensor2d(data);

    // Train autoencoder
    await tf.tidy(() => {
      const encoded = this.encoder!.predict(xs) as tf.Tensor;
      const decoded = this.decoder!.predict(encoded) as tf.Tensor;
      return decoded;
    });
  }

  async generateVariation(sequence: ShowSequence): Promise<ShowSequence> {
    if (!this.encoder || !this.decoder) throw new Error('Models not initialized');

    const features = this.sequenceToFeatures(sequence);
    const input = tf.tensor2d([features]);

    // Generate variation
    const encoded = this.encoder.predict(input) as tf.Tensor;
    const noise = tf.randomNormal([1, 32], 0, 0.1);
    const perturbedEncoding = encoded.add(noise);
    const decoded = this.decoder.predict(perturbedEncoding) as tf.Tensor;

    // Convert back to sequence
    const newValues = await decoded.array() as number[][];
    return this.featuresToSequence(newValues[0], sequence.duration);
  }

  private sequenceToFeatures(sequence: ShowSequence): number[] {
    const features = new Float32Array(512);
    sequence.frames.forEach(frame => {
      Object.values(frame.universeValues).forEach(values => {
        values.forEach((value, i) => {
          features[i] = Math.max(features[i], value / 255);
        });
      });
    });
    return Array.from(features);
  }

  private featuresToSequence(features: number[], duration: number): ShowSequence {
    const frameCount = Math.floor(duration * 30); // 30 fps
    const frames = Array.from({ length: frameCount }, (_, i) => ({
      timestamp: (i * duration * 1000) / frameCount,
      universeValues: {
        1: features.map(f => Math.round(f * 255))
      }
    }));

    return {
      id: `generated-${Date.now()}`,
      name: 'AI Generated Variation',
      duration,
      frames
    };
  }
}

export default new PatternClustering();