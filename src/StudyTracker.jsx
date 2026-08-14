import { useEffect, useState } from "react";
import { ONBOARDING_SEEN_KEY } from "./constants.js";
import { useStudies } from "./hooks/useStudies.js";
import { GlobalStyles } from "./components/GlobalStyles.jsx";
import { Onboarding } from "./components/Onboarding.jsx";
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
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const seen = await window.storage.get(ONBOARDING_SEEN_KEY, false);
        if (!seen || !seen.value) setShowOnboarding(true);
      } catch (e) {
        setShowOnboarding(true);
      }
    })();
  }, []);

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    window.storage.set(ONBOARDING_SEEN_KEY, "true", false).catch(() => {});
  };

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

      {showOnboarding && <Onboarding onClose={dismissOnboarding} />}

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
          onShowHelp={() => setShowOnboarding(true)}
        />
      )}
    </div>
  );
}
