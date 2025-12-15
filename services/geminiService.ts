
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
          text: { type: Type.STRING, description: "The actual reply text suggestions in the PARTNER'S language. MUST be detailed." },
          translation: { type: Type.STRING, description: "Translation of the reply text into the User's UI language. NULL if languages match." },
          explanation: { type: Type.STRING, description: "Psychological explanation strictly in the User's UI language. NEVER use the partner's language here." },
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
    } else if (partner.language === 'fr') {
        if (partner.politeness === 'Casual') {
            politenessInstruction = "CRITICAL: You MUST use 'Tu' (informal).";
        } else if (partner.politeness === 'Polite') {
            politenessInstruction = "CRITICAL: You MUST use 'Vous' (formal).";
        }
    }

    // --- ENHANCED PROMPT LOGIC ---
    const prompt = `
      You are a world-class Dating Coach and Psychology Expert specializing in behavioral analysis, evolutionary psychology, and MBTI dynamics.
      
      **TASK:**
      Analyze the attached chat screenshot and generate 3 distinct replies.
      You MUST roleplay as the User (Sender) and carefully target the Partner (Recipient) by synthesizing ALL provided profile data.

      **1. THE SENDER (USER PROFILE):**
      - Gender: ${user.gender}
      - Age: ${user.age}
      - MBTI: ${user.mbti}
      *Constraint*: The replies MUST sound authentic to a ${user.gender} aged ${user.age} with ${user.mbti} personality.
      (e.g., If User is Introverted, avoid overly loud/exclamatory phrasing. If Thinking, use logic/wit over raw emotion. If ${user.age} < 25, use Gen-Z slang if appropriate.)

      **2. THE RECIPIENT (PARTNER PROFILE):**
      - Name: ${partner.name}
      - Gender: ${partner.gender}
      - Age: ${partner.age ? partner.age : "Unknown"}
      - MBTI: ${partner.mbti}
      - Relationship: ${partner.relation}
      - Goal: ${partner.goal}
      - Desired Vibe: ${partner.vibe}
      - Context Hints: "${partner.context}"
      *Constraint*: Target the cognitive functions of ${partner.mbti}. Consider the age gap (${user.age} vs ${partner.age || 'Unknown'}).

      **3. LANGUAGE RULES (CRITICAL):**
      A. **REPLY TEXT ('text' field)**: Must be in **${partnerLangName}** (${partner.language}). This is what the user sends to the partner.
         - **STRICT PROHIBITION**: NEVER mention "MBTI", personality types (e.g. "INTJ", "ENFP"), or psychological terms in this text. The reply must sound 100% natural and organic. The partner must NOT know they are being analyzed.
      B. **EXPLANATION ('explanation' field)**: Must be in **${userLangName}** (${language}). You are explaining the strategy TO THE USER. **DO NOT** write the explanation in ${partnerLangName}. You SHOULD mention MBTI/Psychology concepts here to explain *why* the reply is effective.
      ${translationInstruction}
      D. **POLITENESS**: ${politenessInstruction}

      **4. GENERATION STRATEGY (The 3 Replies):**
      
      **Reply 1 (Safe & Steady):** 
      - Length: 1-2 sentences.
      - Strategy: Low risk, maintains flow, friendly but not desperate.
      
      **Reply 2 (Playful/Witty):** 
      - Length: 1-2 sentences.
      - Strategy: Shows personality, uses the selected Vibe (${partner.vibe}), teases slightly if appropriate for the relation.

      **Reply 3 (👑 THE MASTERPIECE - PREMIUM):**
      - **CRITICAL INSTRUCTION**: This reply MUST be SIGNIFICANTLY longer, deeper, and higher quality than the others.
      - **Length**: 3-5 sentences (approx 50-80 words). It should feel like a complete, charming thought or story.
      - **Synthesis**: Explicitly combine User's ${user.mbti} strength with Partner's ${partner.mbti} weakness.
        (e.g. If User is ENFP and Partner is INTJ: "Use your ENFP warmth to melt their INTJ shell, but respect their intellect.")
      - **Content**: Intelligently weave in the Context Hints ("${partner.context}"). Do not just mention them; use them as a hook.
      - **Goal**: Laser-focus on achieving '${partner.goal}'.
      - **Tone Label**: Mark as "🔥 MASTERPIECE".
      
      Output exactly 3 replies in the specified JSON schema.
    `;

    // Use Gemini Flash-Lite for maximum profit margin ($0.075 / 1M input tokens)
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
        temperature: 0.85, // Slightly higher creativity for the Masterpiece
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
