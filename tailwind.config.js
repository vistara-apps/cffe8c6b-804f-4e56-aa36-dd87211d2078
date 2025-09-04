/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(220 14% 92%)',
        accent: 'hsl(36 98% 58%)',
        primary: 'hsl(204 70% 53%)',
        surface: 'hsl(220 14% 100%)',
        'text-primary': 'hsl(220 13% 18%)',
        'text-secondary': 'hsl(220 13% 38%)',
      },
      borderRadius: {
        'lg': '12px',
        'md': '8px',
        'sm': '4px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(220, 13%, 18%, 0.08)',
      },
      spacing: {
        'lg': '24px',
        'md': '16px',
        'sm': '8px',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-in-out',
        'fade-in-fast': 'fadeIn 100ms ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
