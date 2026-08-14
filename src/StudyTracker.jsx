import { useState } from "react";
import { useStudies } from "./hooks/useStudies.js";
import { GlobalStyles } from "./components/GlobalStyles.jsx";
import { StudyList } from "./StudyList.jsx";
import { StudyDetail } from "./StudyDetail.jsx";

export default function StudyTracker() {
  const {
    studies,
    error,
    createStudy,
    deleteStudy,
    addSubject,
    deleteSubject,
    toggleTopic,
    deleteTopic,
    addTopic,
    resetProgress,
  } = useStudies();
  const [activeStudyId, setActiveStudyId] = useState(null);

  const activeStudy = studies.find((s) => s.id === activeStudyId) || null;

  return (
    <div
      style={{
        background: "#0B1D1F",
        minHeight: "100vh",
        fontFamily: "'IBM Plex Sans', sans-serif",
        color: "#ECE8DE",
        padding: "24px 16px",
      }}
    >
      <GlobalStyles />

      {error && <div style={{ maxWidth: 720, margin: "0 auto 12px", color: "#D9643A", fontSize: 13 }}>{error}</div>}

      {activeStudy ? (
        <StudyDetail
          study={activeStudy}
          onBack={() => setActiveStudyId(null)}
          onToggleTopic={(subjectId, topicId) => toggleTopic(activeStudy.id, subjectId, topicId)}
          onDeleteTopic={(subjectId, topicId) => deleteTopic(activeStudy.id, subjectId, topicId)}
          onAddTopic={(subjectId, text) => addTopic(activeStudy.id, subjectId, text)}
          onAddSubject={(name) => addSubject(activeStudy.id, name)}
          onDeleteSubject={(subjectId) => deleteSubject(activeStudy.id, subjectId)}
          onResetProgress={() => resetProgress(activeStudy.id)}
        />
      ) : (
        <StudyList
          studies={studies}
          onOpenStudy={setActiveStudyId}
          onCreateStudy={createStudy}
          onDeleteStudy={deleteStudy}
        />
      )}
    </div>
  );
}
