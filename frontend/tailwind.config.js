/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'rgb(var(--card) / <alpha-value>)',
          foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
        },
        border: 'rgb(var(--border) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
        },
        ring: 'rgb(var(--ring) / <alpha-value>)',
        cyber: {
          blue: {
            50: '#ebf5ff',
            100: '#d6ebff',
            200: '#adcfff',
            300: '#85b3ff',
            400: '#5c98ff',
            500: '#337cff',
            600: '#0059f5',
            700: '#0043bd', // Royal Blue
            800: '#002e85',
            900: '#00194d',
          },
          dark: {
            bg: '#0a0b0d',
            card: '#12141c',
            border: '#1f222e',
            accent: '#0043bd'
          }
        }
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(to bottom, rgb(var(--background)), rgb(var(--card)))',
        'blue-glow': 'radial-gradient(circle, rgba(var(--accent),0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-highlight': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'neon-blue': '0 0 15px rgba(var(--accent), 0.5)',
      },
      animation: {
        'scan': 'scan 3s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar': 'radar 4s linear infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0%)', opacity: 0.8 },
          '50%': { transform: 'translateY(100%)', opacity: 0.3 }
        },
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      }
    },
  },
  plugins: [],
}
