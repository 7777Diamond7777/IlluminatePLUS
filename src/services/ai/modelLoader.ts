import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

export async function initializeTensorFlow() {
  await tf.ready();
  await tf.setBackend('webgl');
  console.log('TensorFlow.js initialized with backend:', tf.getBackend());
}

export async function loadOrCreateModel(): Promise<tf.LayersModel> {
  try {
    const model = await tf.loadLayersModel('/models/lighting-show-model.json');
    console.log('Loaded existing model');
    return model;
  } catch (error) {
    console.log('Creating new model');
    return createSimpleModel();
  }
}

function createSimpleModel(): tf.LayersModel {
  const model = tf.sequential();
  
  model.add(tf.layers.dense({
    units: 128,
    activation: 'relu',
    inputShape: [4]
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