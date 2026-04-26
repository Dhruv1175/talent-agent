import { NextRequest, NextResponse } from "next/server";
import { parserModel } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { jdText } = await req.json();

    if (!jdText) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const prompt = `
      Extract key info from this Job Description text. 
      Return ONLY a valid JSON object with these keys: 
      "requiredSkills" (array of strings), "experienceLevel" (string), "role" (string).
      
      JD Text: ${jdText.substring(0, 5000)}
    `;

    const response = await parserModel.invoke(prompt);
    let content = (response.content as string).replace(/```json|```/g, "").trim();
    
    return NextResponse.json(JSON.parse(content));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}