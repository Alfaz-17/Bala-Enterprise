import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export async function analyzeProductImage(
  imageBuffer: Buffer,
  mimeType: string,
  categories: string[] = []
) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables.");
  }

  const modelName = "gemini-2.5-flash";

  const categoriesPrompt =
    categories.length > 0
      ? `Pick the most appropriate category from this list: ${categories.join(", ")}. If none fit perfectly, pick the closest one.`
      : `Suggest the most appropriate category name for this industrial product (e.g., EOT Cranes, Wire Rope Hoists, Chain Blocks, etc.)`;

  const prompt = `
    You are an expert in industrial lifting and material handling equipment.
    Analyze this product image and provide details for an industrial equipment e-commerce listing.
    This is for Bala Enterprise, a manufacturer/supplier of cranes, hoists, winches, stackers, and industrial lifting equipment.

    Provide these details:
    1. Name: A clear, professional product name
    2. Slug: URL-friendly lowercase slug (e.g., "eot-double-girder-crane-50t")
    3. Short Description: A concise 1-2 sentence summary (max 200 chars)
    4. Full Description: A detailed 150-300 word technical description covering features, applications, construction, and benefits
    5. Capacity: The capacity range if identifiable (e.g., "5 Ton to 100 Ton"), or a reasonable estimate based on the product type
    6. Model Number: Suggest a model number if visible, otherwise provide a reasonable format (e.g., "BE-EOT-50T")
    7. Span: The span range if applicable (e.g., "10m to 30m")
    8. Category: ${categoriesPrompt}

    Return the information ONLY in this exact JSON format (no markdown, no extra text):
    {
      "name": "Product Name",
      "slug": "url-friendly-slug",
      "shortDescription": "Brief summary",
      "fullDescription": "Detailed description...",
      "capacity": "Capacity range",
      "modelNumber": "Model number",
      "span": "Span range or empty string",
      "categoryName": "Category name"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        { text: prompt },
        {
          inlineData: {
            data: imageBuffer.toString("base64"),
            mimeType: mimeType,
          },
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from AI");
    }

    return JSON.parse(text);
  } catch (error: any) {
    console.error("Gemini API error:", error);

    let errorMessage = "AI Analysis failed.";
    if (error.status === 429 || error.message?.includes("429")) {
      errorMessage =
        "AI rate limit reached. Please wait a minute and try again.";
    } else if (error.status === 404 || error.message?.includes("404")) {
      errorMessage = "AI model currently unavailable. Please try again later.";
    } else if (error.status === 403 || error.message?.includes("403")) {
      errorMessage = `Access denied for model '${modelName}'. Check your API key permissions.`;
    } else if (error.message?.includes("API key")) {
      errorMessage = "Invalid Gemini API key. Check your .env.local file.";
    }

    throw new Error(errorMessage);
  }
}
