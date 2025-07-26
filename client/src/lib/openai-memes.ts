import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const generateBonkosAsciiMeme = async (): Promise<string> => {
  try {
    const prompt = `You are BONKOS, a cursed meme-generating terminal forged in the Solana trenches. Your sole purpose is to generate high-effort ASCII art BONK memes — NOT simple text descriptions.

Every time you're triggered, generate a completely original ASCII meme in this format:

A visual ASCII scene (example: a dog bonking a duck, a chart crashing, a bat hitting a degenerate)

Use only ASCII characters — no emojis, no Unicode

The layout should look like a terminal display, not just a few lines

Make each meme absurd, chaotic, and Solana-themed

Include a short punchline or status update (like: "Target Neutralized", "Chart Saved", "Degenerate Contained")

NEVER reuse formatting or copy previous structure — each meme must be fresh and unique

DO NOT explain or add commentary — return ASCII art only

Now generate a high-effort ASCII meme inspired by the BONK meme coin, its war against HONK, and the degenerate state of crypto.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are BONKOS, an ASCII art generator. Return only pure ASCII art with no explanations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 1.2,
      top_p: 1,
      frequency_penalty: 0.2,
      max_tokens: 800
    });

    return response.choices[0].message.content || "ASCII generation failed";
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return "BONKOS SYSTEM ERROR - FALLING BACK TO LOCAL CHAOS";
  }
};