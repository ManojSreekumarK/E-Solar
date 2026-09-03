export default function WireframeHouse() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full">
      <defs>
        <linearGradient id="roofGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#0ea5b7" />
        </linearGradient>
      </defs>

      <g fill="none" stroke="#111" strokeWidth="1.5" strokeLinejoin="round">
        {/* base cube (isometric) */}
        <polygon points="90,220 200,160 310,220 310,320 200,380 90,320" fill="#fff" />
        <polygon points="90,220 200,160 310,220 200,280 90,220" fill="#f4f4f4" />
        <line x1="200" y1="160" x2="200" y2="280" />
        <line x1="90" y1="220" x2="90" y2="320" />
        <line x1="310" y1="220" x2="310" y2="320" />
        <line x1="200" y1="280" x2="200" y2="380" />

        {/* roof (solar) */}
        <polygon points="80,220 200,150 320,220 200,290" fill="url(#roofGrad)" opacity="0.85" />
        <line x1="80" y1="220" x2="320" y2="220" strokeWidth="1" opacity="0.5" />
        <line x1="140" y1="187" x2="140" y2="252" strokeWidth="1" opacity="0.4" />
        <line x1="200" y1="150" x2="200" y2="290" strokeWidth="1" opacity="0.4" />
        <line x1="260" y1="187" x2="260" y2="252" strokeWidth="1" opacity="0.4" />

        {/* door / window */}
        <rect x="170" y="300" width="30" height="60" fill="#111" opacity="0.85" />
        <rect x="230" y="240" width="34" height="34" fill="#cfeeff" opacity="0.8" />
      </g>
    </svg>
  );
}
