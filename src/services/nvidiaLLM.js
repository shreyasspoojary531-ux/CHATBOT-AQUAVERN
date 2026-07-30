const PROXY_URL = import.meta.env.VITE_NVIDIA_BASE_URL || "/api/nvidia/v1";
const DIRECT_URL = import.meta.env.VITE_NVIDIA_DIRECT_URL || "https://integrate.api.nvidia.com/v1";
const API_KEY = import.meta.env.VITE_NVIDIA_API_KEY;
const DEFAULT_MODEL = import.meta.env.VITE_NVIDIA_MODEL || "openai/gpt-oss-120b";

/**
 * Sends a chat completion request to the NVIDIA NIM OpenAI-compatible endpoint.
 * Uses Vite local server proxy (/api/nvidia) to bypass browser CORS restrictions.
 */
export async function generateNIMCompletion(messages, options = {}) {
  if (!API_KEY) {
    throw new Error("NVIDIA API key is missing. Please check VITE_NVIDIA_API_KEY in your .env file.");
  }

  const formattedMessages = messages.map((msg) => ({
    role: msg.role || "user",
    content: msg.content || "",
  }));

  const payload = {
    model: options.model || DEFAULT_MODEL,
    messages: formattedMessages,
    temperature: options.temperature ?? 1,
    top_p: options.top_p ?? 1,
    max_tokens: options.max_tokens ?? 4096,
    stream: false,
  };

  // Try proxy first to bypass browser CORS, fallback to direct URL
  const targetEndpoints = [
    `${PROXY_URL}/chat/completions`,
    `${DIRECT_URL}/chat/completions`,
  ];

  let lastError = null;

  for (const endpoint of targetEndpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        let message = `API error (${response.status})`;
        try {
          const parsed = JSON.parse(errorBody);
          message = parsed.detail || parsed.message || parsed.error?.message || message;
        } catch (_) {}
        throw new Error(message);
      }

      const data = await response.json();
      const choiceMessage = data.choices?.[0]?.message;

      if (!choiceMessage) {
        throw new Error("No response message returned from model.");
      }

      return {
        content: choiceMessage.content || "",
        reasoning: choiceMessage.reasoning_content || null,
        rawResponse: data,
      };
    } catch (err) {
      lastError = err;
      // If it's a fetch/CORS network failure, try the next endpoint fallback
      if (err.name === "TypeError" || err.message.includes("Failed to fetch")) {
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error("Failed to reach NVIDIA NIM API.");
}
