
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
          text: { type: Type.STRING, description: "The actual reply text suggestions in the PARTNER'S language. MUST be detailed, engaging, and longer than generic AI responses (2-4 sentences)." },
          translation: { type: Type.STRING, description: "Translation of the reply text into the User's UI language. NULL if languages match." },
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

export const generateRizzSuggestions = async (
  user: UserProfile,
  partner: PartnerProfile,
  imageBase64: string,
  mimeType: string,
  language: Language
): Promise<RizzGenerationResult> => {
  try {
    if (!process.env.API_KEY) {
        throw new Error("API Key is missing. Check your .env file or build configuration.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
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
            politenessInstruction = "CRITICAL: You MUST use 반말 (Banmal/Casual speech) ONLY. Talk like a close friend. Never use '요' or '니다'.";
        } else if (partner.politeness === 'Polite') {
            politenessInstruction = "CRITICAL: You MUST use 존댓말 (Jondaemal/Polite speech). Be respectful.";
        }
    } else if (partner.language === 'ja') {
        if (partner.politeness === 'Casual') {
            politenessInstruction = "CRITICAL: You MUST use Tameguchi (タメ口/Casual). Do NOT use Desu/Masu.";
        } else if (partner.politeness === 'Polite') {
            politenessInstruction = "CRITICAL: You MUST use Keigo/Desu/Masu (Polite form).";
        }
    }

    // --- ENHANCED PROMPT LOGIC ---
    const prompt = `
      You are a world-class Dating Coach, Stand-up Comedian, and Psychology Expert (specializing in MBTI dynamics).
      
      **TASK:**
      Analyze the chat screenshot and generate 3 HIGH-QUALITY, UNIQUE replies.
      
      **THE GOAL:** 
      Stop the user from being "boring". The replies must be "High Rizz" - charismatic, unpredictable, and engaging.

      **1. THE USER (SENDER):**
      - Gender: ${user.gender}, Age: ${user.age}, MBTI: ${user.mbti}

      **2. THE PARTNER (RECIPIENT):**
      - Name: ${partner.name}, Gender: ${partner.gender}, MBTI: ${partner.mbti}
      - Relation: ${partner.relation}, Goal: ${partner.goal}, Vibe: ${partner.vibe}
      - Context: "${partner.context}"

      **3. CRITICAL STYLE RULES (STRICTLY ENFORCE):**
      - **NO BORING OPENERS:** BANNED words: "Hey", "Hi", "Hello", "How are you", "Nice photo".
      - **LENGTH:** Replies must be **2-4 sentences**. They need substance and depth.
      - **SPECIFICITY:** You MUST reference a visual detail from the photo (e.g., "That sushi looks expensive," "Is that a cat in the background?").
      - **HOOKS:** End with a question, a challenge, or a playful assumption. Don't just make a statement.
      - **EMOJIS:** Use 1-2 relevant emojis to set the tone.

      **4. LANGUAGE RULES:**
      A. **REPLY TEXT**: Must be in **${partnerLangName}** (${partner.language}). Natural, native-speaker level.
      B. **EXPLANATION**: Must be in **${userLangName}** (${language}).
      ${translationInstruction}
      D. **POLITENESS**: ${politenessInstruction}
      E. **ROAST**: Must be in **${userLangName}**. Be savage and funny about their chat skills or the situation.

      **5. GENERATION STRATEGY:**
      
      **Reply 1 (The Safe Bet):** 
      - A solid, reliable text. Validates their last message and pivots to a new topic based on the image. Safe but effective.
      
      **Reply 2 (The Vibe Match - ${partner.vibe}):** 
      - If 'Witty': Playful teasing, "Push-Pull" technique.
      - If 'Sweet': Genuine compliment + detailed question.
      - If 'Bold': Direct intent, confidence, high risk.
      
      **Reply 3 (👑 THE MASTERPIECE - THE "GAME CHANGER"):** 
      - **THIS MUST BE THE BEST REPLY.**
      - **Psychology:** Use "Cold Reading" (make a specific guess about them based on the image) or "Playful Accusation" (tease them about something in the photo).
      - **Structure:** Observation + High-Value Opinion + Open-ended Loop.
      - **Example Idea:** "You look like trouble. 😈 I bet you stole that [item in photo]." OR "I was going to say [something], but seeing this photo, I think you're actually [personality trait]."
      - **Requirement:** It must be longer, more complex, and psychologically calibrated to their MBTI (${partner.mbti}). It should make the partner pause and laugh/think.
      
      **Rizz Score (0-100):**
      - Rate the current conversation situation based on the screenshot. 0-30: Ghosting/Dry. 70-100: High Interest.
      
      Output valid JSON only.
    `;

    // 🚨 [UPGRADED] Using Gemini 2.0 Flash (Standard) for higher intelligence than Lite
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash", 
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
        temperature: 1.0, // High creativity for "Masterpiece"
        topP: 0.95,
        topK: 40,
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
            console.error("JSON Parse Error:", e);
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
