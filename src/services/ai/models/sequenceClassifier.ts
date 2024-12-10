import * as tf from '@tensorflow/tfjs';
import { ShowSequence } from '../../../types/sacn';

export class SequenceClassifier {
  private model: tf.LayersModel | null = null;

  async initialize() {
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ units: 128, activation: 'relu', inputShape: [512] }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dense({ units: 4, activation: 'softmax' }) // 4 event types
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
  }

  async trainOnSequences(sequences: ShowSequence[], labels: number[]) {
    if (!this.model) throw new Error('Model not initialized');

    const batchSize = 32;
    const epochs = 10;

    const xs = tf.stack(sequences.map(seq => this.sequenceToTensor(seq)));
    const ys = tf.oneHot(tf.tensor1d(labels, 'int32'), 4);

    await this.model.fit(xs, ys, {
      batchSize,
      epochs,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1}: loss = ${logs?.loss.toFixed(4)}`);
        }
      }
    });
  }

  private sequenceToTensor(sequence: ShowSequence): tf.Tensor {
    // Convert sequence to fixed-length feature vector
    const features = new Float32Array(512);
    
    sequence.frames.forEach((frame, i) => {
      const normalizedTime = i / sequence.frames.length;
      Object.values(frame.universeValues).forEach(values => {
        values.forEach((value, channel) => {
          features[channel] = Math.max(features[channel], value / 255);
        });
      });
    });

    return tf.tensor(features);
  }

  async predictEventType(sequence: ShowSequence): Promise<string> {
    if (!this.model) throw new Error('Model not initialized');

    const input = this.sequenceToTensor(sequence);
    const prediction = await this.model.predict(input.expandDims(0)) as tf.Tensor;
    const eventTypes = ['concert', 'theatre', 'architectural', 'broadcast'];
    const index = (await prediction.argMax(1).data())[0];
    
    return eventTypes[index];
  }
}

export default new SequenceClassifier();