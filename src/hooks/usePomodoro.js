import { useEffect, useRef, useState } from "react";
import { BREAK_SECONDS, POMODORO_KEY, WORK_SECONDS } from "../constants.js";
import { playPhaseEndChime, primeAudio } from "../sound.js";

export function usePomodoro() {
  const [mode, setMode] = useState("work"); // "work" | "break"
  const [secondsLeft, setSecondsLeft] = useState(WORK_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [pomodoroLoaded, setPomodoroLoaded] = useState(false);
  const tickRef = useRef(null);
  const isFirstMode = useRef(true);

  useEffect(() => {
    (async () => {
      try {
        const pomo = await window.storage.get(POMODORO_KEY, false);
        if (pomo && pomo.value) {
          const parsed = JSON.parse(pomo.value);
          if (typeof parsed.sessionsCompleted === "number") setSessionsCompleted(parsed.sessionsCompleted);
        }
      } catch (e) {
        // no saved pomodoro data yet
      } finally {
        setPomodoroLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!pomodoroLoaded) return;
    window.storage.set(POMODORO_KEY, JSON.stringify({ sessionsCompleted }), false).catch(() => {});
  }, [sessionsCompleted, pomodoroLoaded]);

  useEffect(() => {
    if (!isRunning) return;
    tickRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setMode((m) => {
            const next = m === "work" ? "break" : "work";
            if (m === "work") setSessionsCompleted((c) => c + 1);
            return next;
          });
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(tickRef.current);
  }, [isRunning]);

  useEffect(() => {
    setSecondsLeft(mode === "work" ? WORK_SECONDS : BREAK_SECONDS);
    if (isFirstMode.current) {
      isFirstMode.current = false;
      return;
    }
    playPhaseEndChime(mode);
  }, [mode]);

  const toggleTimer = () => {
    primeAudio();
    setIsRunning((r) => !r);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMode("work");
    setSecondsLeft(WORK_SECONDS);
  };

  const skipPhase = () => {
    primeAudio();
    setIsRunning(false);
    setMode((m) => {
      const next = m === "work" ? "break" : "work";
      if (m === "work") setSessionsCompleted((c) => c + 1);
      return next;
    });
  };

  const timerMinutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const timerSeconds = String(secondsLeft % 60).padStart(2, "0");
  const timerTotal = mode === "work" ? WORK_SECONDS : BREAK_SECONDS;
  const timerPct = ((timerTotal - secondsLeft) / timerTotal) * 100;

  return {
    mode,
    isRunning,
    sessionsCompleted,
    timerMinutes,
    timerSeconds,
    timerPct,
    toggleTimer,
    resetTimer,
    skipPhase,
  };
}
