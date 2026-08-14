import { CheckCircle2, Circle, Trash2 } from "lucide-react";

export function TopicRow({ topic, onToggle, onDelete }) {
  return (
    <div
      className="topic-row"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 8px",
        borderRadius: 8,
      }}
    >
      <button
        onClick={onToggle}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
        aria-label={topic.done ? "Marcar como não concluído" : "Marcar como concluído"}
      >
        {topic.done ? <CheckCircle2 size={19} color="#6FA96C" /> : <Circle size={19} color="#8FA6A8" />}
      </button>
      <span
        style={{
          flex: 1,
          fontSize: 14.5,
          color: topic.done ? "#8FA6A8" : "#ECE8DE",
          textDecoration: topic.done ? "line-through" : "none",
        }}
      >
        {topic.text}
      </span>
      <button
        onClick={onDelete}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 4, opacity: 0.5 }}
        aria-label="Remover tópico"
      >
        <Trash2 size={15} color="#D9643A" />
      </button>
    </div>
  );
}
