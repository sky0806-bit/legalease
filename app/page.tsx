"use client";
import { useState, useRef } from "react";
import Results from "./Results.js";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  async function handleFile(file) {
    if (!file || file.type !== "application/pdf") {
      setError("Please upload a PDF file only");
      return;
    }
    setFileName(file.name);
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  }

  async function analyze() {
    setLoading(true);
    setError("");
    setResult(null);
    setFileName("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  }

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Navbar */}
      <nav style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", backdropFilter: "blur(10px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #6366f1, #2563eb)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚖</div>
          <div>
            <div style={{ color: "white", fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px" }}>LegalEase</div>
            <div style={{ color: "#64748b", fontSize: 11 }}>AI Legal Analyzer</div>
          </div>
        </div>
        <div style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 20, padding: "6px 14px", fontSize: 12, color: "#a5b4fc" }}>
          Free • No signup needed
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 20px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-block", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 20, padding: "6px 16px", fontSize: 12, color: "#a5b4fc", marginBottom: 20 }}>
            Powered by LLaMA 3.3 70B AI
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 900, color: "white", margin: "0 0 16px", lineHeight: 1.1, letterSpacing: "-1px" }}>
            Never sign a contract<br />
            <span style={{ background: "linear-gradient(135deg, #6366f1, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>blind again</span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 17, margin: 0, lineHeight: 1.6 }}>
            Paste any legal document or upload a PDF.<br />Get plain English, risk scores and negotiation tips instantly.
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 32 }}>
          {[["⚡", "5 seconds", "Average analysis time"], ["🔒", "100% Private", "Nothing is stored"], ["💰", "Free forever", "No credit card"]].map(([icon, title, sub]) => (
            <div key={title} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 14 }}>{title}</div>
              <div style={{ color: "#64748b", fontSize: 12 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Main card */}
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 28, marginBottom: 20, backdropFilter: "blur(10px)" }}>

          {/* PDF Drop Zone */}
          <div
            onClick={() => fileRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
            style={{
              border: `2px dashed ${dragOver ? "#6366f1" : "rgba(99,102,241,0.4)"}`,
              borderRadius: 14,
              padding: "24px",
              textAlign: "center",
              cursor: "pointer",
              marginBottom: 20,
              background: dragOver ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.05)",
              transition: "all 0.2s"
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>{fileName ? "✅" : "📄"}</div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: fileName ? "#4ade80" : "#a5b4fc" }}>
              {fileName ? fileName : "Drop PDF here or click to upload"}
            </p>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b" }}>Supports any legal PDF document</p>
            <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
            <span style={{ color: "#475569", fontSize: 13 }}>or paste text</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
          </div>

          <textarea
            style={{ width: "100%", height: 160, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 16, fontSize: 13, color: "#e2e8f0", resize: "vertical", outline: "none", boxSizing: "border-box", lineHeight: 1.7, fontFamily: "inherit" }}
            placeholder="Paste your contract, NDA, lease, employment agreement, or any legal text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
            <span style={{ fontSize: 12, color: "#475569" }}>{text.length > 0 ? `${text.length} characters` : "No text yet"}</span>
            <button
              onClick={analyze}
              disabled={!text || loading}
              style={{
                background: !text || loading ? "rgba(99,102,241,0.3)" : "linear-gradient(135deg, #6366f1, #2563eb)",
                color: "white",
                border: "none",
                borderRadius: 12,
                padding: "12px 28px",
                fontSize: 15,
                fontWeight: 700,
                cursor: text && !loading ? "pointer" : "not-allowed",
                letterSpacing: "-0.3px",
              }}
            >
              {loading ? "Analyzing..." : "Analyze document →"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, padding: "14px 18px", color: "#fca5a5", fontSize: 13, marginBottom: 16 }}>
            ⚠ {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 16, animation: "spin 2s linear infinite", display: "inline-block" }}>⚖️</div>
            <p style={{ color: "#94a3b8", fontSize: 15, margin: 0 }}>AI is reading your document...</p>
            <p style={{ color: "#475569", fontSize: 13, margin: "8px 0 0" }}>This takes about 5-10 seconds</p>
          </div>
        )}

        {result && <Results data={result} />}

      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        textarea::placeholder { color: #475569; }
        textarea:focus { border-color: rgba(99,102,241,0.5) !important; }
      `}</style>
    </main>
  );
}