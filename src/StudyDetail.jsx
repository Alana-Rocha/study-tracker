import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { daysUntil, subjectsProgress } from "./utils.js";
import { usePomodoro } from "./hooks/usePomodoro.js";
import { DashboardHeader } from "./components/DashboardHeader.jsx";
import { PomodoroPanel } from "./components/PomodoroPanel.jsx";
import { SubjectCard } from "./components/SubjectCard.jsx";

export function StudyDetail({
  study,
  onBack,
  onToggleTopic,
  onDeleteTopic,
  onAddTopic,
  onAddSubject,
  onDeleteSubject,
  onResetProgress,
}) {
  const pomodoro = usePomodoro();
  const [newSubjectName, setNewSubjectName] = useState("");

  const { percent: overallPercent } = subjectsProgress(study.subjects);
  const examDate = study.examDate ? new Date(study.examDate) : null;
  const daysLeft = examDate ? daysUntil(examDate) : null;

  const handleAddSubject = () => {
    onAddSubject(newSubjectName);
    setNewSubjectName("");
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <button
        onClick={onBack}
        className="btn-flat"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          color: "#8FA6A8",
          cursor: "pointer",
          fontSize: 13,
          padding: "4px 0",
          marginBottom: 12,
        }}
      >
        <ArrowLeft size={16} />
        Meus estudos
      </button>

      <DashboardHeader title={study.name} daysLeft={daysLeft} examDate={examDate} overallPercent={overallPercent} />

      <PomodoroPanel
        mode={pomodoro.mode}
        isRunning={pomodoro.isRunning}
        sessionsCompleted={pomodoro.sessionsCompleted}
        timerMinutes={pomodoro.timerMinutes}
        timerSeconds={pomodoro.timerSeconds}
        timerPct={pomodoro.timerPct}
        toggleTimer={pomodoro.toggleTimer}
        resetTimer={pomodoro.resetTimer}
        skipPhase={pomodoro.skipPhase}
      />

      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
        {study.subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            defaultOpen
            onToggleTopic={(topicId) => onToggleTopic(subject.id, topicId)}
            onDeleteTopic={(topicId) => onDeleteTopic(subject.id, topicId)}
            onAddTopic={(text) => onAddTopic(subject.id, text)}
            onDeleteSubject={() => onDeleteSubject(subject.id)}
          />
        ))}
      </div>

      <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
        <input
          type="text"
          value={newSubjectName}
          onChange={(e) => setNewSubjectName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddSubject()}
          placeholder="Nova matéria..."
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
          onClick={handleAddSubject}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 8,
            padding: "0 14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#ECE8DE",
            fontSize: 13.5,
          }}
        >
          <Plus size={16} />
          Matéria
        </button>
      </div>

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <button
          onClick={onResetProgress}
          style={{
            background: "none",
            border: "1px solid rgba(217,100,58,0.4)",
            color: "#D9643A",
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Reiniciar progresso
        </button>
      </div>
    </div>
  );
}
