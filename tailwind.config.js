/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#58CC02',
          dark: '#46A302',
          light: '#89E219',
        },
        secondary: '#FF9600',
        accent: '#1CB0F6',
        warning: '#FFC800',
        error: '#FF4B4B',
        'bg-primary': '#FFFFFF',
        'bg-secondary': '#F7F7F7',
        'text-primary': '#3C3C3C',
        'text-secondary': '#777777',
        border: '#E5E5E5',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
      boxShadow: {
        'md': '0 4px 8px rgba(0,0,0,0.12)',
        'lg': '0 8px 16px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
}
