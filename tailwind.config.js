/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A5F',
        secondary: '#4A90E2', 
        accent: '#00D4AA',
        surface: '#F8FAFB',
        success: '#00C853',
        warning: '#FFA726',
        error: '#EF5350',
        info: '#42A5F5',
        background: '#FFFFFF'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['DM Sans', 'ui-sans-serif', 'system-ui']
      }
    },
  },
  plugins: [],
};