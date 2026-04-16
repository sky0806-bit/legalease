const riskStyle = {
  Low:    { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0" },
  Medium: { bg: "#fffbeb", color: "#92400e", border: "#fde68a" },
  High:   { bg: "#fef2f2", color: "#991b1b", border: "#fecaca" },
};

function Badge({ level }) {
  const s = riskStyle[level] || riskStyle.Medium;
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>
      {level} risk
    </span>
  );
}

function ScoreMeter({ level }) {
  const score = level === "Low" ? 25 : level === "Medium" ? 60 : 90;
  const color = level === "Low" ? "#22c55e" : level === "Medium" ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: "#64748b" }}>Overall risk</span>
        <span style={{ fontSize: 12, fontWeight: 600, color }}>{level}</span>
      </div>
      <div style={{ height: 6, background: "#e2e8f0", borderRadius: 3 }}>
        <div style={{ height: 6, width: `${score}%`, background: color, borderRadius: 3, transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

export default function Results({ data }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Summary card */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #e2e8f0", padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#6366f1", textTransform: "uppercase", letterSpacing: 1 }}>Document type</span>
            <h3 style={{ margin: "4px 0 0", fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{data.doc_type}</h3>
          </div>
          <Badge level={data.risk_level} />
        </div>
        <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.7, margin: "0 0 12px" }}>{data.plain_summary}</p>
        <ScoreMeter level={data.risk_level} />
      </div>

      {/* Clauses */}
      <h3 style={{ margin: "8px 0 4px", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Key clauses</h3>
      {data.clauses.map((c, i) => (
        <div key={i} style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>{c.title}</span>
            <Badge level={c.risk} />
          </div>
          <p style={{ color: "#475569", fontSize: 13, lineHeight: 1.6, margin: "0 0 10px" }}>{c.plain}</p>
          <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#92400e" }}>
            ⚠ {c.flag}
          </div>
        </div>
      ))}

      {/* Negotiate */}
      {data.negotiate?.length > 0 && (
        <div style={{ background: "#eff6ff", border: "2px solid #bfdbfe", borderRadius: 16, padding: 24 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#1e40af" }}>
            What to negotiate
          </h3>
          {data.negotiate.map((n, i) => (
            <div key={i} style={{ background: "white", borderRadius: 10, padding: "12px 16px", marginBottom: 10, border: "1px solid #bfdbfe" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#2563eb" }}>{n.clause}</span>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "#1e40af" }}>{n.suggestion}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}