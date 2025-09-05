import { gemini15Flash, googleAI } from "@genkit-ai/googleai";
import { z } from "@genkit-ai/core";
import { genkit } from "genkit";
import { logger } from "genkit/logging";

logger.setLogLevel("debug");

const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  model: googleAI.model("gemini-1.5-flash"),
});

export const youtube_ai_flow = ai.defineFlow(
  {
    name: "youtube ai",
    inputSchema: z.object({
      prompt: z.string(),
      ytUrl: z.string(),
    }),
    outputSchema: z.string(),
  },
  async ({ prompt, ytUrl }, { sendChunk }) => {
    return await ai.run("call-llm", async () => {
      const llmResponse = await ai.generate({
        prompt: [
          {
            text: prompt,
          },
          {
            media: {
              url: ytUrl,
              contentType: "video/mp4",
            },
          },
        ],
        model: gemini15Flash,
        config: {
          temperature: 0.5,
        },
        onChunk: (c) => sendChunk(c.text),
      });
      // console.log("LLM RESPONSE:", llmResponse);
      return llmResponse.text;
    });
  }
);