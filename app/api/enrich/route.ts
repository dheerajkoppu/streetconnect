import { NextRequest, NextResponse } from "next/server";
import { Service } from "@/types";

interface EnrichmentRequest {
  service: Service;
  cityName: string;
  stateName: string;
}

interface EnrichedDetails {
  descriptionLong: string;
  eligibilityDetails: string;
  notes: string[];
  tips: string[];
}

/**
 * API endpoint to enrich OSM service data with AI-generated details
 * Uses GPT to provide helpful context about services based on their type and location
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as EnrichmentRequest;
    const { service, cityName, stateName } = body;

    if (!service) {
      return NextResponse.json(
        { error: "Service data is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // Return basic enrichment if no API key
      return NextResponse.json({
        enrichment: getBasicEnrichment(service),
      });
    }

    const prompt = buildEnrichmentPrompt(service, cityName, stateName);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 800,
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant that provides information about social services for people experiencing homelessness.

Your responses should be:
- Compassionate and non-judgmental
- Practical and actionable
- Accurate based on typical services of this type
- Formatted as JSON

Always respond with valid JSON in this exact format:
{
  "descriptionLong": "A 2-3 sentence description of what this type of service typically offers",
  "eligibilityDetails": "Brief explanation of typical eligibility requirements for this type of service",
  "notes": ["Helpful note 1", "Helpful note 2"],
  "tips": ["Practical tip 1", "Practical tip 2"]
}`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API error for enrichment");
      return NextResponse.json({
        enrichment: getBasicEnrichment(service),
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({
        enrichment: getBasicEnrichment(service),
      });
    }

    try {
      // Try to parse the JSON response
      const enrichment = JSON.parse(content) as EnrichedDetails;
      return NextResponse.json({ enrichment });
    } catch {
      // If JSON parsing fails, return basic enrichment
      return NextResponse.json({
        enrichment: getBasicEnrichment(service),
      });
    }
  } catch (error) {
    console.error("Enrichment API error:", error);
    return NextResponse.json(
      { error: "Failed to enrich service data" },
      { status: 500 }
    );
  }
}

function buildEnrichmentPrompt(
  service: Service,
  cityName: string,
  stateName: string
): string {
  const categories = service.categories.join(", ");
  const address = service.address.city || cityName;

  return `Please provide helpful information about this social service:

Service Name: ${service.name}
Type: ${categories}
Location: ${address}, ${stateName || "USA"}
Current Description: ${service.descriptionShort || "Not available"}
${service.phone ? `Phone: ${service.phone}` : ""}
${service.website ? `Website: ${service.website}` : ""}

Based on this service type and location, provide:
1. A helpful description of what services like this typically offer
2. Typical eligibility requirements for this type of service
3. 2-3 helpful notes about what to expect
4. 2-3 practical tips for someone visiting this type of service

Focus on being helpful for someone who might be experiencing homelessness or housing insecurity.`;
}

function getBasicEnrichment(service: Service): EnrichedDetails {
  const categoryDescriptions: Record<string, string> = {
    shelter:
      "This shelter provides temporary housing and support for individuals in need. They typically offer a safe place to sleep, access to basic amenities, and connections to additional resources.",
    food:
      "This food service helps provide meals and groceries to those in need. They may offer hot meals, food pantry items, or both depending on availability.",
    medical:
      "This medical facility offers healthcare services. They may provide basic medical care, health screenings, and referrals to specialists as needed.",
    mental_health:
      "This service provides mental health support and counseling. They offer a safe space to talk and may help connect you with ongoing care.",
    day_center:
      "This day center offers daytime services including rest areas, resources, and support. They may provide access to showers, laundry, and case management.",
    showers:
      "This facility provides access to shower and hygiene facilities. Having access to showers helps maintain health and dignity.",
    laundry:
      "This service offers laundry facilities to help keep your clothes clean. Clean clothes are important for health and for accessing other services.",
    id_legal:
      "This service provides legal aid and help with identification documents. Having proper ID is essential for accessing many services.",
    other:
      "This community service offers support and resources. Contact them directly to learn more about what they provide.",
  };

  const categoryTips: Record<string, string[]> = {
    shelter: [
      "Call ahead to check availability if possible",
      "Arrive early as beds fill up quickly",
      "Ask about their check-in times and rules",
    ],
    food: [
      "Check their serving times before visiting",
      "Some locations may have dietary restrictions available",
      "Ask about take-away options if available",
    ],
    medical: [
      "Bring any medications you're currently taking",
      "Write down your symptoms before your visit",
      "Ask about follow-up care options",
    ],
    day_center: [
      "Ask about all available services when you arrive",
      "They may be able to help with mail and phone access",
      "Case managers can help connect you to additional resources",
    ],
  };

  const mainCategory = service.categories[0] || "other";

  return {
    descriptionLong:
      categoryDescriptions[mainCategory] || categoryDescriptions.other,
    eligibilityDetails:
      "Contact this service directly to confirm current eligibility requirements, as these may vary.",
    notes: [
      "Information may change - it's always good to call ahead",
      "Staff can often help connect you to other resources in the area",
    ],
    tips: categoryTips[mainCategory] || [
      "Call ahead to confirm hours and services",
      "Ask about any other resources they might offer",
    ],
  };
}
