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
      model: "gemini-2.0-flash",
      systemInstruction: `You are LifeStream AI, a helpful blood donation management assistant for a blood bank platform. 
Your role is to:
1. Help users register as blood donors
2. Provide information about blood donation eligibility
3. Answer frequently asked questions about blood donation
4. Help users find nearby blood banks
5. Guide emergency blood requests
6. Provide donation reminders and health information

Always be friendly, professional, and provide accurate health and donation information.
If users ask about medical conditions or emergency situations, advise them to consult with medical professionals.
Keep responses concise and helpful.`
    });

    // Build chat history for the conversation
    const history = (conversationHistory || []).map((msg: any) => ({
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
