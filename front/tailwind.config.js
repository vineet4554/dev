/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ranger-red': '#E02E24',
        'ranger-blue': '#0066CC',
        'ranger-yellow': '#FFD700',
        'ranger-pink': '#FF69B4',
        'ranger-green': '#00CC66',
        'ranger-black': '#1A1A1A',
        'zordon-gold': '#FFA500',
        'morphin-time': '#8B00FF',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(139, 0, 255, 0.5)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(139, 0, 255, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
