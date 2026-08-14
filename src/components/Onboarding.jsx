import { useState } from "react";
import { X } from "lucide-react";

const STEPS = [
  {
    title: "Bem-vindo(a) ao Study Tracker",
    body: "Um jeito simples de organizar seus estudos por matérias e tópicos, com um cronômetro Pomodoro embutido pra manter o foco. Tudo fica salvo automaticamente neste navegador — sem conta, sem login.",
  },
  {
    title: "Crie quantos estudos quiser",
    body: 'Cada estudo é uma coleção independente — pode ser um concurso, um curso, uma certificação. Dê um nome e, se quiser, uma data-alvo pra acompanhar a contagem regressiva. Use o botão "+ Novo estudo" na tela inicial.',
  },
  {
    title: "Organize por matérias e tópicos",
    body: "Dentro de um estudo, crie matérias e, dentro delas, os tópicos que precisa estudar. Marque como concluído à medida que for estudando — a barra de progresso e o medidor geral atualizam sozinhos.",
  },
  {
    title: "Use o Pomodoro pra manter o foco",
    body: "25 minutos de foco, 5 de pausa. Um som toca ao iniciar e outro ao final de cada fase, então não precisa ficar de olho no relógio.",
  },
  {
    title: "Pronto!",
    body: 'Você pode rever esse tutorial quando quiser clicando em "Como funciona?" na tela inicial. Bons estudos!',
  },
];

export function Onboarding({ onClose }) {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        zIndex: 100,
      }}
    >
      <div
        style={{
          background: "#12292C",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "28px 28px 20px",
          maxWidth: 420,
          width: "100%",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "none",
            border: "none",
            cursor: "pointer",
            opacity: 0.6,
          }}
        >
          <X size={18} color="#ECE8DE" />
        </button>

        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: 24,
            textTransform: "uppercase",
            letterSpacing: 0.3,
            color: "#F2A93B",
          }}
        >
          {current.title}
        </div>
        <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.6, color: "#C9D6D6" }}>{current.body}</div>

        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 20 }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: i === step ? "#F2A93B" : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="btn-flat"
            style={{
              background: "none",
              border: "none",
              color: step === 0 ? "rgba(255,255,255,0.2)" : "#8FA6A8",
              cursor: step === 0 ? "default" : "pointer",
              fontSize: 13,
              padding: "8px 4px",
            }}
          >
            Voltar
          </button>
          <button
            onClick={() => (isLast ? onClose() : setStep((s) => s + 1))}
            className="btn-flat"
            style={{
              background: "#F2A93B",
              border: "none",
              borderRadius: 8,
              padding: "8px 18px",
              fontWeight: 600,
              fontSize: 14,
              color: "#0B1D1F",
              cursor: "pointer",
            }}
          >
            {isLast ? "Concluir" : "Próximo"}
          </button>
        </div>
      </div>
    </div>
  );
}
