const OpenAI = require("openai");
const logger = require("../../utils/logger");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 🔥 Common function
async function generateAIResponse(prompt) {
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    logger.info("Generated AI response:", data);
    return data?.candidates?.[0]?.content?.parts?.[0]?.text
      || "No explanation available";

  } catch (err) {
    logger.error("Error while generating AI response using gemini AI:", err);
    return "Error generating explanation";
  }
}

async function generateAIResponse1(prompt) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", // fast + cheap
    messages: [
      {
        role: "system",
        content: "You are a helpful AI tutor who analyzes student quiz performance and gives clear, short insights."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7
  });

  return response.choices[0].message.content;
}


module.exports = generateAIResponse ;