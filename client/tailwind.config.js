/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050b14',
          900: '#0a1420',
          800: '#0f1e2e',
          700: '#16293b',
          600: '#1e3a4f',
        },
        teal: {
          950: '#042f2e',
          400: '#2dd4bf',
          300: '#5eead4',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(45, 212, 191, 0.15), 0 0 24px rgba(45, 212, 191, 0.08)',
      },
    },
  },
  plugins: [],
};
