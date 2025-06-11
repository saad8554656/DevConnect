/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0D9488',           // Teal
        secondary: '#7E735F',        // Olive/Brown
        accent: '#FFC344',            // Golden Yellow
        backgroundLight: '#FDF6EC',   // Cream
        backgroundDark: '#675C4C',   // Warm Slate
        highlight: '#EE675C',         // Coral
        error: '#D02C2F',            // Deep Red
      }
    },
  },
  plugins: [],
}
