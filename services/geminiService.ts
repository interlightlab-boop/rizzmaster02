
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, PartnerProfile, RizzGenerationResult, Language } from "../types";

// Declare process for TS since it is injected by Vite
declare const process: { env: { API_KEY: string } };

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    rizzScore: {
      type: Type.INTEGER,
      description: "A score from 0 to 100 indicating how well the conversation is going for the user. 0 = Disaster, 100 = Soulmates.",
    },
    roast: {
      type: Type.STRING,
      description: "A short, witty, slightly savage 1-sentence observation about the screenshot context in the User's UI language.",
    },
    replies: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          tone: { type: Type.STRING, description: "The tone of the reply (e.g., Witty, Sweet, Chill) in the User's UI language." },
          text: { type: Type.STRING, description: "The actual reply text suggestions. Must be long, detailed, and engaging. Reply 3 must be 5+ sentences." },
          translation: { type: Type.STRING, description: "MANDATORY if languages differ: Translate the reply 'text' into the User's UI language. If languages match, return NULL." },
          explanation: { type: Type.STRING, description: "Psychological explanation strictly in the User's UI language. NEVER use the partner's language here." },
        },
        required: ["tone", "text", "explanation"],
      },
    },
  },
  required: ["rizzScore", "roast", "replies"],
};

// Helper to clean Markdown code blocks
const cleanJson = (text: string): string => {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned;
};

// 🚨 [사장님 확인] 모델 안정화 버전 고정 (Cost & Stability Control)
const MODELS_TO_TRY = [
    "gemini-2.0-flash-lite-001"
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
    let translationInstruction = "";

    if (isSameLanguage) {
        translationInstruction = `C. **TRANSLATION**: OMIT THIS FIELD OR RETURN NULL.`;
    } else {
        translationInstruction = `C. **TRANSLATION**: 🔴 **STRICTLY REQUIRED**. Translate the 'text' into **${userLangName}**.`;
    }

    let politenessInstruction = `Politeness level: ${partner.politeness}.`;

    if (partner.language === 'ko') {
        if (partner.politeness === 'Casual') {
            politenessInstruction = "CRITICAL: You MUST use 반말 (Banmal/Casual speech) ONLY. Talk like a close friend. Never use '요' or '니다'.";
        } else if (partner.politeness === 'Polite') {
            politenessInstruction = "CRITICAL: You MUST use 존댓말 (Jondaemal/Polite speech).";
        }
    }

    const prompt = `
      You are a world-class Dating Coach, Charisma Expert, and Psychologist.
      
      **TASK:**
      Analyze the chat screenshot and generate 3 HIGH-QUALITY, UNIQUE replies.
      
      **THE GOAL:** 
      Make the user stand out as the most interesting person in the partner's inbox.

      **1. PROFILES:**
      - User: ${user.gender}, ${user.age}y/o, MBTI: ${user.mbti}
      - Partner: ${partner.name}, ${partner.gender}, ${partner.age ? partner.age + 'y/o' : 'unknown age'}, MBTI: ${partner.mbti}
      - Relationship: ${partner.relation}, Goal: ${partner.goal}, Strategy: ${partner.vibe}
      - Context: "${partner.context}"

      **2. 🚫 STRICT NEGATIVE CONSTRAINT (EXTREMELY IMPORTANT):**
      - **NEVER mention any MBTI types (e.g., "As an INFJ...", "You're such an ENFP") or the word "MBTI" in the actual reply 'text'.**
      - Use the MBTI knowledge ONLY to influence the tone and psychological strategy behind the scenes.
      - If you mention MBTI in the reply, the user will be embarrassed. **DO NOT DO IT.**

      **3. STYLE & LENGTH RULES:**
      - **NO DRY TEXTING:** BANNED: "Hey", "How are you", "What's up".
      - **VISUAL HOOK:** You MUST reference a specific detail from the image (background, clothing, objects, a specific word they used).
      - **EMOJIS:** Use 1-2 appropriate emojis max.
      - **REPLY 1 & 2 LENGTH:** 3-4 sentences. Detailed and conversational.
      - **REPLY 3 (👑 MASTERPIECE) LENGTH:** **5-8 sentences.** This must be a high-value, "Pro" level response that shows extreme charisma, intelligence, and effort.

      **4. LANGUAGE:**
      A. **REPLY TEXT**: In **${partnerLangName}**.
      B. **EXPLANATION**: In **${userLangName}**.
      ${translationInstruction}
      D. **POLITENESS**: ${politenessInstruction}
      E. **ROAST**: In **${userLangName}**.

      **5. GENERATION STRATEGY:**
      - **Reply 1 (The Safe Multiplier):** A solid pivot. Acknowledge their point, add a unique observation about the photo, and ask a high-value question.
      - **Reply 2 (The Vibe Specialist - ${partner.vibe}):** Fully lean into the chosen strategy. If 'Witty', use playful teasing. If 'Sweet', use a genuine, detailed observation that makes them feel seen.
      - **Reply 3 (👑 THE MASTERPIECE - "THE GAME CHANGER"):** 
        - This is the reason users pay for the app. 
        - **Psychology:** Use "Cold Reading" (make a bold, playful assumption about their personality based on the photo) + "Future Pacing" (hint at a future activity) + "Open Loop".
        - **Structure:** Start with something unpredictable -> weave in a compliment that isn't about looks -> end with a magnetic challenge or question.
        - **Tone:** High confidence, slightly mysterious, and deeply engaging.
      
      Output valid JSON only.
    `;

    let lastError = null;

    for (const modelName of MODELS_TO_TRY) {
        try {
            const result = await ai.models.generateContent({
              model: modelName, 
              contents: {
                role: "user",
                parts: [
                    { text: prompt },
                    { inlineData: { mimeType: mimeType, data: imageBase64 } },
                ],
              },
              config: {
                responseMimeType: "application/json",
                responseSchema: RESPONSE_SCHEMA,
                temperature: 0.9, 
                topP: 0.95,
              },
            });

            if (result.text) {
                try {
                    const cleanedText = cleanJson(result.text);
                    const parsed = JSON.parse(cleanedText) as RizzGenerationResult;
                    
                    // Double check MBTI mention and try to fix if model hallucinated
                    parsed.replies = parsed.replies.map(r => ({
                        ...r,
                        text: r.text.replace(/\b(MBTI|INTJ|INTP|ENTJ|ENTP|INFJ|INFP|ENFJ|ENFP|ISTJ|ISFJ|ESTJ|ESFJ|ISTP|ISFP|ESTP|ESFP)\b/gi, "")
                    }));
                    
                    return parsed;
                } catch (e) {
                    console.warn(`JSON Parse failed on ${modelName}`, e);
                    lastError = e;
                    continue; 
                }
            }
        } catch (error: any) {
            console.warn(`Model ${modelName} failed:`, error.message || error);
            lastError = error;
            await new Promise(resolve => setTimeout(resolve, 500));
            continue;
        }
    }
    
    const msg = lastError instanceof Error ? lastError.message : String(lastError);
    throw new Error(`Service busy. Details: ${msg}`);

  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw error;
  }
};
