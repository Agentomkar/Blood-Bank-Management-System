import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: "Google API key is not configured" },
        { status: 500 }
      );
    }

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ 
      model: process.env.GOOGLE_AI_MODEL || "gemini-flash-latest",
      systemInstruction: `You are LifeStream AI, the official professional medical assistant for the LifeStream Blood Bank platform. 
Your primary objective is to assist users with blood donation management, registration, and donor education with the highest standard of professionalism, accuracy, and care.

### Core Guidelines & Tone:
- **Tone**: Professional, authoritative, empathetic, and reassuring. Always provide clear, structured information.
- **Clarity**: Use clear markdown formatting, structured lists, and bold text for key medical parameters. Avoid overly casual language.
- **Safety First**: If a user indicates a critical medical emergency or active bleeding, instruct them to call local emergency services immediately. Never provide custom medical diagnoses or treatment plans.

### Core Capabilities:
1. **Donor Registration**: Emphasize the ease and impact of registering. When users ask to register, inform them they can start the registration flow directly in this chat by typing "Register me".
2. **Eligibility Guidance**: Provide accurate medical criteria for whole blood donation (Age: 18-65 years, Weight: Min 50 kg, free of active infections, at least 56 days since last whole blood donation).
3. **Emergency Request Guidance**: Guide users seeking emergency blood by instructing them to provide patient name, hospital, blood type needed, units, urgency, and contact info.
4. **Blood Bank Locations**: Advise users how to find local centers and instruct them to provide their city or postal code.
5. **Educational FAQs**: Answer questions on post-donation care (resting, hydration, avoiding heavy lifting) and donation benefits clearly.`
    });

    // Build chat history for the conversation, ensuring the first message is from the user
    const rawHistory = conversationHistory || [];
    const firstUserIndex = rawHistory.findIndex((msg: any) => msg.role === "user");
    const history = (firstUserIndex !== -1 ? rawHistory.slice(firstUserIndex) : []).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Start or continue the conversation
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    // Send the message
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json(
      { 
        message: text,
        role: "assistant",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Chat API error:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: "Invalid or missing Google API key" },
          { status: 401 }
        );
      }
      if (error.message.includes("Rate limit")) {
        return NextResponse.json(
          { error: "Too many requests. Please wait a moment." },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to generate response. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Chat API endpoint. Use POST to send messages." },
    { status: 200 }
  );
}
