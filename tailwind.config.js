/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': {
          50: '#e6f0e6',
          100: '#c2d9c2',
          200: '#9bc09b',
          300: '#73a773',
          400: '#4d944d',
          500: '#2b802b',
          600: '#1a5c1a',
          700: '#012d01', // Deep green (primary)
          800: '#002200',
          900: '#001100',
        },
        'secondary': {
          50: '#fff9e6',
          100: '#ffefcc',
          200: '#ffe4b3',
          300: '#ffda99',
          400: '#ffd080',
          500: '#ffc107', // Gold accent
          600: '#e6ac00',
          700: '#cc9900',
          800: '#b38600',
          900: '#997300',
        },
        'background': '#E3F9F5', // Soft background
        'text': '#333333', // Text color
        'success': '#10B981',
        'warning': '#F59E0B',
        'error': '#EF4444',
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      backdropBlur: {
        'glass': '8px',
      },
    },
  },
  plugins: [],
};