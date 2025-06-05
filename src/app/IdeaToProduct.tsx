"use client";
import { useState } from "react";

type ProductResult = {
  name: string;
  description: string;
  target: string;
  slogan: string;
};

export default function IdeaToProduct() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState<ProductResult | null>(null);
  const [loading, setLoading] = useState(false);

  const generateProduct = async () => {
    setLoading(true);
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Idea to Product Generator</h1>
      <div className="w-full max-w-xl space-y-4">
        <input
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="당신의 아이디어를 입력하세요"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
        />
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          onClick={generateProduct}
          disabled={loading}
        >
          {loading ? "생성 중..." : "제품 생성"}
        </button>
      </div>

      {result && (
        <div className="mt-10 w-full max-w-2xl p-6 border border-gray-200 rounded shadow">
          <p><strong>제품 이름:</strong> {result.name}</p>
          <p><strong>설명:</strong> {result.description}</p>
          <p><strong>타겟 고객:</strong> {result.target}</p>
          <p><strong>슬로건:</strong> {result.slogan}</p>
        </div>
      )}
    </div>
  );
}
