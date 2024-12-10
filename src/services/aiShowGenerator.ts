import * as tf from '@tensorflow/tfjs';
import { AIShowConfig, ShowSequence, ShowFrame } from '../types/sacn';

class AIShowGenerator {
  private model: tf.LayersModel | null = null;
  
  async initialize() {
    // Load or create the AI model
    try {
      this.model = await tf.loadLayersModel('/models/lighting-show-model.json');
    } catch (error) {
      console.error('Failed to load AI model:', error);
      // Fallback to a simple model
      this.model = this.createSimpleModel();
      await this.trainSimpleModel();
    }
  }

  private createSimpleModel(): tf.LayersModel {
    const model = tf.sequential();
    
    model.add(tf.layers.dense({
      units: 128,
      activation: 'relu',
      inputShape: [4] // [tempo, intensity, complexity, mood]
    }));
    
    model.add(tf.layers.dense({
      units: 512,
      activation: 'sigmoid'
    }));
    
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError'
    });
    
    return model;
  }

  private async trainSimpleModel() {
    // Simple training with some basic patterns
    const inputData = tf.randomNormal([100, 4]);
    const outputData = tf.randomUniform([100, 512]);
    
    await this.model!.fit(inputData, outputData, {
      epochs: 10,
      batchSize: 32
    });
  }

  async generateShow(config: AIShowConfig): Promise<ShowSequence> {
    if (!this.model) {
      throw new Error('AI model not initialized');
    }

    const moodMap = {
      energetic: 1,
      calm: 0.25,
      dramatic: 0.75,
      ambient: 0.5
    };

    const input = tf.tensor2d([[
      config.tempo / 200, // Normalize tempo
      config.intensity / 100,
      config.complexity / 100,
      moodMap[config.mood]
    ]]);

    const frames: ShowFrame[] = [];
    const duration = 60; // 1 minute show
    const frameCount = Math.floor(duration * config.tempo / 60);

    for (let i = 0; i < frameCount; i++) {
      const prediction = this.model.predict(input) as tf.Tensor;
      const values = await prediction.array() as number[][];
      
      frames.push({
        timestamp: (i * 60000) / frameCount,
        universeValues: {
          1: values[0].slice(0, 512)
        }
      });

      prediction.dispose();
    }

    input.dispose();

    return {
      id: `show-${Date.now()}`,
      name: `AI Generated Show - ${config.mood}`,
      duration,
      frames
    };
  }
}

export default new AIShowGenerator();