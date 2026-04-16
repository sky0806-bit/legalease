"use client";
import { useState } from "react";
import Results from "./Results.js";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyze() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e:any) {
      setError(e.message);
    }
    setLoading(false);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui, sans-serif" }}>
      
      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "16px 24px", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: 32, height: 32, background: "#2563eb", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "white", fontSize: 16 }}>⚖</span>
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a" }}>LegalEase</h1>
          <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>AI-powered legal document analyzer</p>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>
            Understand any legal document
          </h2>
          <p style={{ color: "#64748b", fontSize: 15, margin: 0 }}>
            Paste a contract, NDA, lease or agreement — get plain English in seconds
          </p>
        </div>

        {/* Input card */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #e2e8f0", padding: 24, marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>
            Paste your document
          </label>
          <textarea
            style={{ width: "100%", height: 180, border: "1px solid #e2e8f0", borderRadius: 10, padding: 14, fontSize: 13, color: "#374151", resize: "vertical", outline: "none", boxSizing: "border-box", lineHeight: 1.6 }}
            placeholder="Paste your contract, NDA, lease, employment agreement, or any legal text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>{text.length} characters</span>
            <button
              onClick={analyze}
              disabled={!text || loading}
              style={{
                background: loading ? "#93c5fd" : "#2563eb",
                color: "white",
                border: "none",
                borderRadius: 10,
                padding: "10px 24px",
                fontSize: 14,
                fontWeight: 600,
                cursor: text && !loading ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
            >
              {loading ? "Analyzing..." : "Analyze document →"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", color: "#dc2626", fontSize: 13, marginBottom: 16 }}>
            Error: {error}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚖️</div>
            <p style={{ color: "#64748b", fontSize: 14 }}>Reading your document...</p>
          </div>
        )}

        {result && <Results data={result} />}
      </div>
    </main>
  );
}