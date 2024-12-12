import { fal } from "@fal-ai/client";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    fal.config({
      credentials: process.env.FAL_KEY,
    });

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt: prompt,
      },
    });

    return res.status(200).json({ urls: [result.data.images[0].url] });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Error generating image" });
  }
}
