import OpenAI from "openai";

export const maxDuration = 60;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: req.body.prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    if (!response.data?.[0]?.url) {
      throw new Error("Invalid response from OpenAI");
    }

    res.status(200).json({
      urls: [response.data[0].url],
      revised_prompt: response.data[0].revised_prompt,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: true,
      message: error.message || "Error generating image",
    });
  }
}
