import { Coffee, Flame, Pause, Play, RotateCcw } from "lucide-react";

export function PomodoroPanel({
  mode,
  isRunning,
  sessionsCompleted,
  timerMinutes,
  timerSeconds,
  timerPct,
  toggleTimer,
  resetTimer,
  skipPhase,
}) {
  return (
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
  );
}
