const  generateAIResponse  = require("./aiAnalysisService");
const logger = require("../../utils/logger");

exports.generateSingleQuizSummary = async (result) => {

  const topicStatsText = result.topicstats.map(t =>
    `${t.topic} → Accuracy: ${t.accuracy.toFixed(1)}%, Avg Time: ${t.avgTime.toFixed(1)}s`
  ).join("\n");

  const unitStatsText = result.unitstats.map(u =>
    `${u.unit} → Accuracy: ${u.accuracy.toFixed(1)}%, Avg Time: ${u.avgTime.toFixed(1)}s`
  ).join("\n");

  const prompt = `
Analyze this quiz performance:

Exam: ${result.examname}
Subject: ${result.subjectname}
Score: ${result.finalscore}
Accuracy: ${result.accuracy.toFixed(1)}%
Attempted: ${result.attempted}/${result.questionscount}

Topic Performance:
${topicStatsText}

Unit Performance:
${unitStatsText}

Give:
1. Overall performance summary
2. Strong areas
3. Weak areas
4. Time management insight
5. 3 improvement tips

Keep it short, clear, and student-friendly.
`;

  return await generateAIResponse(prompt);
};
