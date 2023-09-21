/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        highlight: {
          '80%, 100%': { transform: 'scale(1.2)', opacity: '0.7' },
        }
      },
      animation: {
        highlight: 'highlight 1.5s ease-out 3',
      }
    },
  },
  plugins: [],
}

