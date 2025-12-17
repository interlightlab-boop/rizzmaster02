
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
          text: { type: Type.STRING, description: "The actual reply text suggestions in the PARTNER'S language. MUST be detailed, engaging, and longer than generic AI responses." },
          translation: { type: Type.STRING, description: "Translation of the reply text into the User's UI language. NULL if languages match." },
          explanation: { type: Type.STRING, description: "Psychological explanation strictly in the User's UI language. NEVER use the partner's language here." },
        },
        required: ["tone", "text", "explanation"],
      },
    },
  },
  required: ["replies"],
};

// Helper to clean Markdown code blocks if the Lite model adds them
const cleanJson = (text: string): string => {
  let cleaned = text.trim();
  // Remove ```json and ``` wrap if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned;
};

export const generateRizzSuggestions = async (
  user: UserProfile,
  partner: PartnerProfile,
  imageBase64: string,
  mimeType: string,
  language: Language
): Promise<RizzGenerationResult> => {
  try {
    // Safety check for API Key
    if (!process.env.API_KEY) {
        throw new Error("API Key is missing. Check your .env file or build configuration.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Explicitly map language codes to full English names for the prompt
    const langMap: Record<string, string> = {
        en: "English", ko: "Korean", ja: "Japanese", fr: "French", 
        es: "Spanish", pt: "Portuguese", zh: "Chinese", ru: "Russian"
    };
    
    const userLangName = langMap[language] || "English";
    const partnerLangName = langMap[partner.language] || "English";
    
    // --- TOKEN SAVING LOGIC ---
    const isSameLanguage = language === partner.language;
    let translationInstruction = "";

    if (isSameLanguage) {
        translationInstruction = `C. **TRANSLATION ('translation' field)**: CRITICAL - OMIT THIS FIELD OR RETURN NULL. The user and partner speak the same language (${userLangName}). Do NOT generate a translation.`;
    } else {
        translationInstruction = `C. **TRANSLATION ('translation' field)**: MANDATORY. Translate the reply text into **${userLangName}** (${language}) so the user understands what they are sending.`;
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
    }

    // --- ENHANCED PROMPT LOGIC ---
    const prompt = `
      You are a world-class Dating Coach and Psychology Expert specializing in behavioral analysis, evolutionary psychology, and MBTI dynamics.
      
      **TASK:**
      Analyze the attached chat screenshot and generate 3 distinct replies.
      You MUST roleplay as the User (Sender) and carefully target the Partner (Recipient) by synthesizing ALL provided profile data.

      **CRITICAL INSTRUCTION ON LENGTH & QUALITY:**
      The user explicitly wants **rich, detailed, and high-quality responses**. 
      - **AVOID** generic, short, or robotic answers (e.g., "That's cool").
      - **DO** elaborate, add wit, use emojis appropriately, and make the conversation engaging.
      - Each reply should feel like a "Masterpiece" of social engineering.

      **1. THE SENDER (USER PROFILE):**
      - Gender: ${user.gender}
      - Age: ${user.age}
      - MBTI: ${user.mbti}
      *Constraint*: The replies MUST sound authentic to a ${user.gender} aged ${user.age} with ${user.mbti} personality.

      **2. THE RECIPIENT (PARTNER PROFILE):**
      - Name: ${partner.name}
      - Gender: ${partner.gender}
      - Age: ${partner.age ? partner.age : "Unknown"}
      - MBTI: ${partner.mbti}
      - Relationship: ${partner.relation}
      - Goal: ${partner.goal}
      - Desired Vibe: ${partner.vibe}
      - Context Hints: "${partner.context}"

      **3. LANGUAGE RULES (CRITICAL):**
      A. **REPLY TEXT ('text' field)**: Must be in **${partnerLangName}** (${partner.language}). This is what the user sends to the partner.
         - **STRICT PROHIBITION**: NEVER mention "MBTI", personality types (e.g. "INTJ"), or psychological terms in this text. The reply must sound 100% natural.
      B. **EXPLANATION ('explanation' field)**: Must be in **${userLangName}** (${language}). You are explaining the strategy TO THE USER.
      ${translationInstruction}
      D. **POLITENESS**: ${politenessInstruction}

      **4. GENERATION STRATEGY (The 3 Replies):**
      
      **Reply 1 (Safe & Steady):** 
      - **Length**: 3-4 full sentences.
      - Strategy: Low risk but highly engaging. Validate their last message and pivot to a new topic or question.
      
      **Reply 2 (Playful/Witty):** 
      - **Length**: 3-4 full sentences.
      - Strategy: Show distinct personality. Use the selected Vibe (${partner.vibe}) strongly. Be creative, teasing, or charming.

      **Reply 3 (👑 THE MASTERPIECE):**
      - **CRITICAL INSTRUCTION**: This reply MUST be SIGNIFICANTLY longer and higher quality.
      - **Length**: 5-8 sentences (Target 80-120 words). 
      - **Synthesis**: Explicitly combine User's ${user.mbti} strength with Partner's ${partner.mbti} weakness.
      - **Goal**: Laser-focus on achieving '${partner.goal}'.
      - **Tone Label**: Mark as "🔥 MASTERPIECE".
      
      Output exactly 3 replies in valid JSON format matching the schema.
    `;

    // 🚨 [사장님 요청] GEMINI 2.0 FLASH LITE (가장 저렴한 모델) 사용
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite-preview-02-05", 
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
        temperature: 0.9, // Increased to 0.9 for maximum creativity and flair
      },
    });

    const usage = result.usageMetadata;
    if (usage) {
        console.log(`Tokens - Input: ${usage.promptTokenCount}, Output: ${usage.candidatesTokenCount}`);
    }

    if (result.text) {
        try {
            const cleanedText = cleanJson(result.text);
            return JSON.parse(cleanedText) as RizzGenerationResult;
        } catch (e) {
            console.error("JSON Parse Error on Lite Model:", e);
            console.log("Raw Text:", result.text);
            throw new Error("AI analysis failed to format the response. Please try again.");
        }
    }
    
    throw new Error("No response generated from AI.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
