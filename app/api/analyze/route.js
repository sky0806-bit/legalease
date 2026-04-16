import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const { text } = await req.json();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a legal document analyst. Return ONLY raw JSON, no markdown, no backticks, no explanation. Just the JSON object like this:
{
  "doc_type": "type of document",
  "plain_summary": "2 sentence plain English summary",
  "risk_level": "Low or Medium or High",
  "clauses": [
    {
      "title": "clause name",
      "plain": "plain English meaning",
      "risk": "Low or Medium or High",
      "flag": "why the user should care"
    }
  ],
  "negotiate": [
    { "clause": "clause name", "suggestion": "what to ask for" }
  ]
}`
        },
        {
          role: "user",
          content: `Analyze this legal document:\n\n${text}`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const raw = completion.choices[0].message.content.replace(/```json|```/g, "").trim();
    const data = JSON.parse(raw);
    return Response.json(data);

  } catch (err) {
    console.error("API ERROR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}