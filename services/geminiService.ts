import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, PartnerProfile, RizzGenerationResult, Language } from "../types";

// Declare process for TS since it is injected by Vite
declare const process: { env: { API_KEY: string } };

// Define schema as a plain object per SDK guidelines
const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    rizzScore: {
      type: Type.INTEGER,
      description: "A score from 0 to 100 indicating how well the conversation is going. 0 = Disaster, 100 = Soulmates.",
    },
    roast: {
      type: Type.STRING,
      description: "A short, witty, slightly savage 1-sentence observation about the situation in the User's UI language.",
    },
    replies: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          tone: { type: Type.STRING, description: "The tone of the reply (e.g., Witty, Sweet, Chill) in the User's UI language." },
          text: { type: Type.STRING, description: "The actual reply text suggestions. Must be long, detailed, and engaging. Reply 3 must be 5+ sentences." },
          translation: { type: Type.STRING, description: "MANDATORY if languages differ: Translate the reply 'text' into the User's UI language. If same, return NULL." },
          explanation: { type: Type.STRING, description: "Psychological explanation strictly in the User's UI language." },
        },
        required: ["tone", "text", "explanation"],
      },
    },
  },
  required: ["rizzScore", "roast", "replies"],
};

// Helper to clean Markdown code blocks if any
const cleanJson = (text: string): string => {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned;
};

// Model configuration with fallback strategy
const MODELS_TO_TRY = [
    "gemini-2.0-flash-lite-001",    // Primary lightweight model
    "gemini-flash-lite-latest",     // Fallback alias
    "gemini-3-flash-preview"        // Legacy fallback
];

export const generateRizzSuggestions = async (
  user: UserProfile,
  partner: PartnerProfile,
  imageBase64: string,
  mimeType: string,
  language: Language
): Promise<RizzGenerationResult> => {
  try {
    if (!process.env.API_KEY) {
        throw new Error("API Key is missing. Check your environment variables.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const langMap: Record<string, string> = {
        en: "English", ko: "Korean", ja: "Japanese", fr: "French", 
        es: "Spanish", pt: "Portuguese", zh: "Chinese", ru: "Russian"
    };
    
    const userLangName = langMap[language] || "English";
    const partnerLangName = langMap[partner.language] || "English";
    
    const isSameLanguage = language === partner.language;
    let translationInstruction = isSameLanguage 
        ? "C. **TRANSLATION**: OMIT THIS FIELD OR RETURN NULL."
        : `C. **TRANSLATION**: 🔴 **STRICTLY REQUIRED**. Translate the 'text' into **${userLangName}**.`;

    let politenessInstruction = `Politeness level: ${partner.politeness}.`;
    if (partner.language === 'ko') {
        if (partner.politeness === 'Casual') {
            politenessInstruction = "CRITICAL: You MUST use 반말 (Banmal) ONLY. Talk like a close friend. Never use '요' or '니다'.";
        } else if (partner.politeness === 'Polite') {
            politenessInstruction = "CRITICAL: You MUST use 존댓말 (Jondaemal).";
        }
    }

    const prompt = `
      Analyze the chat screenshot and generate 3 HIGH-QUALITY replies.
      
      User: ${user.gender}, ${user.age}y/o, MBTI: ${user.mbti}
      Partner: ${partner.name}, ${partner.gender}, MBTI: ${partner.mbti}
      Goal: ${partner.goal}, Strategy: ${partner.vibe}, Context: "${partner.context}"

      **RULES:**
      1. NEVER mention MBTI types or the word "MBTI" in the reply 'text'.
      2. VISUAL HOOK: Reference a detail from the image.
      3. REPLY 3 (👑 MASTERPIECE): 5-8 sentences. Show extreme charisma.
      4. REPLY TEXT: In ${partnerLangName}. EXPLANATION: In ${userLangName}.
      5. ${translationInstruction}
      6. POLITENESS: ${politenessInstruction}
      7. ROAST: In ${userLangName}.

      Output valid JSON matching the schema.
    `;

    let lastError: any = null;

    for (const modelName of MODELS_TO_TRY) {
        try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents: {
                parts: [
                    { text: prompt },
                    { inlineData: { mimeType, data: imageBase64 } },
                ],
              },
              config: {
                responseMimeType: "application/json",
                responseSchema: RESPONSE_SCHEMA,
                temperature: 0.85,
              },
            });

            if (response.text) {
                const cleanedText = cleanJson(response.text);
                const parsed = JSON.parse(cleanedText) as RizzGenerationResult;
                
                // Safety: remove hallucinations of MBTI labels in the output
                parsed.replies = parsed.replies.map(r => ({
                    ...r,
                    text: r.text.replace(/\b(MBTI|INTJ|INTP|ENTJ|ENTP|INFJ|INFP|ENFJ|ENFP|ISTJ|ISFJ|ESTJ|ESFJ|ISTP|ISFP|ESTP|ESFP)\b/gi, "").trim()
                }));
                
                return parsed;
            }
        } catch (error: any) {
            console.warn(`Model ${modelName} failed, trying next... Error:`, error.message || error);
            lastError = error;
            // Short delay before fallback
            await new Promise(resolve => setTimeout(resolve, 300));
            continue;
        }
    }
    
    throw lastError || new Error("All models failed to respond.");

  } catch (error: any) {
    console.error("Gemini Service Error:", error);
    throw error;
  }
};