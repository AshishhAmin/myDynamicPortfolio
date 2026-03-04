/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── UI/UX Pro Max Portfolio Design System ──────────
        // Primary/Text: Near-black zinc
        primary: { DEFAULT: '#18181B', light: '#3F3F46', pale: '#71717A' },
        // CTA/Accent: Blue-600
        cta: { DEFAULT: '#2563EB', hover: '#1D4ED8', soft: 'rgba(37,99,235,0.10)', glow: 'rgba(37,99,235,0.25)' },
        // Backgrounds
        bg: { base: '#FAFAFA', card: '#FFFFFF', muted: '#F4F4F5', hover: '#F1F5F9' },
        // Borders
        border: { DEFAULT: '#E4E4E7', strong: '#D4D4D8', subtle: 'rgba(0,0,0,0.06)' },
        // Text
        text: { base: '#09090B', muted: '#52525B', placeholder: '#A1A1AA' },
        // Zinc scale alias (backwards compat)
        ink: {
          950: '#09090B',
          900: '#18181B',
          700: '#3F3F46',
          500: '#71717A',
          400: '#A1A1AA',
          200: '#E4E4E7',
          100: '#F4F4F5',
          50: '#FAFAFA',
        },
        // Accent alias
        accent: { DEFAULT: '#2563EB', light: '#60A5FA', soft: 'rgba(37,99,235,0.10)' },
        // Preserve surface token
        surface: { base: '#FAFAFA', card: '#FFFFFF', hover: '#F4F4F5' },
      },
      fontFamily: {
        heading: ['Caveat', '"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['Quicksand', '"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'blob': 'blob 9s ease-in-out infinite alternate',
        'spin-slow': 'spin 20s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'aurora-1': 'aurora-drift-1 20s ease-in-out infinite',
        'aurora-2': 'aurora-drift-2 26s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
        'fadeInUp': 'fadeInUp 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        blob: {
          '0%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
          '100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'aurora-drift-1': {
          '0%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(50px,-30px) scale(1.06)' },
          '66%': { transform: 'translate(-30px,20px) scale(0.96)' },
          '100%': { transform: 'translate(0,0) scale(1)' },
        },
        'aurora-drift-2': {
          '0%': { transform: 'translate(0,0) scale(1.04)' },
          '40%': { transform: 'translate(-60px,40px) scale(0.93)' },
          '80%': { transform: 'translate(40px,-20px) scale(1.08)' },
          '100%': { transform: 'translate(0,0) scale(1.04)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeInUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
        'cta': '0 2px 10px rgba(37,99,235,0.25)',
        'cta-hover': '0 4px 20px rgba(37,99,235,0.35)',
        'glow-blue': '0 0 0 3px rgba(37,99,235,0.15)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
};
