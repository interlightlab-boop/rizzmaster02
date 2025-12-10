
import { GoogleGenAI, Type, Schema, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { UserProfile, PartnerProfile, RizzGenerationResult, Language } from "../types";

// Declare process for TS since it is injected by Vite
declare const process: { env: { API_KEY: string } };

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    replies: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          tone: { type: Type.STRING, description: "The tactic used" },
          text: { type: Type.STRING, description: "Suggested reply in TARGET language" },
          translation: { type: Type.STRING, description: "Translation into native language (ONLY if target is different from native)" },
          explanation: { type: Type.STRING, description: "Psych reasoning" }
        },
        required: ["tone", "text", "explanation"]
      }
    }
  },
  required: ["replies"]
};

const getLanguageName = (code: Language): string => {
    const map: Record<Language, string> = { en: 'English', ko: 'Korean', ja: 'Japanese', zh: 'Simplified Chinese', es: 'Spanish', fr: 'French', pt: 'Portuguese', ru: 'Russian' };
    return map[code] || 'English';
};

export const generateRizzSuggestions = async (
  user: UserProfile, partner: PartnerProfile, imageBase64: string, imageMimeType: string, userInterfaceLanguage: Language
): Promise<RizzGenerationResult> => {
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const targetLang = getLanguageName(partner.language || userInterfaceLanguage);
  const nativeLang = getLanguageName(userInterfaceLanguage);
  const isCrossLang = (partner.language || userInterfaceLanguage) !== userInterfaceLanguage;
  
  const translationContext = isCrossLang 
    ? `The target speaks ${targetLang}, but the user speaks ${nativeLang}. You MUST fill the 'translation' field with the ${nativeLang} translation.`
    : `Both target and user speak ${nativeLang}. SKIP the 'translation' field (leave null or empty).`;

  const prompt = `
    IDENTITY: RizzMaster AI. Expert in Behavioral Psychology & MBTI.
    MISSION: Analyze chat and generate 3 distinct optimal replies.
    
    CRITICAL INSTRUCTION:
    1. Write 'text' in ${targetLang}.
    2. Write 'explanation' in ${nativeLang}.
    3. ${translationContext}
    4. Option 3 MUST be the "MASTERPIECE": longer, detailed, using advanced psychological hooks.
    
    TARGET MBTI: ${partner.mbti}.
    USER MBTI: ${user.mbti}.
    TACTICAL CONTEXT: ${partner.context || "No specific hint"}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [{ inlineData: { mimeType: imageMimeType, data: imageBase64 } }, { text: prompt }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.85,
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ]
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("AI returned empty results.");
    
    return JSON.parse(resultText) as RizzGenerationResult;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new Error(`AI 분석 중 오류가 발생했습니다: ${error.message || '환경 변수나 모델 설정을 확인해주세요.'}`);
  }
};
