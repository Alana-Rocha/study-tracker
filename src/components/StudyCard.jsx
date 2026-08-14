import { ChevronRight, Trash2 } from "lucide-react";
import { daysUntil, subjectsProgress } from "../utils.js";

export function StudyCard({ study, onOpen, onDelete }) {
  const { percent } = subjectsProgress(study.subjects);
  const days = study.examDate ? daysUntil(new Date(study.examDate)) : null;

  return (
    <div
      onClick={onOpen}
      style={{
        background: "#12292C",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.06)",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        cursor: "pointer",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 20,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 0.3,
          }}
        >
          {study.name}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
          <div style={{ width: 140, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: `${percent}%`, height: "100%", background: "#F2A93B", transition: "width 0.3s ease" }} />
          </div>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#8FA6A8" }}>{percent}%</span>
          {days !== null && <span style={{ fontSize: 12, color: "#8FA6A8" }}>· {days}d restantes</span>}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 6, opacity: 0.5 }}
          aria-label="Excluir estudo"
        >
          <Trash2 size={16} color="#D9643A" />
        </button>
        <ChevronRight size={20} color="#8FA6A8" />
      </div>
    </div>
  );
}
