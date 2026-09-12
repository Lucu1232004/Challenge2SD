// Logo propio SL - vectorial, sin emojis, con tu firma
export default function Logo({ size = 72 }) {
  return (
    <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <svg width={size} height={size} viewBox="0 0 512 512" aria-label="MediClinic SL logo">
        <rect width="512" height="512" rx="110" fill="#0B1210" />
        <rect x="14" y="14" width="484" height="484" rx="100" fill="none" stroke="#00D68F" strokeWidth="10" opacity="0.9" />
        <g opacity="0.14">
          <rect x="216" y="90" width="80" height="240" rx="20" fill="#00D68F" />
          <rect x="136" y="170" width="240" height="80" rx="20" fill="#00D68F" />
        </g>
        <circle cx="256" cy="225" r="115" fill="#14201C" stroke="#00D68F" strokeWidth="10" />
        <polyline
          points="175,225 210,225 228,190 248,260 268,200 285,225 337,225"
          fill="none"
          stroke="#00D68F"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text x="256" y="395" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="72" fill="#E6F4EF" letterSpacing="4">SL</text>
      </svg>
      <div>
        <div className="brand-name">MediClinic</div>
        <div className="brand-sub">by Samuel Patiño Lucumi</div>
      </div>
    </div>
  )
}
