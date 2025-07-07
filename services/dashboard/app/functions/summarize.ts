
import { createServerFn } from "@tanstack/react-start";
import OpenAI from "openai";

// Server-side function that leverages OpenAI to turn a raw meeting transcript
// into a structured summary we can directly store in the database.
export const summarizeTranscript = createServerFn({ method: "POST" })
  .validator((data: { transcript: string }) => data)
  .handler(async ({ data }) => {
    try {
      const openai = new OpenAI({
        // Prefer environment variable; if undefined OpenAI SDK will throw.
        apiKey: "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"
      });

      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
          role: "system",
          content:
            "You are a pragmatic meeting summarizer that outputs structured JSON.",
        },
        {
          role: "user",
          content: `You are a note taker and this is the content of a meeting.\n\n${data.transcript}\n\nCreate a summary containing the following elements:\n- title: concise and less than 250 characters\n- content: include highlights and action points if any\n- labels: array of short labels summarising the meeting\n\nReturn ONLY valid JSON in the following shape:\n{\"title\":\"string\",\"content\":\"string\",\"labels\":[\"string\"]}`,
        },
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // lightweight but capable model; adjust as needed
        messages,
        temperature: 0.3,
        max_tokens: 300,
        response_format: { type: "json_object" },
      });

      const raw = completion.choices[0].message?.content?.trim() ?? "";
      let summary: { title: string; content: string; labels: string[] } | null =
        null;
      try {
        summary = JSON.parse(raw);
      } catch (err) {
        console.warn("Failed to parse OpenAI response as JSON", err, raw);
      }

      if (!summary) {
        return {
          summary: null,
          error: "Unable to generate summary or parse JSON response",
        } as const;
      }

      return { summary } as const;
    } catch (error: any) {
      console.error("OpenAI summarization error", error);
      return { summary: null, error: error?.message ?? "unknown" } as const;
    }
  }); 