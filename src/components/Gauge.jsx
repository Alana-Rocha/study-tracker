export function Gauge({ percent }) {
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
