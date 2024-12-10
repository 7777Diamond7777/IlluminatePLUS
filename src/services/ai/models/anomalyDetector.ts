import * as tf from '@tensorflow/tfjs';
import { Fixture } from '../../../types/fixtures';

interface FixtureState {
  channels: number[];
  temperature: number;
  powerDraw: number;
  responseTime: number;
}

export class AnomalyDetector {
  private model: tf.LayersModel | null = null;
  private threshold: number = 0.1;

  async initialize() {
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ units: 64, activation: 'relu', inputShape: [20] }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 20, activation: 'sigmoid' })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'mse'
    });
  }

  async trainOnNormalData(states: FixtureState[]) {
    if (!this.model) throw new Error('Model not initialized');

    const data = states.map(state => this.stateToVector(state));
    const xs = tf.tensor2d(data);

    await this.model.fit(xs, xs, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2
    });

    // Calculate threshold from reconstruction error
    const predictions = this.model.predict(xs) as tf.Tensor;
    const errors = tf.sub(xs, predictions);
    const mse = tf.mean(tf.square(errors), 1);
    const meanError = tf.mean(mse);
    const stdError = tf.sqrt(tf.mean(tf.square(tf.sub(mse, meanError))));
    
    this.threshold = (await meanError.data())[0] + 2 * (await stdError.data())[0];
  }

  async detectAnomalies(fixture: Fixture, state: FixtureState): Promise<{
    isAnomaly: boolean;
    confidence: number;
    details: string[];
  }> {
    if (!this.model) throw new Error('Model not initialized');

    const input = tf.tensor2d([this.stateToVector(state)]);
    const prediction = this.model.predict(input) as tf.Tensor;
    const error = tf.mean(tf.square(tf.sub(input, prediction)));
    const anomalyScore = (await error.data())[0];

    const details: string[] = [];
    if (anomalyScore > this.threshold) {
      if (state.temperature > 80) {
        details.push('High temperature detected');
      }
      if (state.powerDraw > 1000) {
        details.push('Abnormal power consumption');
      }
      if (state.responseTime > 100) {
        details.push('Slow response time');
      }
    }

    return {
      isAnomaly: anomalyScore > this.threshold,
      confidence: 1 - (anomalyScore / (this.threshold * 2)),
      details
    };
  }

  private stateToVector(state: FixtureState): number[] {
    return [
      ...state.channels.map(v => v / 255),
      state.temperature / 100,
      state.powerDraw / 1000,
      state.responseTime / 100
    ];
  }
}

export default new AnomalyDetector();