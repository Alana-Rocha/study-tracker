import { useState } from "react";
import { Plus } from "lucide-react";
import { StudyCard } from "./components/StudyCard.jsx";

export function StudyList({ studies, onOpenStudy, onCreateStudy, onDeleteStudy }) {
  const [name, setName] = useState("");
  const [examDate, setExamDate] = useState("");

  const handleCreate = () => {
    if (!name.trim()) return;
    const isoDate = examDate ? new Date(`${examDate}T00:00:00`).toISOString() : null;
    const id = onCreateStudy(name, isoDate);
    setName("");
    setExamDate("");
    if (id) onOpenStudy(id);
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          marginBottom: 20,
        }}
      >
        Meus Estudos
      </div>

      {studies.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {studies.map((study) => (
            <StudyCard
              key={study.id}
              study={study}
              onOpen={() => onOpenStudy(study.id)}
              onDelete={() => {
                if (window.confirm(`Excluir o estudo "${study.name}"? Isso apaga todo o progresso dele.`)) {
                  onDeleteStudy(study.id);
                }
              }}
            />
          ))}
        </div>
      )}

      <div
        style={{
          background: "#12292C",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.06)",
          padding: "16px 20px",
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          alignItems: "center",
        }}
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          placeholder="Nome do novo estudo..."
          style={{
            flex: 1,
            minWidth: 160,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            padding: "8px 12px",
            color: "#ECE8DE",
            fontSize: 13.5,
          }}
        />
        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          aria-label="Data-alvo (opcional)"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            padding: "8px 12px",
            color: "#ECE8DE",
            fontSize: 13.5,
            colorScheme: "dark",
          }}
        />
        <button
          className="btn-flat"
          onClick={handleCreate}
          style={{
            background: "#F2A93B",
            border: "none",
            borderRadius: 8,
            padding: "10px 16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontWeight: 600,
            fontSize: 14,
            color: "#0B1D1F",
          }}
        >
          <Plus size={16} />
          Novo estudo
        </button>
      </div>
    </div>
  );
}
