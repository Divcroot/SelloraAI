import { ChatGroq } from "@langchain/groq";
import 'dotenv/config';

export const llm = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0.3,
    maxRetries: 2,
})