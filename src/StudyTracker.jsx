import { EXAM_DATE } from "./constants.js";
import { daysUntil } from "./utils.js";
import { useStudySubjects } from "./hooks/useStudySubjects.js";
import { usePomodoro } from "./hooks/usePomodoro.js";
import { GlobalStyles } from "./components/GlobalStyles.jsx";
import { DashboardHeader } from "./components/DashboardHeader.jsx";
import { PomodoroPanel } from "./components/PomodoroPanel.jsx";
import { SubjectCard } from "./components/SubjectCard.jsx";

export default function StudyTracker() {
  const { subjects, error, toggleTopic, deleteTopic, addTopic, resetAll } = useStudySubjects();
  const pomodoro = usePomodoro();

  const allTopics = subjects.flatMap((s) => s.topics);
  const doneCount = allTopics.filter((t) => t.done).length;
  const totalCount = allTopics.length || 1;
  const overallPercent = Math.round((doneCount / totalCount) * 100);
  const daysLeft = daysUntil(EXAM_DATE);

  return (
    <div
      style={{
        background: "#0B1D1F",
        minHeight: "100%",
        fontFamily: "'IBM Plex Sans', sans-serif",
        color: "#ECE8DE",
        padding: "24px 16px",
      }}
    >
      <GlobalStyles />

      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <DashboardHeader daysLeft={daysLeft} overallPercent={overallPercent} />

        {error && <div style={{ marginTop: 12, color: "#D9643A", fontSize: 13 }}>{error}</div>}

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
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              defaultOpen
              onToggleTopic={(topicId) => toggleTopic(subject.id, topicId)}
              onDeleteTopic={(topicId) => deleteTopic(subject.id, topicId)}
              onAddTopic={(text) => addTopic(subject.id, text)}
            />
          ))}
        </div>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <button
            onClick={resetAll}
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
    </div>
  );
}
