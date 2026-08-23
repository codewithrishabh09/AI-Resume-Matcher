import { Link } from 'react-router-dom'

export default function Logo({ size = 'md', clickable = true, variant = 'dark' }) {
  const sizes = {
    sm: {
      svg: 'w-7 h-7',
      text: 'text-lg',
      gap: 'gap-2'
    },
    md: {
      svg: 'w-9 h-9',
      text: 'text-xl',
      gap: 'gap-2.5'
    },
    lg: {
      svg: 'w-12 h-12',
      text: 'text-3xl',
      gap: 'gap-3'
    }
  }

  const s = sizes[size] || sizes.md
  const isLight = variant === 'light'

  const content = (
    <div className={`flex items-center ${s.gap} group cursor-pointer select-none`}>
      {/* High-Resolution SVG RX Monogram Emblem (Exact match to uploaded image) */}
      <div className={`relative ${s.svg} flex items-center justify-center transition-transform group-hover:scale-105`}>
        <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="rxLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF007A" />
              <stop offset="40%" stopColor="#E024A5" />
              <stop offset="80%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          </defs>

          <g fill="none" stroke="url(#rxLogoGrad)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
            {/* R - Upper Bar */}
            <path d="M 20 50 H 90 C 115 50 115 90 90 90 H 40" />
            {/* R - Lower Bar */}
            <path d="M 20 90 H 80 C 95 90 100 100 110 120 L 125 150" />
            {/* R - Vertical Stems */}
            <path d="M 45 120 V 150" />
            <path d="M 65 130 V 150" />

            {/* X - Diagonal Lines */}
            <path d="M 120 60 L 140 90 L 175 150" />
            <path d="M 140 50 L 155 75" />
            <path d="M 175 60 L 120 150" />
            <path d="M 140 150 L 155 125" />
          </g>
        </svg>
      </div>

      {/* Typography */}
      <div className="flex items-center font-black tracking-tight">
        <span className={`${s.text} ${isLight ? 'text-gray-900' : 'text-white'} font-extrabold tracking-tight group-hover:text-purple-500 transition-colors`}>
          Resume<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">X</span>
        </span>
      </div>
    </div>
  )

  if (!clickable) return content

  return (
    <Link to="/" className="inline-block">
      {content}
    </Link>
  )
}
