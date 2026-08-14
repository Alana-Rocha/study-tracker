export function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
      .btn-flat { transition: background 0.15s ease, transform 0.1s ease; }
      .btn-flat:active { transform: scale(0.97); }
      .topic-row:hover { background: rgba(255,255,255,0.03); }
      input:focus, button:focus-visible { outline: 2px solid #F2A93B; outline-offset: 2px; }
    `}</style>
  );
}
