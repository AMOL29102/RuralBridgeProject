// filepath: c:\Users\amolp\Downloads\RuralBridgeProject\RuralBridgeProject\frontend\tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': 'var(--brand-primary)',
        'brand-secondary': 'var(--brand-secondary)',
        'brand-accent': 'var(--brand-accent)',
        'brand-accent-hover': 'var(--brand-accent-hover)',
        'brand-text-primary': 'var(--brand-text-primary)',
        'brand-text-secondary': 'var(--brand-text-secondary)',
        'brand-highlight': 'var(--brand-highlight)',
        'brand-border': 'var(--brand-border)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
    },
  },
  plugins: [],
}