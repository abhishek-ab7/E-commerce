/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1', // Indigo
        secondary: '#A78BFA', // Violet
        accent: '#06B6D4', // Teal
        background: '#F9FAFB',
        surface: '#FFFFFF',
        muted: '#F3F4F6',
        dark: '#18181B',
        glass: 'rgba(255,255,255,0.7)',
        'glass-dark': 'rgba(24,24,27,0.7)',
      },
      boxShadow: {
        'soft': '0 2px 8px 0 rgba(99,102,241,0.08)',
        'glass': '0 8px 32px 0 rgba(31, 41, 55, 0.18)',
        'elevated': '0 4px 24px 0 rgba(99,102,241,0.12)',
      },
      borderRadius: {
        'xl': '1.25rem',
        '2xl': '1.5rem',
        'glass': '2rem',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(40px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        bounceIn: {
          '0%, 100%': { transform: 'scale(0.95)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.7s ease-in-out',
        slideUp: 'slideUp 0.6s cubic-bezier(0.4,0,0.2,1)',
        bounceIn: 'bounceIn 0.5s',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
};

