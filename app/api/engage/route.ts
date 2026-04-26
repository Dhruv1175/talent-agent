import { NextResponse } from "next/server";
import { engagementModel } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { candidate, jd } = await req.json();
    if (!candidate || !jd) {
      return NextResponse.json({ error: "Missing candidate or jd data" }, { status: 400 });
    }

    const prompt = `
      You are an AI Talent Agent.
      Candidate: ${candidate.name}
      Role: ${jd.role}

      Task:
      1. Generate a brief 3-message chat simulation.
      2. Provide an interest score (0-100).
      3. Provide a 1-sentence explanation.

      BE HONEST: If they are a Backend dev applying for a Frontend role, mention the gap.
      Return ONLY a raw JSON object. Do not include markdown formatting.
      Format: {"chatLog": [...], "interestScore": 85, "explanation": "..."}
    `;

    const response = await engagementModel.invoke(prompt);
    let content = response.content as string;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      content = jsonMatch[0];
    }

    const parsedData = JSON.parse(content);
    return NextResponse.json(parsedData);
    
  } catch (error: any) {
    console.error("ENGAGE_API_ERROR:", error);
    return NextResponse.json({ 
      error: "Failed to parse agent response", 
      details: error.message 
    }, { status: 500 });
  }
}