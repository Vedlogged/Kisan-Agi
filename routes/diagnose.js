const express = require('express');
const multer = require('multer');
const { getGenerativeModel } = require('../utils/vertexAI');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Model will be lazily initialized on first request using the centralized utility
// This ensures proper configuration validation happens first

router.post('/', upload.single('leaf_image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    console.log("📸 Image received. Sending to Gemini...");

    // Get the model instance (lazy initialization with explicit config)
    const model = getGenerativeModel();

    const imageBase64 = req.file.buffer.toString('base64');

    // 🧠 AGENTIC PROMPT: One-Shot Learning (The strongest method)
    const prompt = `
      Act as a Senior Agronomist for Kisan-AGI.
      
      I will provide an image of a crop. 
      1. Identify the disease.
      2. GENERATE a 3-step treatment schedule. Do not leave this empty.
      
      RETURN JSON ONLY.
      
      EXAMPLE OUTPUT (Follow this format exactly):
      {
        "disease_name": "Tomato Early Blight",
        "confidence_score": 98,
        "timeline": [
          {
            "day": "Day 1",
            "title": "Fungicide Application",
            "detail": "Spray Copper Oxychloride (3g/liter) ensuring full leaf coverage."
          },
          {
            "day": "Day 5",
            "title": "Observation",
            "detail": "Check for new lesions. If spotting continues, re-apply spray."
          },
          {
            "day": "Day 10",
            "title": "Prevention",
            "detail": "Mulch soil to prevent spore splashback. Prune lower leaves."
          }
        ]
      }
      
      NOW ANALYZE THE PROVIDED IMAGE AND GENERATE THE PLAN.
    `;

    const request = {
      contents: [{
        role: 'user',
        parts: [
          { inline_data: { mime_type: 'image/jpeg', data: imageBase64 } },
          { text: prompt }
        ]
      }],
      generationConfig: {
        temperature: 0.4, // Increases creativity enough to fill the plan
        maxOutputTokens: 1024,
      }
    };

    const result = await model.generateContent(request);
    const response = result.response;
    const text = response.candidates[0].content.parts[0].text;

    const jsonStr = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(jsonStr);

    // 🧠 LOGIC: Extract the treatment keyword for the Map
    // (We assume the first day's detail contains the medicine name)
    const treatmentKeyword = data.timeline[0].detail.split(' ')[0] || "General";

    // Attach this to the response so the Frontend knows what to search for
    data.recommended_product = treatmentKeyword;

    console.log("✅ Diagnosis:", data.disease_name);
    console.log("💊 Prescribed:", treatmentKeyword);

    res.json(data);

  } catch (error) {
    console.error("❌ Vertex AI Error:", JSON.stringify(error, null, 2));
    res.status(500).json({
      error: "Diagnosis failed",
      details: error.message || "Auth failed"
    });
  }
});

module.exports = router;