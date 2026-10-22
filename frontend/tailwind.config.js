/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        oriental: {
          navy: '#0B192C',
          dark: '#1E3E62',
          blue: '#0056B3',
          teal: '#008080',
          accent: '#F59E0B',
          light: '#F8FAFC',
          border: '#E2E8F0',
          card: '#FFFFFF',
          text: '#0F172A',
          muted: '#64748B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif']
      },
      boxShadow: {
        'premium': '0 10px 30px -5px rgba(11, 25, 44, 0.08), 0 4px 6px -2px rgba(11, 25, 44, 0.03)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glow': '0 0 20px rgba(0, 128, 128, 0.25)',
      }
    },
  },
  plugins: [],
}
