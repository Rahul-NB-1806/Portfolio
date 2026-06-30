require("dotenv").config();
const express = require("express");
const cors = require("cors");
const needle = require("needle");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const INVOKE_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.static(__dirname));

app.post("/api/analyze", async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: "Image data is required" });
    }

    const payload = {
      model: "moonshotai/kimi-k2.6",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${image}` },
            },
            {
              type: "text",
              text: `Analyze this image and return a JSON object with these exact keys (no markdown, no code fences, raw JSON only):
{
  "colors": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"],
  "mood": "one word describing the mood",
  "style_adjectives": ["adj1", "adj2", "adj3"],
  "objects": ["object1", "object2"],
  "animation": {
    "intensity": 0.0-1.0,
    "speed": "slow|medium|fast",
    "particle_count": number 10-150,
    "bg_gradient_direction": "to top|to bottom|to right|to left|diagonal"
  }
}

Pick 5 dominant colors from the image. Set intensity based on mood (energetic=high, calm=low). Suggest particle count proportional to visual complexity.`,
            },
          ],
        },
      ],
      max_tokens: 1024,
      temperature: 0.7,
      top_p: 1.0,
      stream: false,
    };

    const headers = {
      Authorization: `Bearer ${NVIDIA_API_KEY}`,
      "Content-Type": "application/json",
    };

    const response = await needle("post", INVOKE_URL, payload, {
      json: true,
      headers,
    });

    if (response.statusCode !== 200) {
      return res.status(response.statusCode).json({
        error: "NVIDIA API error",
        detail: response.body,
      });
    }

    const content = response.body.choices?.[0]?.message?.content || "{}";
    const cleaned = content.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
    const analysis = JSON.parse(cleaned);

    res.json(analysis);
  } catch (err) {
    console.error("Analysis error:", err);
    res.status(500).json({
      error: "Analysis failed",
      detail: err.message,
    });
  }
});

app.post("/api/detect-objects", async (req, res) => {
  try {
    const { image, mime } = req.body;
    if (!image) {
      return res.status(400).json({ error: "Image data is required" });
    }

    const contentType = mime || "image/png";

    const payload = {
      model: "moonshotai/kimi-k2.6",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:${contentType};base64,${image}` },
            },
            {
              type: "text",
              text: `You are an exact bounding-box detector. Analyze this image and return ONLY precise bounding boxes for 2 objects: the laptop and the resume paper.

IMPORTANT: 
- The bounding box for the laptop must cover the ENTIRE laptop — including the screen lid AND the keyboard base. Do not miss any part.
- The bounding box for the resume must cover the entire paper sheet, edge to edge.
- Ignore all other objects (plants, bottles, headphones, etc.). Only laptop and resume.
- Be pixel-precise with the edges. The box should tightly fit the object.

Return a JSON object with this exact structure (raw JSON only, no markdown, no code fences):
{
  "objects": [
    {
      "name": "laptop",
      "x": number (0-100, left edge as % of image width),
      "y": number (0-100, top edge as % of image height),
      "width": number (0-100, width as % of image width),
      "height": number (0-100, height as % of image height),
      "action": "laptop"
    },
    {
      "name": "resume paper",
      "x": number (0-100, left edge as % of image width),
      "y": number (0-100, top edge as % of image height),
      "width": number (0-100, width as % of image width),
      "height": number (0-100, height as % of image height),
      "action": "resume"
    }
  ]
}

Rules:
- x, y = top-left corner of the bounding box, in percentage of image dimensions
- The box must cover the ENTIRE object edge-to-edge with no padding
- For laptop: include both the screen (lid) AND the keyboard base as one unit
- For resume: include the full paper sheet
- Return exactly 2 objects, no more`,
            },
          ],
        },
      ],
      max_tokens: 1024,
      temperature: 0.1,
      top_p: 1.0,
      stream: false,
    };

    const headers = {
      Authorization: `Bearer ${NVIDIA_API_KEY}`,
      "Content-Type": "application/json",
    };

    const response = await needle("post", INVOKE_URL, payload, {
      json: true,
      headers,
    });

    if (response.statusCode !== 200) {
      return res.status(response.statusCode).json({
        error: "NVIDIA API error",
        detail: response.body,
      });
    }

    const content = response.body.choices?.[0]?.message?.content || "{}";
    const cleaned = content.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
    const result = JSON.parse(cleaned);

    res.json(result);
  } catch (err) {
    console.error("Detection error:", err);
    res.status(500).json({
      error: "Detection failed",
      detail: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Portfolio AI server running at http://localhost:${PORT}`);
});
