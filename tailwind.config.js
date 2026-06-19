/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1440px',
      },
    },
    extend: {
      fontFamily: {
        display: ['Outfit', 'Noto Sans SC', 'sans-serif'],
        body: ['Noto Sans SC', 'Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: {
          50: '#FFF5F5',
          100: '#FFE8E5',
          200: '#FFCDBF',
          300: '#FFA58A',
          400: '#FF826B',
          500: '#FF6B6B',
          600: '#E85555',
          700: '#C23E3E',
          800: '#8B2A2A',
          900: '#5A1A1A',
        },
        cream: {
          50: '#FFFBF5',
          100: '#FFF6EC',
          200: '#FFEAD4',
        },
        category: {
          birthday: '#FF8FAB',
          anniversary: '#FFD93D',
          exam: '#6BCB77',
          travel: '#4D96FF',
          salary: '#6BCB77',
          deadline: '#9B59B6',
          custom: '#FF6B6B',
        },
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '28px',
        '4xl': '36px',
      },
      boxShadow: {
        'soft': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 16px 48px rgba(0, 0, 0, 0.12)',
        'soft-xl': '0 24px 64px rgba(0, 0, 0, 0.16)',
        'glow': '0 0 40px rgba(255, 107, 107, 0.35)',
        'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FF6B6B 0%, #FFA07A 100%)',
        'gradient-warm': 'linear-gradient(135deg, #FFFBF5 0%, #FFF0E6 50%, #FFE5D4 100%)',
        'gradient-cool': 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 50%, #BAE6FD 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #FF6B6B 0%, #FFA07A 30%, #FFD93D 70%, #F7DC6F 100%)',
        'gradient-festival': 'linear-gradient(135deg, #FF6B6B 0%, #E74C3C 25%, #FFD93D 50%, #F39C12 75%, #9B59B6 100%)',
        'gradient-business': 'linear-gradient(135deg, #2C3E50 0%, #34495E 50%, #4D96FF 100%)',
      },
    },
  },
  plugins: [],
};
