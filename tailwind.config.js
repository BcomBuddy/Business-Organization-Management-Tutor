/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // B.Com Buddy palette
        midnight: '#0F0F1F',
        charcoal: '#181A24',
        gunmetal: '#2E2F36',
        neon: {
          teal: '#00FFD6',
          lime: '#A8FF00',
        },
        amber: '#FF9800',
        brand: {
          600: '#0F0F1F',
          700: '#181A24',
          800: '#2E2F36',
        },
      },
      fontFamily: {
        inter: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon-teal': '0 0 10px rgba(0,255,214,0.6), 0 0 20px rgba(0,255,214,0.4)',
        'neon-lime': '0 0 10px rgba(168,255,0,0.6), 0 0 20px rgba(168,255,0,0.4)',
        'glow-blue': '0 0 15px rgba(59, 130, 246, 0.4), 0 0 30px rgba(59, 130, 246, 0.2)',
        'glow-purple': '0 0 15px rgba(147, 51, 234, 0.4), 0 0 30px rgba(147, 51, 234, 0.2)',
        'glow-soft': '0 0 20px rgba(0, 0, 0, 0.1), 0 0 40px rgba(0, 0, 0, 0.05)',
        'glow-blue-soft': '0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(0,255,214,0.4)' },
          '50%': { boxShadow: '0 0 16px rgba(0,255,214,0.7)' },
        },
        'glow-light': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(59, 130, 246, 0.3), 0 0 30px rgba(59, 130, 246, 0.1)' },
          '50%': { boxShadow: '0 0 25px rgba(59, 130, 246, 0.5), 0 0 50px rgba(59, 130, 246, 0.2)' },
        },
        'glow-soft-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 0, 0, 0.1), 0 0 40px rgba(0, 0, 0, 0.05)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 0, 0, 0.15), 0 0 60px rgba(0, 0, 0, 0.08)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        glow: 'glow 2.5s ease-in-out infinite',
        'glow-light': 'glow-light 3s ease-in-out infinite',
        'glow-soft-pulse': 'glow-soft-pulse 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
