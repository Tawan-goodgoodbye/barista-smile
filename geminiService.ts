import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API
// IMPORTANT: In a real app, use import.meta.env.VITE_GEMINI_API_KEY
// For this quick test, you can paste your key here TEMPORARILY.
const API_KEY = "PASTE_YOUR_GEMINI_API_KEY_HERE"; 
const genAI = new GoogleGenerativeAI(API_KEY);

export async function processImage(imageBase64: string, prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Remove the data URL prefix if present (e.g., "data:image/jpeg;base64,")
    const base64Data = imageBase64.split(',')[1] || imageBase64;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      },
    ]);

    return result.response.text();
  } catch (error) {
    console.error("Error calling Gemini:", error);
    throw error;
  }
}
