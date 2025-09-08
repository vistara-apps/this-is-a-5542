/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "hsl(210, 80%, 50%)",
        accent: "hsl(160, 80%, 40%)",
        bg: "hsl(220, 15%, 12%)",
        surface: "hsl(220, 15%, 15%)",
        textPrimary: "hsl(0, 0%, 95%)",
        textSecondary: "hsl(0, 0%, 75%)",
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(0, 0%, 0%, 0.1)',
      },
    },
  },
  plugins: [],
}