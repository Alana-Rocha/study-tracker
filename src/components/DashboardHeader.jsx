import { Flame } from "lucide-react";
import { Gauge } from "./Gauge.jsx";

export function DashboardHeader({ title, daysLeft, examDate, overallPercent }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 20,
        alignItems: "center",
        justifyContent: "space-between",
        background: "#12292C",
        borderRadius: 12,
        padding: "20px 24px",
        border: "1px solid rgba(46,140,144,0.25)",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          {title}
        </div>
        {daysLeft !== null && (
          <div
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          >
            <Flame size={18} color="#F2A93B" />
            <span style={{ fontSize: 28, fontWeight: 600, color: "#F2A93B" }}>{daysLeft}</span>
            <span style={{ color: "#8FA6A8", fontSize: 14 }}>
              dias restantes{examDate ? ` (${examDate.toLocaleDateString("pt-BR")})` : ""}
            </span>
          </div>
        )}
      </div>
      <Gauge percent={overallPercent} />
    </div>
  );
}
