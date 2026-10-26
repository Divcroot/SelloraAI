import { llm } from "../config/llm.js";
import { AppError } from "../error/AppError.js";
import { AIAnalytics, AnalyticsData } from "../types/ai.types.js";

const prmopt = (data: AnalyticsData) => `
You are an AI analytics assistant for SelloraAI.

Analyze the partner's digital product business
using ONLY the data provided below.

Rules:
- All monetary values are in Indian Rupees (INR); always use the ₹ symbol and never use $ or USD.
- Never invent data.
- Never change numerical values.
- Do not mention customer information.
- Give concise and actionable insights.
- Focus on sales, revenue, products and growth.
- Return ONLY valid JSON.

Required JSON format:

{
  "summary": "short overall performance summary",

  "insights": [
    {
      "type": "positive | warning | neutral",
      "title": "short title",
      "description": "short explanation"
    }
  ],

  "recommendations": [
    "recommendation 1",
    "recommendation 2",
    "recommendation 3"
  ],

  "topProduct": {
    "title": "product title",
    "reason": "why this product performs well"
  },

  "growthOpportunity": "main growth opportunity"
}

PARTNER:
${JSON.stringify(data.partner)}

SUMMARY:
${JSON.stringify(data.summary)}

PRODUCTS:
${JSON.stringify(data.products)}

ORDERS:
${JSON.stringify(data.orders)}
`;

export const aiAgent = async (data: AnalyticsData): Promise<AIAnalytics> => {
    let response;
    try {
        response = await llm.invoke(prmopt(data));
    } catch (error) {
        throw new AppError("AI service failed to generate a response", 502);
    }

    if (typeof response.content !== "string") {
        throw new AppError("Invalid AI response", 502);
    }

    const json = response.content
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    let parsed: AIAnalytics;

    try {
        parsed = JSON.parse(json) as AIAnalytics;
    } catch {
        throw new AppError("AI returned invalid JSON", 502);
    }

    if (
        !parsed ||
        typeof parsed !== "object" ||
        typeof parsed.summary !== "string" ||
        !Array.isArray(parsed.insights) ||
        !Array.isArray(parsed.recommendations) ||
        typeof parsed.topProduct !== "object" ||
        parsed.topProduct === null ||
        typeof parsed.topProduct.title !== "string" ||
        typeof parsed.topProduct.reason !== "string" ||
        typeof parsed.growthOpportunity !== "string"
    ) {
        throw new AppError("AI response does not match the expected format", 502);
    }

    return parsed;
}