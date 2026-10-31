/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Space Grotesk"', '"Syne"', 'sans-serif'],
        heading: ['"Syne"', '"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        canvas: '#F4F1EA',
        ink: {
          DEFAULT: '#0A0A0A',
          900: '#0A0A0A',
          800: '#1A1A1A',
          700: '#2E2E2E',
          500: '#5A5A52',
          400: '#7E7E76',
          300: '#B8B4A8',
          200: '#D4D0C5',
          100: '#EAE6DC',
          50: '#F5F2EB',
        },
        cobalt: {
          DEFAULT: '#0038FF',
          dark: '#0026B3',
          light: '#E6ECFF',
          hover: '#002ED6',
        },
        charcoal: '#1F1F1F',
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px #0A0A0A',
        'brutal': '4px 4px 0px #0A0A0A',
        'brutal-lg': '6px 6px 0px #0A0A0A',
        'brutal-cobalt': '4px 4px 0px #0038FF',
      }
    },
  },
  plugins: [],
}
