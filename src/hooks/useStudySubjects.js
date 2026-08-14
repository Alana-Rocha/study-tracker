import { useEffect, useRef, useState } from "react";
import { DEFAULT_SUBJECTS, STORAGE_KEY } from "../constants.js";

export function useStudySubjects() {
  const [subjects, setSubjects] = useState(DEFAULT_SUBJECTS);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const saveTimeout = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get(STORAGE_KEY, false);
        if (result && result.value) {
          setSubjects(JSON.parse(result.value));
        }
      } catch (e) {
        // no saved data yet, keep defaults
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      try {
        const res = await window.storage.set(STORAGE_KEY, JSON.stringify(subjects), false);
        if (!res) setError("Não consegui salvar agora — tente novamente.");
        else setError(null);
      } catch (e) {
        setError("Não consegui salvar agora — tente novamente.");
      }
    }, 400);
    return () => clearTimeout(saveTimeout.current);
  }, [subjects, loaded]);

  const toggleTopic = (subjectId, topicId) => {
    setSubjects((prev) =>
      prev.map((s) =>
        s.id !== subjectId
          ? s
          : { ...s, topics: s.topics.map((t) => (t.id === topicId ? { ...t, done: !t.done } : t)) }
      )
    );
  };

  const deleteTopic = (subjectId, topicId) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id !== subjectId ? s : { ...s, topics: s.topics.filter((t) => t.id !== topicId) }))
    );
  };

  const addTopic = (subjectId, text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const id = `${subjectId}-${Date.now()}`;
    setSubjects((prev) =>
      prev.map((s) => (s.id !== subjectId ? s : { ...s, topics: [...s.topics, { id, text: trimmed, done: false }] }))
    );
  };

  const resetAll = async () => {
    setSubjects(DEFAULT_SUBJECTS);
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(DEFAULT_SUBJECTS), false);
    } catch (e) {}
  };

  return { subjects, error, toggleTopic, deleteTopic, addTopic, resetAll };
}
