// src/utils/mlAnalyser.js
import * as toxicity from '@tensorflow-models/toxicity';
import '@tensorflow/tfjs'; // Load TensorFlow.js

let model = null;

// Load the model only once
async function loadModel() {
  if (!model) {
    try {
      model = await toxicity.load(0.9); // 0.9 threshold = high confidence
    } catch (err) {
      console.error("Failed to load toxicity model:", err);
    }
  }
  return model;
}

export async function runToxicityAnalysis(text) {
  try {
    const model = await loadModel(); // fixed: use function-scoped model
    if (!model) throw new Error("Model not loaded");

    const predictions = await model.classify([text]);
    const toxicLabels = predictions.filter(p => p.results[0].match);

    const toxic = toxicLabels.length > 0;
    let maxScore = 0;
    toxicLabels.forEach(p => {
      const score = p.results[0].probabilities[1]; // [non-toxic, toxic]
      if (score > maxScore) maxScore = score;
    });

    return {
      toxic,
      score: toxic ? maxScore : 0
    };
  } catch (error) {
    console.error("Toxicity analysis failed:", error);
    return {
      toxic: false,
      score: 0
    };
  }
}
