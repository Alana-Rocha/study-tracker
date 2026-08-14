import { useEffect, useRef, useState } from "react";
import { DEFAULT_SUBJECTS, EXAM_DATE, STORAGE_KEY, STUDIES_KEY, SUBJECT_COLORS } from "../constants.js";

async function loadInitialStudies() {
  try {
    const existing = await window.storage.get(STUDIES_KEY, false);
    if (existing && existing.value) return JSON.parse(existing.value);
  } catch (e) {
    // fall through to migration / seed
  }

  try {
    const legacy = await window.storage.get(STORAGE_KEY, false);
    if (legacy && legacy.value) {
      return [
        {
          id: "transpetro",
          name: "Transpetro",
          examDate: EXAM_DATE.toISOString(),
          subjects: JSON.parse(legacy.value),
        },
      ];
    }
  } catch (e) {
    // no legacy data either, seed with defaults below
  }

  return [
    {
      id: "transpetro",
      name: "Transpetro",
      examDate: EXAM_DATE.toISOString(),
      subjects: DEFAULT_SUBJECTS,
    },
  ];
}

export function useStudies() {
  const [studies, setStudies] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const saveTimeout = useRef(null);

  useEffect(() => {
    (async () => {
      const initial = await loadInitialStudies();
      setStudies(initial);
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      try {
        const res = await window.storage.set(STUDIES_KEY, JSON.stringify(studies), false);
        if (!res) setError("Não consegui salvar agora — tente novamente.");
        else setError(null);
      } catch (e) {
        setError("Não consegui salvar agora — tente novamente.");
      }
    }, 400);
    return () => clearTimeout(saveTimeout.current);
  }, [studies, loaded]);

  const createStudy = (name, examDate) => {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const id = `study-${Date.now()}`;
    setStudies((prev) => [...prev, { id, name: trimmed, examDate: examDate || null, subjects: [] }]);
    return id;
  };

  const deleteStudy = (studyId) => {
    setStudies((prev) => prev.filter((s) => s.id !== studyId));
  };

  const addSubject = (studyId, name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setStudies((prev) =>
      prev.map((study) => {
        if (study.id !== studyId) return study;
        const color = SUBJECT_COLORS[study.subjects.length % SUBJECT_COLORS.length];
        const id = `subj-${Date.now()}`;
        return { ...study, subjects: [...study.subjects, { id, name: trimmed, color, topics: [] }] };
      })
    );
  };

  const deleteSubject = (studyId, subjectId) => {
    setStudies((prev) =>
      prev.map((study) =>
        study.id !== studyId ? study : { ...study, subjects: study.subjects.filter((s) => s.id !== subjectId) }
      )
    );
  };

  const toggleTopic = (studyId, subjectId, topicId) => {
    setStudies((prev) =>
      prev.map((study) => {
        if (study.id !== studyId) return study;
        return {
          ...study,
          subjects: study.subjects.map((s) =>
            s.id !== subjectId
              ? s
              : { ...s, topics: s.topics.map((t) => (t.id === topicId ? { ...t, done: !t.done } : t)) }
          ),
        };
      })
    );
  };

  const deleteTopic = (studyId, subjectId, topicId) => {
    setStudies((prev) =>
      prev.map((study) => {
        if (study.id !== studyId) return study;
        return {
          ...study,
          subjects: study.subjects.map((s) =>
            s.id !== subjectId ? s : { ...s, topics: s.topics.filter((t) => t.id !== topicId) }
          ),
        };
      })
    );
  };

  const addTopic = (studyId, subjectId, text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const id = `${subjectId}-${Date.now()}`;
    setStudies((prev) =>
      prev.map((study) => {
        if (study.id !== studyId) return study;
        return {
          ...study,
          subjects: study.subjects.map((s) =>
            s.id !== subjectId ? s : { ...s, topics: [...s.topics, { id, text: trimmed, done: false }] }
          ),
        };
      })
    );
  };

  const resetProgress = (studyId) => {
    setStudies((prev) =>
      prev.map((study) =>
        study.id !== studyId
          ? study
          : {
              ...study,
              subjects: study.subjects.map((s) => ({
                ...s,
                topics: s.topics.map((t) => ({ ...t, done: false })),
              })),
            }
      )
    );
  };

  return {
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
  };
}
