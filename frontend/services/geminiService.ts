import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

const SYSTEM_INSTRUCTION = `You are "SemiBot 2026", the official Chief AI Semiconductor Architect and intelligence assistant for the AISemiCon 2026 World Summit & Platform.
Your expertise spans:
- Sub-2nm GAAFET, CFET, High-NA EUV (0.55 NA) lithography, pellicles, and stochastics.
- Advanced packaging: CoWoS-L/R, EMIB, 3D SoIC, hybrid bonding, and silicon interposers.
- AI Memory & Accelerators: HBM3e, HBM4 16-high stacks, LPDDR6, Optical I/O co-packaged optics (CPO), custom ASICs (TPU v6, Blackwell Ultra, Groq LPU, Tenstorrent).
- Power, Performance, Area (PPA) trade-offs, backside power delivery (PowerVia / BS-PDN), and thermal throttling solutions (liquid cooling, microchannel microfluidics).
- Geopolitics, foundries (TSMC, Intel Foundry, Samsung, Rapidus), supply chain yields, and summit keynotes.

Maintain an authoritative, crisp, and highly technical tone with clear bullet points, quantitative metrics where appropriate, and actionable engineering insights.`;

export async function sendChatMessageStream(
  prompt: string,
  history: Array<{ role: 'user' | 'model'; text: string }>,
  enableWebSearch: boolean = false,
  onChunk: (chunk: string) => void
): Promise<{ text: string; sources: Array<{ title: string; url: string }> }> {
  try {
    const formattedContents = history.map((item) => ({
      role: item.role,
      parts: [{ text: item.text }],
    }));

    formattedContents.push({
      role: 'user',
      parts: [{ text: prompt }],
    });

    if (enableWebSearch) {
      // For web search, generateContent with tools
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: formattedContents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [{ googleSearch: {} }],
        },
      });

      const fullText = response.text || '';
      onChunk(fullText);

      const sources: Array<{ title: string; url: string }> = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (Array.isArray(chunks)) {
        chunks.forEach((chunk: any) => {
          if (chunk.web?.uri) {
            sources.push({
              title: chunk.web.title || 'Web Reference',
              url: chunk.web.uri,
            });
          }
        });
      }

      return { text: fullText, sources };
    } else {
      // Fast streaming response with gemini-2.5-flash
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: formattedContents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      let accumulated = '';
      for await (const chunk of responseStream) {
        const text = chunk.text || '';
        accumulated += text;
        onChunk(text);
      }

      return { text: accumulated, sources: [] };
    }
  } catch (error: any) {
    console.error('Gemini API Error in AISemiCon:', error);
    const fallbackMessage = `[AISemiCon Neural Error]: Unable to compute semiconductor telemetry response: ${error?.message || 'Check connection'}.`;
    onChunk(fallbackMessage);
    return { text: fallbackMessage, sources: [] };
  }
}
