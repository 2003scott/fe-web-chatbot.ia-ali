const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const GEMINI_ENDPOINT = `${API_BASE_URL.replace(/\/$/, "")}/api/gemini`;

export const GeminiService = async (
  contents: string,
  onStream: (text: string) => void
) => {
  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ contents }),
  });

  if (!response.ok) {
    let errorMessage = "Error al consultar Gemini.";

    try {
      const payload = (await response.json()) as { message?: string };

      if (typeof payload.message === "string" && payload.message.trim()) {
        errorMessage = payload.message;
      }
    } catch {
      const fallbackText = await response.text();

      if (fallbackText.trim()) {
        errorMessage = fallbackText;
      }
    }

    throw new Error(errorMessage);
  }

  if (!response.body) {
    const text = await response.text();

    if (text) {
      onStream(text);
    }

    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  const emitEvent = (eventText: string) => {
    const trimmed = eventText.trim();

    if (!trimmed) {
      return;
    }

    const eventTypeMatch = trimmed.match(/^event:\s*(.+)$/m);
    const eventType = eventTypeMatch?.[1]?.trim();

    if (eventType === "done") {
      return;
    }

    const dataLines = trimmed
      .split("\n")
      .filter((line) => line.startsWith("data: "))
      .map((line) => line.slice(6));

    if (dataLines.length === 0) {
      onStream(trimmed);
      return;
    }

    const payload = dataLines.join("\n");

    try {
      const parsed = JSON.parse(payload) as { text?: string };

      if (typeof parsed.text === "string") {
        onStream(parsed.text);
        return;
      }

      return;
    } catch {
      onStream(payload);
      return;
    }
  };

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      let boundaryIndex = buffer.indexOf("\n\n");

      while (boundaryIndex !== -1) {
        const eventText = buffer.slice(0, boundaryIndex);
        buffer = buffer.slice(boundaryIndex + 2);
        emitEvent(eventText);
        boundaryIndex = buffer.indexOf("\n\n");
      }
    }

    buffer += decoder.decode();

    if (buffer) {
      emitEvent(buffer);
    }
  } finally {
    reader.releaseLock();
  }
};
