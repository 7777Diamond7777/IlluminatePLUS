import * as tf from '@tensorflow/tfjs';
import { Fixture } from '../../../types/fixtures';

interface FixtureMetrics {
  temperature: number;
  powerConsumption: number;
  usageHours: number;
  intensityAverage: number;
}

export class FixturePredictor {
  private model: tf.LayersModel | null = null;

  async initialize() {
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ units: 64, activation: 'relu', inputShape: [4] }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });
  }

  async trainOnMetrics(metrics: FixtureMetrics[], failures: boolean[]) {
    if (!this.model) throw new Error('Model not initialized');

    const xs = tf.tensor2d(metrics.map(m => [
      m.temperature / 100, // Normalize temperature
      m.powerConsumption / 1000, // Normalize power
      m.usageHours / 10000, // Normalize usage hours
      m.intensityAverage / 255 // Normalize intensity
    ]));

    const ys = tf.tensor2d(failures.map(f => [f ? 1 : 0]));

    await this.model.fit(xs, ys, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2
    });
  }

  async predictMaintenance(fixture: Fixture, metrics: FixtureMetrics): Promise<{
    probability: number;
    recommendedDate: Date;
  }> {
    if (!this.model) throw new Error('Model not initialized');

    const input = tf.tensor2d([[
      metrics.temperature / 100,
      metrics.powerConsumption / 1000,
      metrics.usageHours / 10000,
      metrics.intensityAverage / 255
    ]]);

    const prediction = await this.model.predict(input) as tf.Tensor;
    const probability = (await prediction.data())[0];

    // Calculate recommended maintenance date based on probability
    const daysUntilMaintenance = Math.max(1, Math.floor((1 - probability) * 365));
    const recommendedDate = new Date();
    recommendedDate.setDate(recommendedDate.getDate() + daysUntilMaintenance);

    return {
      probability,
      recommendedDate
    };
  }
}

export default new FixturePredictor();