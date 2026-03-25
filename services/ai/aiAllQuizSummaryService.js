const  generateAIResponse  = require("./aiAnalysisService");
const logger = require("../../utils/logger");

exports.generateAllQuizSummary = async (results) => {

  const topicMap = {};
  const unitMap = {};

  let totalAttempts = 0;
  let totalCorrect = 0;

  results.forEach(r => {

    totalAttempts += r.attempted;
    totalCorrect += r.right;

    // 🔥 Topic aggregation
    r.topicstats.forEach(t => {
      if (!topicMap[t.topic]) {
        topicMap[t.topic] = { total: 0, correct: 0 };
      }

      topicMap[t.topic].total += t.total;
      topicMap[t.topic].correct += t.correct;
    });

    // 🔥 Unit aggregation
    r.unitstats.forEach(u => {
      if (!unitMap[u.unit]) {
        unitMap[u.unit] = { total: 0, correct: 0 };
      }

      unitMap[u.unit].total += u.total;
      unitMap[u.unit].correct += u.correct;
    });
  });

  // 📊 Convert to arrays
  const topics = Object.entries(topicMap).map(([topic, val]) => ({
    topic,
    accuracy: (val.correct / val.total) * 100
  }));

  const units = Object.entries(unitMap).map(([unit, val]) => ({
    unit,
    accuracy: (val.correct / val.total) * 100
  }));

  // 🎯 Categorization
  const strengths = topics.filter(t => t.accuracy >= 75);
  const weak = topics.filter(t => t.accuracy < 50);
  const average = topics.filter(t => t.accuracy >= 50 && t.accuracy < 75);

  const overallAccuracy = totalAttempts
    ? (totalCorrect / totalAttempts) * 100
    : 0;

  // 🧠 Prompt
  const prompt = `
Analyze overall student performance across multiple quizzes.

Overall Accuracy: ${overallAccuracy.toFixed(1)}%
Total Attempts: ${totalAttempts}

Strong Topics:
${strengths.map(s => `${s.topic} (${s.accuracy.toFixed(1)}%)`).join("\n")}

Weak Topics:
${weak.map(w => `${w.topic} (${w.accuracy.toFixed(1)}%)`).join("\n")}

Average Topics:
${average.map(a => `${a.topic} (${a.accuracy.toFixed(1)}%)`).join("\n")}

Unit Performance:
${units.map(u => `${u.unit} (${u.accuracy.toFixed(1)}%)`).join("\n")}

Generate:
1. Overall performance summary
2. Strength areas
3. Weak areas
4. Learning pattern insights
5. Personalized study plan

Keep it concise and practical.
`;

  const aiSummary = await generateAIResponse(prompt);

  return {
    overallAccuracy,
    strengths,
    weak,
    average,
    units,
    aiSummary
  };
};
