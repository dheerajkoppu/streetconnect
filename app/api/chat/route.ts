import { NextRequest, NextResponse } from "next/server";
import { ChatContext, ChatMessage, Service } from "@/types";

// Emergency keywords to detect
const EMERGENCY_KEYWORDS = [
  "in danger",
  "hurt myself",
  "kill myself",
  "suicide",
  "suicidal",
  "self harm",
  "self-harm",
  "someone is hurting me",
  "being abused",
  "domestic violence",
  "overdose",
  "dying",
  "emergency",
  "life threatening",
  "immediate danger",
];

// Fixed emergency response
const EMERGENCY_RESPONSE = `I'm only a digital guide and I can't handle emergencies.

**If you are in immediate danger, please:**
- Call your local emergency number (like **911** in the United States)
- Go to the nearest emergency room if you can
- Text HOME to 741741 for the Crisis Text Line

I can still help you find non-emergency services in this app when you're ready.`;

// Topics requiring professional advice
const ADVICE_KEYWORDS = {
  medical: ["diagnosis", "prescribe", "medication", "symptoms", "treatment", "medical advice", "should i take"],
  legal: ["lawsuit", "legal advice", "sue", "court case", "immigration status", "visa", "deportation", "asylum"],
  immigration: ["immigration", "undocumented", "green card", "citizenship", "ice", "daca"],
};

function detectEmergency(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return EMERGENCY_KEYWORDS.some((keyword) => lowerMessage.includes(keyword));
}

function detectAdviceRequest(message: string): { type: string; detected: boolean } {
  const lowerMessage = message.toLowerCase();

  for (const [type, keywords] of Object.entries(ADVICE_KEYWORDS)) {
    if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
      return { type, detected: true };
    }
  }

  return { type: "", detected: false };
}

function getAdviceRedirectMessage(type: string): string {
  const redirects: Record<string, string> = {
    medical: `I can't give medical advice - that's something only a doctor or nurse can do safely.

However, I can help you find **medical clinics** and **health services** in this app. Many offer free or low-cost care.

Would you like me to suggest some medical services from the list?`,
    legal: `I can't provide legal advice - you'd need to speak with a lawyer for that.

I can help you find **legal aid services** and organizations that offer free or low-cost legal help.

Would you like me to suggest some legal services from the list?`,
    immigration: `I can't give immigration advice - that requires a qualified immigration attorney.

I can help you find **legal aid organizations** that specialize in immigration support.

Would you like me to suggest some services that might help?`,
  };

  return redirects[type] || "I can't give professional advice on that topic, but I might be able to help you find relevant services.";
}

function formatServiceForContext(service: Service): string {
  const parts = [
    `**${service.name}**`,
    `- Categories: ${service.categories.join(", ")}`,
    `- Address: ${service.address.street}, ${service.address.city}`,
    `- Description: ${service.descriptionShort}`,
  ];

  if (service.phone) {
    parts.push(`- Phone: ${service.phone}`);
  }

  if (service.eligibility.description) {
    parts.push(`- Eligibility: ${service.eligibility.description}`);
  }

  if (service.eligibility.requiresSobriety) {
    parts.push(`- Note: Requires sobriety at check-in`);
  }

  if (service.eligibility.requiresID === false || service.flags.noIDRequired) {
    parts.push(`- No ID required`);
  }

  if (service.accessibility.petsAllowed) {
    parts.push(`- Pets allowed`);
  }

  if (service.notes.length > 0) {
    parts.push(`- What to know: ${service.notes.join("; ")}`);
  }

  return parts.join("\n");
}

function buildSystemPrompt(context: ChatContext): string {
  const servicesContext = context.visibleServices
    .slice(0, 15) // Limit to prevent token overflow
    .map(formatServiceForContext)
    .join("\n\n");

  const selectedServiceContext = context.selectedService
    ? `\n\n## Currently Viewing Service:\n${formatServiceForContext(context.selectedService)}`
    : "";

  const filtersContext = [];
  if (context.filters.openNow) filtersContext.push("Open now");
  if (context.filters.petsAllowed) filtersContext.push("Pets allowed");
  if (context.filters.wheelchairAccessible) filtersContext.push("Wheelchair accessible");
  if (context.filters.noIDRequired) filtersContext.push("No ID required");

  return `You are "StreetConnect Guide," a focused helper for people facing homelessness or housing insecurity in ${context.cityName}, ${context.regionName}.

## Your Role
You are NOT a general chatbot. You are a specialized guide that helps users:
1. Find services that fit their specific situation
2. Understand rules and requirements in simple language
3. Break down information into small, doable steps
4. Help outreach workers prepare information for clients

## Your Knowledge
You only know about the services listed below, plus general common-sense knowledge. Do not make up services or information not provided.

## Current Context
- Location: ${context.cityName}, ${context.regionName}
- Active filters: ${filtersContext.length > 0 ? filtersContext.join(", ") : "None"}
- Category filter: ${context.selectedCategory || "All categories"}
${selectedServiceContext}

## Available Services:
${servicesContext || "No services currently match the filters."}

## Communication Style
- Use short sentences and paragraphs
- Use bullet points where helpful
- Be respectful and non-judgmental
- Never blame or shame the user
- If something might vary or change, say "You can call or visit to confirm" or "It's worth checking when you arrive"

## What You Can Do
1. Suggest which services from the list might be most relevant
2. Explain eligibility, hours, and rules using the service data
3. Help compare options (e.g., "Compare these two shelters")
4. Draft short, clear messages (SMS-style) summarizing a service
5. Break down steps into simple action plans

## What You Cannot Do
1. Handle emergencies - if someone mentions danger, self-harm, or crisis, respond with the fixed emergency message only
2. Give medical advice - redirect to medical services
3. Give legal advice - redirect to legal aid services
4. Give immigration advice - redirect to immigration support services

## Example Interactions
User: "I need food and a shower, I don't have ID"
You: Look for services that offer food AND showers, flag any that don't require ID

User: "What does 'sober at check-in' mean?"
You: Explain in simple terms without judgment

User: "Give me a plan for today: food, shower, charge my phone"
You: Create a simple numbered list with specific services and their addresses

User: "Write a text message about this shelter for my client"
You: Draft a brief, clear SMS with name, address, check-in time, and key rules

Remember: Always encourage users to verify information directly with services, as details can change.`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, context } = body as {
      messages: ChatMessage[];
      context: ChatContext;
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage.role !== "user") {
      return NextResponse.json(
        { error: "Last message must be from user" },
        { status: 400 }
      );
    }

    // Check for emergency
    if (detectEmergency(lastUserMessage.content)) {
      return NextResponse.json({
        message: {
          id: crypto.randomUUID(),
          role: "assistant",
          content: EMERGENCY_RESPONSE,
          timestamp: Date.now(),
        },
      });
    }

    // Check for advice requests
    const adviceCheck = detectAdviceRequest(lastUserMessage.content);
    if (adviceCheck.detected) {
      return NextResponse.json({
        message: {
          id: crypto.randomUUID(),
          role: "assistant",
          content: getAdviceRedirectMessage(adviceCheck.type),
          timestamp: Date.now(),
        },
      });
    }

    // Build messages for OpenAI
    const systemPrompt = buildSystemPrompt(context);

    const openaiMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    ];

    // Call OpenAI API
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured. Please set OPENAI_API_KEY environment variable." },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-5-nano",
        max_tokens: 1024,
        messages: openaiMessages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI API error:", errorData);
      return NextResponse.json(
        { error: "Failed to get response from AI" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";

    return NextResponse.json({
      message: {
        id: crypto.randomUUID(),
        role: "assistant",
        content: assistantMessage,
        timestamp: Date.now(),
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
