/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          gold: "var(--luxury-gold)",
          "gold-light": "var(--luxury-gold-light)",
          "gold-dark": "var(--luxury-gold-dark)",
          charcoal: "var(--luxury-charcoal)",
          pearl: "var(--luxury-pearl)",
          sand: "var(--luxury-sand)",
          blush: "var(--luxury-blush)",
        }
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        playfair: ["'Playfair Display'", "serif"],
        montserrat: ["Montserrat", "sans-serif"],
        outfit: ["Outfit", "sans-serif"],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
