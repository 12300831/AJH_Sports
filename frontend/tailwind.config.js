/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        sora: ['Sora', 'sans-serif'],
      },
      colors: {
        'ajh-yellow': '#e0cb23',
        'ajh-dark': '#1a1a2e',
        'ajh-navy': '#16213e',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(224, 203, 35, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(224, 203, 35, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};
