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

// 🚨 PRIORITY QUEUE FOR MODELS (Strict Cost Control)
// User specifically requested "2.5 flash lite" (mapped to 'gemini-flash-lite-latest').
// Removed expensive models (like gemini-2.5-flash) to prevent high costs.
const MODELS_TO_TRY = [
    "gemini-flash-lite-latest"
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
        translationInstruction = `C. **TRANSLATION ('translation' field)**: OMIT THIS FIELD OR RETURN NULL. User and Partner share the language (${userLangName}). Translation is redundant.`;
    } else {
        translationInstruction = `C. **TRANSLATION ('translation' field)**: 🔴 **STRICTLY REQUIRED**. User speaks **${userLangName}** but Partner speaks **${partnerLangName}**. You MUST provide a clear translation of the 'text' into **${userLangName}** so the user understands the reply.`;
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

      **4. LANGUAGE RULES (STRICTLY FOLLOW):**
      A. **REPLY TEXT**: Generates replies in **${partnerLangName}** (${partner.language}). MUST be natural and culturally appropriate for ${partnerLangName}.
      B. **EXPLANATION**: Analyze and explain in **${userLangName}** (${language}).
      ${translationInstruction}
      D. **POLITENESS**: ${politenessInstruction}
      E. **ROAST**: Write the roast in **${userLangName}**.

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

    // 🚨 ROBUST FALLBACK LOOP
    let lastError = null;

    for (const modelName of MODELS_TO_TRY) {
        try {
            // console.log(`Attempting generation with model: ${modelName}`);
            
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
                temperature: 1.0, 
                topP: 0.95,
                topK: 40,
              },
            });

            if (result.text) {
                try {
                    const cleanedText = cleanJson(result.text);
                    return JSON.parse(cleanedText) as RizzGenerationResult;
                } catch (e) {
                    // JSON parsing failed, treat as error to trigger fallback
                    console.warn(`JSON Parse failed on ${modelName}`, e);
                    lastError = e;
                    continue; 
                }
            }
        } catch (error: any) {
            console.warn(`Model ${modelName} failed with error:`, error.message || error);
            lastError = error;
            
            // Add a tiny delay before retrying to let the API breathe
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Continue to the next model in the list...
            continue;
        }
    }
    
    // If we get here, ALL models failed.
    console.error("All AI models failed to generate response. Last Error:", lastError);
    // Explicitly throw "Service busy" or the actual error message so Analyzer.tsx can display it
    const msg = lastError instanceof Error ? lastError.message : String(lastError);
    throw new Error(`Service busy. Details: ${msg}`);

  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw error;
  }
};