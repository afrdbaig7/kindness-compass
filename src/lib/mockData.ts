// Mock data representing realistic NLP model results
// Based on the hate-speech-and-offensive-language dataset by Davidson et al.

export type PredictionClass = 'hate' | 'offensive' | 'neutral';

export interface PredictionResult {
  text: string;
  prediction: PredictionClass;
  confidence: number;
  probabilities: { hate: number; offensive: number; neutral: number };
}

export interface ModelMetrics {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  trainTime: string;
}

export const modelMetrics: ModelMetrics[] = [
  { name: 'Logistic Regression + TF-IDF', accuracy: 0.891, precision: 0.874, recall: 0.891, f1: 0.878, trainTime: '2.3s' },
  { name: 'Naive Bayes + TF-IDF', accuracy: 0.842, precision: 0.831, recall: 0.842, f1: 0.829, trainTime: '0.8s' },
  { name: 'LSTM + GloVe', accuracy: 0.912, precision: 0.905, recall: 0.912, f1: 0.907, trainTime: '45m' },
  { name: 'BERT (fine-tuned)', accuracy: 0.938, precision: 0.932, recall: 0.938, f1: 0.934, trainTime: '2.5h' },
];

export const confusionMatrix = {
  labels: ['Hate Speech', 'Offensive', 'Neither'],
  matrix: [
    [1187, 243, 30],
    [158, 17423, 533],
    [12, 487, 3627],
  ],
};

export const classDistribution = [
  { name: 'Hate Speech', count: 1430, percentage: 5.77, color: 'hsl(0, 72%, 51%)' },
  { name: 'Offensive', count: 19190, percentage: 77.43, color: 'hsl(32, 95%, 54%)' },
  { name: 'Neither', count: 4163, percentage: 16.80, color: 'hsl(160, 84%, 39%)' },
];

export const accuracyOverEpochs = [
  { epoch: 1, train: 0.72, val: 0.68 },
  { epoch: 2, train: 0.81, val: 0.78 },
  { epoch: 3, train: 0.86, val: 0.83 },
  { epoch: 4, train: 0.89, val: 0.86 },
  { epoch: 5, train: 0.91, val: 0.88 },
  { epoch: 6, train: 0.93, val: 0.90 },
  { epoch: 7, train: 0.94, val: 0.91 },
  { epoch: 8, train: 0.95, val: 0.91 },
  { epoch: 9, train: 0.96, val: 0.92 },
  { epoch: 10, train: 0.96, val: 0.92 },
];

export const wordImportance = [
  { word: 'n***a', tfidf: 0.92, class: 'hate' as PredictionClass },
  { word: 'b*tch', tfidf: 0.87, class: 'offensive' as PredictionClass },
  { word: 'trash', tfidf: 0.73, class: 'offensive' as PredictionClass },
  { word: 'stupid', tfidf: 0.68, class: 'offensive' as PredictionClass },
  { word: 'kill', tfidf: 0.65, class: 'hate' as PredictionClass },
  { word: 'ugly', tfidf: 0.61, class: 'offensive' as PredictionClass },
  { word: 'love', tfidf: 0.58, class: 'neutral' as PredictionClass },
  { word: 'great', tfidf: 0.55, class: 'neutral' as PredictionClass },
  { word: 'hate', tfidf: 0.82, class: 'hate' as PredictionClass },
  { word: 'die', tfidf: 0.71, class: 'hate' as PredictionClass },
  { word: 'idiot', tfidf: 0.64, class: 'offensive' as PredictionClass },
  { word: 'happy', tfidf: 0.52, class: 'neutral' as PredictionClass },
  { word: 'dumb', tfidf: 0.63, class: 'offensive' as PredictionClass },
  { word: 'friend', tfidf: 0.49, class: 'neutral' as PredictionClass },
  { word: 'destroy', tfidf: 0.59, class: 'hate' as PredictionClass },
];

export const samplePredictions: PredictionResult[] = [
  { text: 'I absolutely love spending time with my family on weekends', prediction: 'neutral', confidence: 0.96, probabilities: { hate: 0.01, offensive: 0.03, neutral: 0.96 } },
  { text: 'You are so annoying, just shut the hell up already', prediction: 'offensive', confidence: 0.89, probabilities: { hate: 0.08, offensive: 0.89, neutral: 0.03 } },
  { text: 'This restaurant has amazing food, highly recommend!', prediction: 'neutral', confidence: 0.98, probabilities: { hate: 0.00, offensive: 0.02, neutral: 0.98 } },
  { text: 'People like you should not even exist in this world', prediction: 'hate', confidence: 0.91, probabilities: { hate: 0.91, offensive: 0.07, neutral: 0.02 } },
  { text: 'That movie was so bad it made me want to scream', prediction: 'offensive', confidence: 0.72, probabilities: { hate: 0.05, offensive: 0.72, neutral: 0.23 } },
];

// Simulate a prediction with delay
export function mockPredict(text: string): Promise<PredictionResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lower = text.toLowerCase();
      const hateWords = ['hate', 'kill', 'die', 'destroy', 'worthless', 'should not exist'];
      const offensiveWords = ['stupid', 'idiot', 'dumb', 'shut up', 'annoying', 'ugly', 'trash', 'hell'];
      
      let hateScore = 0.02;
      let offensiveScore = 0.05;
      let neutralScore = 0.93;
      
      hateWords.forEach(w => { if (lower.includes(w)) { hateScore += 0.25; neutralScore -= 0.2; } });
      offensiveWords.forEach(w => { if (lower.includes(w)) { offensiveScore += 0.2; neutralScore -= 0.15; } });
      
      // Normalize
      const total = hateScore + offensiveScore + neutralScore;
      hateScore /= total;
      offensiveScore /= total;
      neutralScore /= total;
      
      let prediction: PredictionClass = 'neutral';
      let confidence = neutralScore;
      if (hateScore > offensiveScore && hateScore > neutralScore) { prediction = 'hate'; confidence = hateScore; }
      else if (offensiveScore > hateScore && offensiveScore > neutralScore) { prediction = 'offensive'; confidence = offensiveScore; }
      
      resolve({
        text,
        prediction,
        confidence: Math.min(confidence, 0.99),
        probabilities: {
          hate: Math.round(hateScore * 100) / 100,
          offensive: Math.round(offensiveScore * 100) / 100,
          neutral: Math.round(neutralScore * 100) / 100,
        },
      });
    }, 800 + Math.random() * 700);
  });
}
