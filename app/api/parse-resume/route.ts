import { NextRequest, NextResponse } from "next/server";
import { parserModel } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { resumeText } = await req.json();

    const prompt = `
      Extract candidate details from this resume text. 
      Return ONLY a JSON object: 
      {
        "name": "Full Name",
        "role": "Title",
        "skills": ["Skill1", "Skill2"],
        "experience": "Years",
        "bio": "Short summary"
      }
      
      Resume: ${resumeText.substring(0, 4000)}
    `;

    const response = await parserModel.invoke(prompt);
    let content = (response.content as string).replace(/```json|```/g, "").trim();
    return NextResponse.json(JSON.parse(content));
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to parse text" }, { status: 500 });
  }
}