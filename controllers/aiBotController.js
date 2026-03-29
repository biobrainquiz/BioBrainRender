const logger = require("../utils/logger");

exports.askbot = async (req, res) => {

    const userPrompt = req.body.prompt;
    const apiKey = process.env.GEMINI_API_KEY;

    // Use the latest versioned model string
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: userPrompt }]
                }]
            })
        });

        // Log the actual text of the error to your terminal
        if (!response.ok) {
            const errorText = await response.text();
            logger.error("Google API Error Detail:", errorText);
            return res.status(response.status).json({ error: "API Error", detail: errorText });
        }

        const data = await response.json();
        res.json({ answer: data.candidates[0].content.parts[0].text });

    } catch (err) {
        logger.error("Fetch failed:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};