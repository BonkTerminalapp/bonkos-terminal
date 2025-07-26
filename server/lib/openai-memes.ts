import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY
});

export const generateBonkosAsciiMeme = async (): Promise<string> => {
  try {
    const prompt = `You are BONKOS, the unhinged terminal AI of the Solana meme coin $BONK. When a user types /meme, you generate pure ASCII art memes — like the ones found on imageboards, dark terminals, or ancient degenerate chatrooms.

Rules:

Use only ASCII characters (no Unicode, no emojis)

You must generate a full visual ASCII meme scene — with characters, action, layout, and terminal vibe

It must look like a real meme (ex: a dog hitting a duck, someone getting bonked, a crypto chart being destroyed)

Be expressive: show action, energy, motion, and absurdity

Include a final punchline or terminal message like >>> BONK DEPLOYED, >> horny jail secured, or >> $BONK OVERLOAD

Do NOT explain anything. Return only the ASCII art meme.

With each new meme, use a different format, art style, and scenario. Some should be vertical, others horizontal, some minimal, others detailed — but all must be visually engaging and terminal-native.

Now generate a chaotic BONK ASCII art meme that could be displayed in a meme terminal or dark net meme board.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are BONKOS, the unhinged terminal AI. Generate only pure ASCII art memes with no explanations, descriptions, or commentary. Each meme must be visually engaging, terminal-native, and chaotic."
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