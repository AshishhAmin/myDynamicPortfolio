/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#050505',
          900: '#0a0a0a',
          800: '#111111',
          700: '#1a1a1a',
          600: '#222222',
          500: '#2e2e2e',
          400: '#3d3d3d',
          300: '#555555',
          200: '#888888',
          100: '#aaaaaa',
          50: '#d0d0d0',
        },
        // Single accent — a cool silver-white glow
        glow: {
          white: '#ffffff',
          silver: '#c8cdd6',
          subtle: 'rgba(255,255,255,0.05)',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        display: ['"Cal Sans"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'blob': 'blob 9s ease-in-out infinite alternate',
        'spin-slow': 'spin 20s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
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
      },
      boxShadow: {
        'glow-sm': '0 0 12px 2px rgba(255,255,255,0.06)',
        'glow-md': '0 0 28px 4px rgba(255,255,255,0.08)',
        'glow-lg': '0 0 60px 10px rgba(255,255,255,0.05)',
        'inner-sm': 'inset 0 1px 0 rgba(255,255,255,0.07)',
      },
    },
  },
  plugins: [],
};
