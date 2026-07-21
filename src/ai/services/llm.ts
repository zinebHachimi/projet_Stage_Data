const CANDIDATE_MODELS = [
  process.env.GEMINI_MODEL,
  "gemini-1.5-flash",
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-1.5-pro",
  "gemini-pro",
].filter(Boolean) as string[];

const API_VERSIONS = ["v1beta", "v1"];

let cachedWorkingModel: string | null = null;
let cachedWorkingVersion: string | null = null;

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

  // If we already cached a working model/version, try that first
  const modelsToTry = cachedWorkingModel
    ? [cachedWorkingModel, ...CANDIDATE_MODELS.filter((m) => m !== cachedWorkingModel)]
    : CANDIDATE_MODELS;

  const versionsToTry = cachedWorkingVersion
    ? [cachedWorkingVersion, ...API_VERSIONS.filter((v) => v !== cachedWorkingVersion)]
    : API_VERSIONS;

  for (const version of versionsToTry) {
    for (const model of modelsToTry) {
      const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`;
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
          console.warn(`Gemini API attempt failed [${version}/${model}] (${response.status}): ${errorText.slice(0, 200)}`);
          if (response.status === 404 || response.status === 400) {
            continue;
          }
          break;
        }

        const data = await response.json();
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textResponse) {
          console.warn(`Empty response content from Gemini API [${version}/${model}].`);
          continue;
        }

        cachedWorkingModel = model;
        cachedWorkingVersion = version;

        return textResponse.trim();
      } catch (error) {
        console.error(`Gemini API call network error [${version}/${model}]:`, error);
      }
    }
  }

  console.error("All Gemini API candidate models failed or returned errors. Falling back to rule-based NLP.");
  return null;
}

