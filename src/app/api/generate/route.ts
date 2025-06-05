// src/app/api/generate/route.ts

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { idea } = await req.json();

    const prompt = `당신은 뛰어난 마케터입니다. 다음 아이디어를 바탕으로 제품 정보를 작성하세요:\n
- 제품 이름:
- 제품 설명:
- 주요 타겟 고객:
- 마케팅 슬로건:

아이디어: "${idea}"`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const output = completion.choices[0].message.content || "";
    const lines = output.split("\n").filter(Boolean);

    const result = {
      name: lines.find((l) => l.includes("제품 이름"))?.split(":")[1]?.trim() || "",
      description: lines.find((l) => l.includes("제품 설명"))?.split(":")[1]?.trim() || "",
      target: lines.find((l) => l.includes("타겟"))?.split(":")[1]?.trim() || "",
      slogan: lines.find((l) => l.includes("슬로건"))?.split(":")[1]?.trim() || "",
    };

    return NextResponse.json(result);
  } catch (e) {
    console.error("❌ API Error:", e);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
