type Variant = "villa" | "traditional";

export default function TestimonialScene({ variant }: { variant: Variant }) {
  if (variant === "villa") {
    return (
      <svg viewBox="0 0 900 700" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="villaSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8fd3f4" />
            <stop offset="100%" stopColor="#e0f7f0" />
          </linearGradient>
        </defs>
        <rect width="900" height="700" fill="url(#villaSky)" />

        {/* palms */}
        {[70, 830].map((x, i) => (
          <g key={i} transform={`translate(${x},390)`}>
            <rect x="-5" y="0" width="10" height="150" fill="#6b4a2f" />
            {[-60, -30, 0, 30, 60].map((a, j) => (
              <ellipse
                key={j}
                cx={Math.sin((a * Math.PI) / 180) * 45}
                cy={-Math.abs(Math.cos((a * Math.PI) / 180)) * 40}
                rx="42"
                ry="14"
                fill="#2f7d4f"
                transform={`rotate(${a})`}
              />
            ))}
          </g>
        ))}

        {/* roof band with solar panels */}
        <rect x="150" y="270" width="600" height="26" fill="#8a6a45" />
        {Array.from({ length: 13 }).map((_, c) => (
          <rect
            key={c}
            x={158 + c * 45}
            y="274"
            width="40"
            height="18"
            fill="#213347"
            stroke="#0c1620"
            strokeWidth="1"
          />
        ))}

        {/* villa body */}
        <rect x="150" y="296" width="600" height="234" fill="#f2efe8" />
        <rect x="330" y="346" width="240" height="184" fill="#12202c" />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={335 + i * 82} y="346" width="78" height="184" fill="#f4b74a" opacity="0.18" />
        ))}

        {/* pool */}
        <rect x="150" y="560" width="600" height="100" rx="12" fill="#3fb6c9" opacity="0.85" />
        <rect x="150" y="560" width="600" height="100" rx="12" fill="none" stroke="#eaf7f7" strokeWidth="6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 900 700" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="tradSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfe3ff" />
          <stop offset="100%" stopColor="#eef7ea" />
        </linearGradient>
      </defs>
      <rect width="900" height="700" fill="url(#tradSky)" />

      {/* foliage backdrop */}
      {[0, 150, 700, 850].map((x, i) => (
        <ellipse key={i} cx={x} cy="420" rx="150" ry="120" fill="#3a6b45" opacity="0.5" />
      ))}

      {/* house base */}
      <rect x="220" y="420" width="460" height="180" fill="#e7dcc7" />
      <rect x="380" y="470" width="60" height="130" fill="#4a3624" />
      <rect x="470" y="470" width="70" height="60" fill="#12202c" />

      {/* tiled gable roof */}
      <polygon points="180,420 450,260 720,420" fill="#8a3f2c" />
      <polygon points="180,420 450,260 450,278 198,428" fill="#6f3021" />
      {Array.from({ length: 7 }).map((_, r) =>
        Array.from({ length: 10 }).map((_, c) => {
          const t = r / 7;
          const x = 210 + c * 50 * (1 - t * 0.35);
          const y = 405 - r * 20;
          return <circle key={`${r}-${c}`} cx={x} cy={y} r="9" fill="#a5573c" opacity="0.5" />;
        })
      )}

      {/* solar panels on roof (upper half) */}
      {Array.from({ length: 3 }).map((_, row) =>
        Array.from({ length: 6 }).map((_, col) => (
          <rect
            key={`${row}-${col}`}
            x={330 + col * 45 - row * 4}
            y={300 + row * 26}
            width="40"
            height="20"
            fill="#152234"
            stroke="#0a121c"
            strokeWidth="1"
          />
        ))
      )}

      {/* porch posts */}
      <rect x="230" y="470" width="14" height="130" fill="#5b4632" />
      <rect x="656" y="470" width="14" height="130" fill="#5b4632" />
      <rect x="220" y="460" width="460" height="14" fill="#5b4632" />
    </svg>
  );
}
