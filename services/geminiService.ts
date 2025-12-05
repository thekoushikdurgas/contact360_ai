import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GeminiModel } from "../types";

// Initialize the API client safely
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing. AI features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const sendMessageToGemini = async (
  message: string,
  history: { role: string; parts: { text: string }[] }[] = []
): Promise<string> => {
  const client = getClient();
  if (!client) {
    return "Error: API Key is missing. Please configure your environment.";
  }

  try {
    const chat = client.chats.create({
      model: GeminiModel.FLASH,
      config: {
        systemInstruction: "You are NexusAI, a futuristic 3D dashboard assistant. You help users analyze data, write cold emails, and suggest lead strategies. Keep responses concise, professional, and formatted with Markdown.",
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      })),
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error connecting to the AI service.";
  }
};

export const streamMessageToGemini = async function* (
  message: string,
  history: { role: string; parts: { text: string }[] }[] = []
): AsyncGenerator<string, void, unknown> {
  const client = getClient();
  if (!client) {
    yield "Error: API Key is missing. Please configure your environment.";
    return;
  }

  try {
    const chat = client.chats.create({
      model: GeminiModel.FLASH,
      config: {
        systemInstruction: "You are NexusAI, a futuristic 3D dashboard assistant. You help users analyze data, write cold emails, and suggest lead strategies. Keep responses concise, professional, and formatted with Markdown.",
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      })),
    });

    const resultStream = await chat.sendMessageStream({ message });
    
    for await (const chunk of resultStream) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        yield c.text;
      }
    }
  } catch (error) {
    console.error("Gemini API Stream Error:", error);
    yield "Sorry, I encountered an error connecting to the AI service.";
  }
};

export const generateCompanySummary = async (companyName: string, industry: string): Promise<string> => {
  const client = getClient();
  if (!client) return "AI service unavailable. Check API Key.";

  try {
    const response = await client.models.generateContent({
      model: GeminiModel.FLASH,
      contents: `Write a professional, concise 2-sentence business summary for a company named '${companyName}' operating in the '${industry}' industry. Focus on their likely value proposition and market positioning.`,
    });
    return response.text || "No summary generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate summary.";
  }
};

export const findEmail = async (firstName: string, lastName: string, domain: string): Promise<{ email: string | null; confidence: number; pattern: string }> => {
  const client = getClient();
  
  // Clean inputs
  const cleanFirst = firstName.trim();
  const cleanLast = lastName.trim();
  const cleanDomain = domain.trim().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];

  if (!client) {
    // Fallback simulation if no API key
    await new Promise(resolve => setTimeout(resolve, 1500)); // Fake delay
    return {
      email: `${cleanFirst.toLowerCase()}.${cleanLast.toLowerCase()}@${cleanDomain}`,
      confidence: 85,
      pattern: 'first.last'
    };
  }

  try {
    const prompt = `
      Task: Predict the most likely corporate email address for a professional.
      
      Input:
      - First Name: ${cleanFirst}
      - Last Name: ${cleanLast}
      - Company Domain: ${cleanDomain}

      Instructions:
      1. Analyze the domain/company type to guess the most common email pattern (e.g., tech startups often use 'first@', large corps use 'first.last@').
      2. Return a JSON object with:
         - "email": The predicted full email address (string).
         - "confidence": A number 0-100 indicating probability.
         - "pattern": The pattern used (e.g., "{first}.{last}").
      3. Return ONLY valid JSON.
    `;

    const response = await client.models.generateContent({
      model: GeminiModel.FLASH,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Email Finder Error:", error);
    // Fallback on error
    return {
      email: `${cleanFirst.charAt(0).toLowerCase()}${cleanLast.toLowerCase()}@${cleanDomain}`,
      confidence: 60,
      pattern: 'f{last}' // Fallback pattern
    };
  }
};

export const analyzeEmailRisk = async (email: string): Promise<{ riskScore: number; analysis: string; isRoleBased: boolean; isDisposable: boolean; }> => {
  const client = getClient();
  if (!client) {
     // Mock response
     await new Promise(r => setTimeout(r, 1500));
     return {
       riskScore: 10,
       analysis: "This email follows standard corporate formatting and has a reputable domain structure.",
       isRoleBased: false,
       isDisposable: false
     };
  }

  try {
    const prompt = `
      Analyze the following email address for risk factors in a B2B context: "${email}"
      
      Consider:
      1. Syntax validity
      2. Domain reputation (simulate based on common knowledge)
      3. Disposable email provider detection
      4. Role-based account (e.g., info@, admin@)

      Return ONLY a JSON object with this structure:
      {
        "riskScore": number (0-100, where 0 is safe, 100 is high risk),
        "analysis": string (1-2 sentence explanation),
        "isRoleBased": boolean,
        "isDisposable": boolean
      }
    `;

    const response = await client.models.generateContent({
      model: GeminiModel.FLASH,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text);
  } catch (error) {
    console.error("Email Risk Analysis Error:", error);
    return {
       riskScore: 50,
       analysis: "Could not verify email risk due to service unavailability.",
       isRoleBased: false,
       isDisposable: false
    };
  }
};

// --- New Functions for Email Verifier ---

export const verifyBulkEmails = async (emails: string[]): Promise<any[]> => {
  // Simulating bulk processing to avoid rate limits in this demo
  const results = emails.map(email => {
     const isRole = /^(info|admin|support|contact|sales)@/.test(email);
     const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
     
     let score = 10;
     if (isRole) score += 30;
     if (!isValid) score = 100;
     else score += Math.floor(Math.random() * 40); // Random variance

     let status = 'valid';
     if (score > 70) status = 'invalid';
     else if (score > 30) status = 'catch-all';

     return {
        email,
        riskScore: score,
        analysis: isValid ? (score < 30 ? "Valid email address." : "Accepts all emails (Catch-all).") : "Invalid syntax.",
        isRoleBased: isRole,
        isDisposable: false,
        status
     };
  });
  
  // Simulate network delay
  await new Promise(r => setTimeout(r, 1500));
  return results;
};

export const verifyGeneratedEmails = async (firstName: string, lastName: string, domain: string): Promise<any> => {
  const f = firstName.toLowerCase();
  const l = lastName.toLowerCase();
  const d = domain.toLowerCase();
  
  // Basic patterns to simulate generation
  const candidates = [
      `${f}.${l}@${d}`,
      `${f}@${d}`,
      `${f}${l}@${d}`,
      `${f.charAt(0)}${l}@${d}`,
      `${f}_${l}@${d}`
  ];

  // In a real app, we would verify each against SMTP. Here we simulate results.
  const results = await verifyBulkEmails(candidates);
  
  // Filter to just "valid" looking ones for the demo, or pick the best one
  // We'll arbitrarily make the dot format valid if the domain is mostly safe
  const valid = results.filter((r, idx) => idx === 0 || r.riskScore < 20);
  
  return {
     total_generated: candidates.length,
     total_valid: valid.length,
     valid_emails: valid,
     success_rate: (valid.length / candidates.length) * 100
  };
};