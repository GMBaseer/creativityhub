import { GoogleGenAI, Modality, Type } from "@google/genai";
import type { ImageData } from "../types";

async function getAiClient() {
    if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
        return new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export async function generateHuggingImage(babyImage: ImageData, adultImage: ImageData): Promise<string | null> {
  const ai = await getAiClient();
  const model = 'gemini-2.5-flash-image';
  
  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        { inlineData: { data: babyImage.base64, mimeType: babyImage.mimeType } },
        { inlineData: { data: adultImage.base64, mimeType: adultImage.mimeType } },
        { text: 'Analyze the two images. One shows a person as a baby, and the other shows the same person as an adult. Create a new, photorealistic image where the adult version is gently and lovingly hugging the baby version of themselves. The style should be warm and sentimental.' },
      ],
    },
    config: { responseModalities: [Modality.IMAGE] },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return part.inlineData.data;
  }
  return null;
}

export async function enhanceImage(image: ImageData): Promise<string | null> {
    const ai = await getAiClient();
    const model = 'gemini-2.5-flash-image';
    
    const response = await ai.models.generateContent({
        model,
        contents: {
            parts: [
                { inlineData: { data: image.base64, mimeType: image.mimeType } },
                { text: 'Enhance this image to improve its quality, clarity, and color balance. Make it look professional and sharp.' },
            ],
        },
        config: { responseModalities: [Modality.IMAGE] },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) return part.inlineData.data;
    }
    return null;
}

export async function stylizeImage(image: ImageData, style: string): Promise<string | null> {
    const ai = await getAiClient();
    const model = 'gemini-2.5-flash-image';
    
    const response = await ai.models.generateContent({
        model,
        contents: {
            parts: [
                { inlineData: { data: image.base64, mimeType: image.mimeType } },
                { text: `Recreate this image in the style of ${style}. Maintain the core subject and composition but adopt the new artistic style completely.` },
            ],
        },
        config: { responseModalities: [Modality.IMAGE] },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) return part.inlineData.data;
    }
    return null;
}

export async function validateHuman(image: ImageData): Promise<boolean | null> {
    const ai = await getAiClient();
    const model = 'gemini-2.5-flash';

    const response = await ai.models.generateContent({
        model,
        contents: {
            parts: [
                { inlineData: { data: image.base64, mimeType: image.mimeType } },
                { text: 'Analyze the image. Does it contain a human or a human-like figure? Respond in JSON format with a single key "containsHuman" which has a boolean value.' },
            ]
        },
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    containsHuman: { type: Type.BOOLEAN },
                },
            },
        },
    });

    try {
        const json = JSON.parse(response.text);
        return json.containsHuman;
    } catch {
        return null;
    }
}

export async function extractObject(image: ImageData, objectToExtract: string): Promise<string | null> {
    const ai = await getAiClient();
    const model = 'gemini-2.5-flash-image';

    const response = await ai.models.generateContent({
        model,
        contents: {
            parts: [
                { inlineData: { data: image.base64, mimeType: image.mimeType } },
                { text: `From the image provided, extract the following object: "${objectToExtract}". The resulting image should contain only the extracted object on a transparent background.` },
            ],
        },
        config: { responseModalities: [Modality.IMAGE] },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) return part.inlineData.data;
    }
    return null;
}

export async function generateVideoFromImage(image: ImageData, prompt: string, onProgress: (message: string) => void): Promise<string | null> {
    const ai = await getAiClient();
    const model = 'veo-3.1-fast-generate-preview';
    onProgress('Starting video generation...');
    
    let operation = await ai.models.generateVideos({
        model: model,
        prompt: prompt,
        image: { imageBytes: image.base64, mimeType: image.mimeType },
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
    });
    
    const progressMessages = ["Thinking about the first scene...", "Animating the pixels...", "Rendering the motion...", "Adding final touches..."];
    let messageIndex = 0;

    while (!operation.done) {
        onProgress(progressMessages[messageIndex % progressMessages.length]);
        messageIndex++;
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) return null;
    
    onProgress('Fetching your video...');
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const videoBlob = await response.blob();
    return URL.createObjectURL(videoBlob);
}
