import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, CheckCircle2, Circle, Flame, ChevronDown, ChevronRight, Play, Pause, RotateCcw, Coffee } from "lucide-react";

const STORAGE_KEY = "transpetro-study-data-v1";
const POMODORO_KEY = "transpetro-pomodoro-v1";
const EXAM_DATE = new Date("2026-11-29T13:00:00-03:00");
const WORK_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

const DEFAULT_SUBJECTS = [
  {
    id: "portugues",
    name: "Língua Portuguesa",
    color: "#2E8C90",
    topics: [
      { id: "p1", text: "Compreensão de textos", done: false },
      { id: "p2", text: "Ortografia oficial", done: false },
      { id: "p3", text: "Mecanismos de coesão textual", done: false },
      { id: "p4", text: "Significação das palavras", done: false },
      { id: "p5", text: "Emprego de tempos e modos verbais", done: false },
      { id: "p6", text: "Emprego das classes de palavras", done: false },
      { id: "p7", text: "Coordenação e subordinação", done: false },
      { id: "p8", text: "Emprego dos sinais de pontuação", done: false },
      { id: "p9", text: "Concordância verbal e nominal", done: false },
      { id: "p10", text: "Regência verbal e nominal", done: false },
      { id: "p11", text: "Emprego do sinal indicativo de crase", done: false },
      { id: "p12", text: "Colocação dos pronomes átonos", done: false },
    ],
  },
  {
    id: "ingles",
    name: "Língua Inglesa",
    color: "#2E8C90",
    topics: [
      { id: "i1", text: "Compreensão de texto escrito", done: false },
      { id: "i2", text: "Itens gramaticais relevantes", done: false },
    ],
  },
  {
    id: "processos",
    name: "Processos de Negócio",
    color: "#F2A93B",
    topics: [
      { id: "n1", text: "Arquitetura de Dados (modelagem, SQL, NoSQL, ETL)", done: false },
      { id: "n2", text: "Gerenciamento de Projetos (Scrum, Kanban, PMBOK, SAFe)", done: false },
      { id: "n3", text: "Processos (grupos e áreas de conhecimento PMBOK)", done: false },
      { id: "n4", text: "Gestão e Governança em TI / LGPD", done: false },
      { id: "n5", text: "Engenharia de Software (requisitos, ciclo de vida)", done: false },
      { id: "n6", text: "UX (usabilidade, design thinking, MVP, personas)", done: false },
      { id: "n7", text: "Análise de Dados e BI (DW, OLAP, dashboards)", done: false },
      { id: "n8", text: "Lógica Matemática (sentencial, predicados)", done: false },
      { id: "n9", text: "Segurança da Informação (visão geral)", done: false },
    ],
  },
];

function daysUntil(date) {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function Gauge({ percent }) {
  const angle = -90 + (percent / 100) * 180;
  const needleColor = percent < 34 ? "#D9643A" : percent < 67 ? "#F2A93B" : "#6FA96C";
  const r = 80;
  const cx = 100;
  const cy = 100;
  const arc = (startDeg, endDeg, color, width) => {
    const s = (Math.PI * startDeg) / 180;
    const e = (Math.PI * endDeg) / 180;
    const x1 = cx + r * Math.cos(s);
    const y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e);
    const y2 = cy + r * Math.sin(e);
    return (
      <path
        d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
        stroke={color}
        strokeWidth={width}
        fill="none"
        strokeLinecap="round"
      />
    );
  };
  return (
    <svg viewBox="0 0 200 145" className="w-full max-w-[220px]">
      {arc(180, 240, "#D9643A", 14)}
      {arc(240, 300, "#F2A93B", 14)}
      {arc(300, 360, "#6FA96C", 14)}
      <g transform={`rotate(${angle} ${cx} ${cy})`}>
        <line x1={cx} y1={cy} x2={cx} y2={cy - r + 18} stroke={needleColor} strokeWidth="3" strokeLinecap="round" />
      </g>
      <circle cx={cx} cy={cy} r="6" fill={needleColor} />
      <text x={cx} y={cy + 28} textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="22" fontWeight="600" fill="#ECE8DE">
        {percent}%
      </text>
    </svg>
  );
}

export default function StudyTracker() {
  const [subjects, setSubjects] = useState(DEFAULT_SUBJECTS);
  const [loaded, setLoaded] = useState(false);
  const [expanded, setExpanded] = useState({ portugues: true, ingles: true, processos: true });
  const [newTopicText, setNewTopicText] = useState({});
  const [error, setError] = useState(null);
  const saveTimeout = useRef(null);

  const [mode, setMode] = useState("work"); // "work" | "break"
  const [secondsLeft, setSecondsLeft] = useState(WORK_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [pomodoroLoaded, setPomodoroLoaded] = useState(false);
  const tickRef = useRef(null);

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
          // transition to next mode
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
    if (secondsLeft === 0) {
      setSecondsLeft(mode === "work" ? WORK_SECONDS : BREAK_SECONDS);
    }
  }, [mode]);

  const toggleTimer = () => setIsRunning((r) => !r);
  const resetTimer = () => {
    setIsRunning(false);
    setMode("work");
    setSecondsLeft(WORK_SECONDS);
  };
  const skipPhase = () => {
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

  const addTopic = (subjectId) => {
    const text = (newTopicText[subjectId] || "").trim();
    if (!text) return;
    const id = `${subjectId}-${Date.now()}`;
    setSubjects((prev) =>
      prev.map((s) => (s.id !== subjectId ? s : { ...s, topics: [...s.topics, { id, text, done: false }] }))
    );
    setNewTopicText((prev) => ({ ...prev, [subjectId]: "" }));
  };

  const resetAll = async () => {
    setSubjects(DEFAULT_SUBJECTS);
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(DEFAULT_SUBJECTS), false);
    } catch (e) {}
  };

  const allTopics = subjects.flatMap((s) => s.topics);
  const doneCount = allTopics.filter((t) => t.done).length;
  const totalCount = allTopics.length || 1;
  const overallPercent = Math.round((doneCount / totalCount) * 100);
  const days = daysUntil(EXAM_DATE);

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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .btn-flat { transition: background 0.15s ease, transform 0.1s ease; }
        .btn-flat:active { transform: scale(0.97); }
        .topic-row:hover { background: rgba(255,255,255,0.03); }
        input:focus, button:focus-visible { outline: 2px solid #F2A93B; outline-offset: 2px; }
      `}</style>

      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Header / dashboard */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            alignItems: "center",
            justifyContent: "space-between",
            background: "#12292C",
            borderRadius: 12,
            padding: "20px 24px",
            border: "1px solid rgba(46,140,144,0.25)",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: 30,
                letterSpacing: 0.5,
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              Painel de Estudos <span style={{ color: "#F2A93B" }}>Transpetro</span>
            </div>
            <div style={{ color: "#8FA6A8", fontSize: 14, marginTop: 6 }}>
              Análise de Sistemas — Processos de Negócio
            </div>
            <div
              style={{
                marginTop: 14,
                display: "flex",
                alignItems: "baseline",
                gap: 8,
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            >
              <Flame size={18} color="#F2A93B" />
              <span style={{ fontSize: 28, fontWeight: 600, color: "#F2A93B" }}>{days}</span>
              <span style={{ color: "#8FA6A8", fontSize: 14 }}>dias até a prova (29/11/2026)</span>
            </div>
          </div>
          <Gauge percent={overallPercent} />
        </div>

        {error && (
          <div style={{ marginTop: 12, color: "#D9643A", fontSize: 13 }}>{error}</div>
        )}

        {/* Pomodoro */}
        <div
          style={{
            marginTop: 16,
            background: "#12292C",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.06)",
            padding: "20px 24px",
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ position: "relative", width: 96, height: 96 }}>
              <svg viewBox="0 0 100 100" style={{ width: 96, height: 96, transform: "rotate(-90deg)" }}>
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke={mode === "work" ? "#F2A93B" : "#6FA96C"}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - timerPct / 100)}
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 20, fontWeight: 600 }}>
                  {timerMinutes}:{timerSeconds}
                </span>
              </div>
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 20,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 0.3,
                  color: mode === "work" ? "#F2A93B" : "#6FA96C",
                }}
              >
                {mode === "work" ? <Flame size={18} /> : <Coffee size={18} />}
                {mode === "work" ? "Foco" : "Pausa"}
              </div>
              <div style={{ color: "#8FA6A8", fontSize: 13, marginTop: 4 }}>
                {sessionsCompleted} {sessionsCompleted === 1 ? "ciclo concluído" : "ciclos concluídos"}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="btn-flat"
              onClick={toggleTimer}
              style={{
                background: "#F2A93B",
                border: "none",
                borderRadius: 8,
                padding: "10px 18px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontWeight: 600,
                fontSize: 14,
                color: "#0B1D1F",
              }}
            >
              {isRunning ? <Pause size={16} /> : <Play size={16} />}
              {isRunning ? "Pausar" : "Iniciar"}
            </button>
            <button
              className="btn-flat"
              onClick={skipPhase}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
                padding: "10px 16px",
                cursor: "pointer",
                color: "#ECE8DE",
                fontSize: 14,
              }}
            >
              Pular fase
            </button>
            <button
              className="btn-flat"
              onClick={resetTimer}
              aria-label="Reiniciar timer"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
                padding: "10px 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <RotateCcw size={16} color="#8FA6A8" />
            </button>
          </div>
        </div>

        {/* Subjects */}
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          {subjects.map((subject) => {
            const done = subject.topics.filter((t) => t.done).length;
            const total = subject.topics.length || 1;
            const pct = Math.round((done / total) * 100);
            const isOpen = expanded[subject.id];
            return (
              <div
                key={subject.id}
                style={{
                  background: "#12292C",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.06)",
                  overflow: "hidden",
                }}
              >
                <button
                  className="btn-flat"
                  onClick={() => setExpanded((p) => ({ ...p, [subject.id]: !p[subject.id] }))}
                  style={{
                    width: "100%",
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

                {isOpen && (
                  <div style={{ padding: "0 12px 14px" }}>
                    {subject.topics.map((topic) => (
                      <div
                        key={topic.id}
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
                          onClick={() => toggleTopic(subject.id, topic.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
                          aria-label={topic.done ? "Marcar como não concluído" : "Marcar como concluído"}
                        >
                          {topic.done ? (
                            <CheckCircle2 size={19} color="#6FA96C" />
                          ) : (
                            <Circle size={19} color="#8FA6A8" />
                          )}
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
                          onClick={() => deleteTopic(subject.id, topic.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, opacity: 0.5 }}
                          aria-label="Remover tópico"
                        >
                          <Trash2 size={15} color="#D9643A" />
                        </button>
                      </div>
                    ))}

                    <div style={{ display: "flex", gap: 8, marginTop: 8, padding: "0 8px" }}>
                      <input
                        type="text"
                        value={newTopicText[subject.id] || ""}
                        onChange={(e) => setNewTopicText((p) => ({ ...p, [subject.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && addTopic(subject.id)}
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
                        onClick={() => addTopic(subject.id)}
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
          })}
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
