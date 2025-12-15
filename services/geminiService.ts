
import { GoogleGenAI, Type, Schema } from "@google/genai";
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
          tone: { type: Type.STRING, description: "The tone of the reply (e.g., Witty, Sweet, Chill) in the User's UI language." },
          text: { type: Type.STRING, description: "The actual reply text suggestions in the PARTNER'S language. MUST be detailed (2-3 sentences)." },
          translation: { type: Type.STRING, description: "Translation of the reply text into the User's UI language. NULL if languages match." },
          explanation: { type: Type.STRING, description: "Psychological explanation in the User's UI language." },
        },
        required: ["tone", "text", "explanation"],
      },
    },
  },
  required: ["replies"],
};

export const generateRizzSuggestions = async (
  user: UserProfile,
  partner: PartnerProfile,
  imageBase64: string,
  mimeType: string,
  language: Language
): Promise<RizzGenerationResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Explicitly map language codes to full English names for the prompt
    const langMap: Record<string, string> = {
        en: "English", ko: "Korean", ja: "Japanese", fr: "French", 
        es: "Spanish", pt: "Portuguese", zh: "Chinese", ru: "Russian"
    };
    
    const userLangName = langMap[language] || "English";
    const partnerLangName = langMap[partner.language] || "English";
    
    // --- TOKEN SAVING LOGIC ---
    // Only request translation if languages differ
    const isSameLanguage = language === partner.language;
    let translationInstruction = "";

    if (isSameLanguage) {
        translationInstruction = `4. **Translation ('translation' field)**: CRITICAL - OMIT THIS FIELD OR RETURN NULL. The user and partner speak the same language (${userLangName}). Do NOT generate a translation to save tokens.`;
    } else {
        translationInstruction = `4. **Translation ('translation' field)**: MANDATORY. Translate the reply text into **${userLangName}** (${language}) so the user understands what they are sending.`;
    }

    // --- Strict Politeness Logic ---
    let politenessInstruction = `Politeness level: ${partner.politeness}.`;

    if (partner.language === 'ko') {
        if (partner.politeness === 'Casual') {
            politenessInstruction = "CRITICAL: You MUST use 반말 (Banmal/Casual speech). Do NOT use honorifics endings like '요' (yo) or '니다' (nida). Talk like a close friend.";
        } else if (partner.politeness === 'Polite') {
            politenessInstruction = "CRITICAL: You MUST use 존댓말 (Jondaemal/Polite speech). Be respectful and use '요' or '니다'.";
        }
    } else if (partner.language === 'ja') {
        if (partner.politeness === 'Casual') {
            politenessInstruction = "CRITICAL: You MUST use Tameguchi (タメ口/Casual). Do NOT use Desu/Masu forms.";
        } else if (partner.politeness === 'Polite') {
            politenessInstruction = "CRITICAL: You MUST use Keigo/Desu/Masu (Polite form).";
        }
    } else if (partner.language === 'fr') {
        if (partner.politeness === 'Casual') {
            politenessInstruction = "CRITICAL: You MUST use 'Tu' (informal).";
        } else if (partner.politeness === 'Polite') {
            politenessInstruction = "CRITICAL: You MUST use 'Vous' (formal).";
        }
    }

    const prompt = `
      You are a world-class Dating Coach and Psychology Expert specializing in social dynamics and MBTI.
      
      Your task is to analyze the attached chat screenshot and generate 3 distinct replies to maximize the user's attractiveness ("Rizz").
      
      User Profile:
      - Gender: ${user.gender}
      - Age: ${user.age}
      - MBTI: ${user.mbti}
      
      Partner Profile (Who we are texting):
      - Name: ${partner.name}
      - Relation: ${partner.relation}
      - Gender: ${partner.gender}
      - MBTI: ${partner.mbti} (Tailor the communication style to this MBTI type)
      - Goal: ${partner.goal}
      - Desired Vibe: ${partner.vibe}
      - Context Hints: "${partner.context}"
      
      IMPORTANT - LANGUAGE RULES:
      1. **Reply Text ('text' field)**: MUST be written in **${partnerLangName}** (${partner.language}). This is what the user sends.
      2. **Explanation ('explanation' field)**: MUST be written in **${userLangName}** (${language}). Explain the psychology to the user.
      3. **Tone ('tone' field)**: MUST be written in **${userLangName}** (${language}).
      ${translationInstruction}
      
      IMPORTANT - POLITENESS RULES:
      ${politenessInstruction}
      
      CRITICAL INSTRUCTIONS FOR GENERATION (3 REPLIES STRUCTURE):
      
      You must generate exactly 3 replies in this specific order:

      **Reply 1 & 2 (Standard Options):**
      - Length: 2-3 sentences.
      - Quality: High quality, witty, safe, and effective.
      - Purpose: Good reliable options for daily use.

      **Reply 3 (THE MASTERPIECE / PREMIUM OPTION):**
      - **CRITICAL:** This is the paid "Pro" feature. It MUST be significantly better than the first two.
      - **Length:** Longer and richer (3-5 sentences).
      - **Content:** Use advanced psychological tactics (Cold Reading, Push-Pull, Vulnerability, Emotional Spike).
      - **Impact:** It should be irresistible, charismatic, and deeply engaging.
      - **Tone:** Mark the tone as "🔥 ULTIMATE" or "👑 MASTERPIECE".
      
      MBTI GUIDELINES:
         - 'N' types: Use metaphors, abstract humor, deep questions.
         - 'S' types: Be concrete, observant, comment on specific details in the photo/chat.
         - 'T' types: Use logical wit, playful teasing, challenge them slightly.
         - 'F' types: Focus on emotional connection, warmth, validation.
      
      Output exactly 3 replies following this structure.
    `;

    // Use Gemini Flash-Lite for maximum profit margin ($0.075 / 1M input tokens)
    // This is significantly cheaper than GPT-4o or even standard Gemini Flash.
    const result = await ai.models.generateContent({
      model: "gemini-flash-lite-latest", 
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
        temperature: 0.8, 
      },
    });

    const usage = result.usageMetadata;
    if (usage) {
        // Updated Pricing for Flash-Lite (Approximate)
        const inputCost = (usage.promptTokenCount / 1000000) * 0.075;
        const outputCost = (usage.candidatesTokenCount / 1000000) * 0.30;
        const totalCostUSD = inputCost + outputCost;
        const totalCostKRW = totalCostUSD * 1400; 

        console.group("💰 Profit Margin Analysis (Gemini Flash-Lite)");
        console.log(`Tokens - Input: ${usage.promptTokenCount}, Output: ${usage.candidatesTokenCount}`);
        console.log(`Cost (USD): $${totalCostUSD.toFixed(7)}`);
        console.log(`Cost (KRW): ₩${totalCostKRW.toFixed(2)}`);
        console.log(`Est. Ad Revenue: ₩5.00 - ₩10.00`);
        console.log(`Net Profit: ₩${(7 - totalCostKRW).toFixed(2)} per click`);
        console.groupEnd();
    }

    if (result.text) {
        return JSON.parse(result.text) as RizzGenerationResult;
    }
    
    throw new Error("No response text generated");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Billing / Quota Error Handling
    if (error.message?.includes('429') || error.message?.includes('quota')) {
        throw new Error("Server is busy (Rate Limit). Please try again in a moment.");
    }
    
    if (error.message?.includes('API_KEY')) {
        throw new Error("System Configuration Error. Please contact support.");
    }

    throw new Error("Failed to analyze image. Please try a different photo.");
  }
};
