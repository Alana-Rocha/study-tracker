import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { TopicRow } from "./TopicRow.jsx";

export function SubjectCard({ subject, defaultOpen, onToggleTopic, onDeleteTopic, onAddTopic, onDeleteSubject }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [newTopicText, setNewTopicText] = useState("");

  const done = subject.topics.filter((t) => t.done).length;
  const total = subject.topics.length || 1;
  const pct = Math.round((done / total) * 100);

  const handleAdd = () => {
    onAddTopic(newTopicText);
    setNewTopicText("");
  };

  return (
    <div
      style={{
        background: "#12292C",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <button
          className="btn-flat"
          onClick={() => setIsOpen((v) => !v)}
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#ECE8DE",
            textAlign: "left",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {isOpen ? <ChevronDown size={18} color="#8FA6A8" /> : <ChevronRight size={18} color="#8FA6A8" />}
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>
              {subject.name}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 120, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: subject.color, transition: "width 0.3s ease" }} />
            </div>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "#8FA6A8", minWidth: 44, textAlign: "right" }}>
              {done}/{subject.topics.length}
            </span>
          </div>
        </button>
        {onDeleteSubject && (
          <button
            onClick={onDeleteSubject}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "0 16px", opacity: 0.5 }}
            aria-label="Excluir matéria"
          >
            <Trash2 size={16} color="#D9643A" />
          </button>
        )}
      </div>

      {isOpen && (
        <div style={{ padding: "0 12px 14px" }}>
          {subject.topics.map((topic) => (
            <TopicRow
              key={topic.id}
              topic={topic}
              onToggle={() => onToggleTopic(topic.id)}
              onDelete={() => onDeleteTopic(topic.id)}
            />
          ))}

          <div style={{ display: "flex", gap: 8, marginTop: 8, padding: "0 8px" }}>
            <input
              type="text"
              value={newTopicText}
              onChange={(e) => setNewTopicText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Adicionar tópico de estudo..."
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                padding: "8px 12px",
                color: "#ECE8DE",
                fontSize: 13.5,
              }}
            />
            <button
              className="btn-flat"
              onClick={handleAdd}
              style={{
                background: subject.color,
                border: "none",
                borderRadius: 8,
                padding: "0 14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
              aria-label="Adicionar"
            >
              <Plus size={16} color="#0B1D1F" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
