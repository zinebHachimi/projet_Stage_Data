const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export interface LLMRequestOptions {
  systemPrompt?: string;
  jsonMode?: boolean;
  temperature?: number;
}

export async function callGemini(
  prompt: string,
  options: LLMRequestOptions = {}
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined. Falling back to local NLP / Rule-based parser.");
    return null;
  }

  const { systemPrompt, jsonMode = false, temperature = 0.2 } = options;

  const url = `${GEMINI_API_URL}?key=${apiKey}`;

  const payload: Record<string, any> = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: {
      temperature,
    },
  };

  if (systemPrompt) {
    payload.systemInstruction = {
      parts: [
        {
          text: systemPrompt,
        },
      ],
    };
  }

  if (jsonMode) {
    payload.generationConfig.responseMimeType = "application/json";
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API responded with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      throw new Error("Empty response from Gemini API.");
    }

    return textResponse.trim();
  } catch (error) {
    console.error("Gemini API Call Failure:", error);
    return null;
  }
}
