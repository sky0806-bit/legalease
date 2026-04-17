const riskConfig = {
  High:   { bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.3)",   color: "#fca5a5", dot: "#ef4444", bar: "#ef4444", score: 90 },
  Medium: { bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.3)",  color: "#fcd34d", dot: "#f59e0b", bar: "#f59e0b", score: 55 },
  Low:    { bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.3)",   color: "#86efac", dot: "#22c55e", bar: "#22c55e", score: 20 },
};

function Badge({ level }) {
  const c = riskConfig[level] || riskConfig.Medium;
  return (
    <span style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, display: "inline-block" }} />
      {level} risk
    </span>
  );
}

function RiskMeter({ level }) {
  const c = riskConfig[level] || riskConfig.Medium;
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: "#64748b" }}>Overall document risk</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: c.color }}>{level}</span>
      </div>
      <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4 }}>
        <div style={{ height: 8, width: `${c.score}%`, background: c.bar, borderRadius: 4, transition: "width 1.5s ease", boxShadow: `0 0 12px ${c.bar}` }} />
      </div>
    </div>
  );
}

export default function Results({ data }) {
  const highCount = data.clauses?.filter(c => c.risk === "High").length || 0;
  const medCount = data.clauses?.filter(c => c.risk === "Medium").length || 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}>

      {/* Summary card */}
      <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Document type</div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "white" }}>{data.doc_type}</h2>
          </div>
          <Badge level={data.risk_level} />
        </div>
        <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7, margin: "0 0 16px" }}>{data.plain_summary}</p>

        {/* Quick stats */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "8px 14px", fontSize: 13, color: "#fca5a5" }}>
            🔴 {highCount} high risk clause{highCount !== 1 ? "s" : ""}
          </div>
          <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 10, padding: "8px 14px", fontSize: 13, color: "#fcd34d" }}>
            🟡 {medCount} medium risk clause{medCount !== 1 ? "s" : ""}
          </div>
        </div>

        <RiskMeter level={data.risk_level} />
      </div>

      {/* Clauses */}
      <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1.5, padding: "8px 0" }}>
        Key clauses — {data.clauses?.length || 0} found
      </div>

      {data.clauses?.map((c, i) => {
        const rc = riskConfig[c.risk] || riskConfig.Medium;
        return (
          <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${rc.border}`, borderRadius: 16, padding: 20, borderLeft: `3px solid ${rc.dot}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: "white" }}>{c.title}</span>
              <Badge level={c.risk} />
            </div>
            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, margin: "0 0 12px" }}>{c.plain}</p>
            <div style={{ background: rc.bg, border: `1px solid ${rc.border}`, borderRadius: 8, padding: "8px 14px", fontSize: 13, color: rc.color }}>
              ⚠ {c.flag}
            </div>
          </div>
        );
      })}

      {/* Negotiate */}
      {data.negotiate?.length > 0 && (
        <div style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 20, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 32, height: 32, background: "rgba(99,102,241,0.2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>💬</div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "white" }}>What to negotiate</h3>
              <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>Use these to push back before signing</p>
            </div>
          </div>
          {data.negotiate.map((n, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 12, padding: "14px 18px", marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#a5b4fc", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{n.clause}</div>
              <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.5 }}>{n.suggestion}</div>
            </div>
          ))}
        </div>
      )}

      {/* Footer note */}
      <div style={{ textAlign: "center", padding: "16px 0", fontSize: 12, color: "#334155" }}>
        LegalEase is an AI comprehension tool. Always consult a qualified lawyer for legal advice.
      </div>

    </div>
  );
}