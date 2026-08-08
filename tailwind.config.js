/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFBFC',
        card: '#FFFFFF',
        primary: {
          DEFAULT: '#5B3DF5',
          hover: '#4A2CE2',
          light: '#EEEAFF',
        },
        accent: {
          DEFAULT: '#38BDF8',
          hover: '#0EA5E9',
          light: '#E0F2FE',
        },
        dark: {
          DEFAULT: '#111827',
          muted: '#64748B',
          subtle: '#94A3B8',
        },
        border: '#E5E7EB',
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '24px',
        'pill': '999px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(91, 61, 245, 0.08)',
        'glass-hover': '0 20px 40px 0 rgba(91, 61, 245, 0.15)',
        'glow': '0 0 25px rgba(56, 189, 248, 0.35)',
        'indigo-glow': '0 0 30px rgba(91, 61, 245, 0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(2deg)' },
        },
      },
    },
  },
  plugins: [],
}
