/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fothang: {
          red: {
            50: "#fdf3f3",
            100: "#fbe6e6",
            200: "#f8d0d0",
            300: "#f1aeae",
            400: "#e67d7d",
            500: "#d94b4b",
            600: "#c23333",
            700: "#9e2222",
            800: "#831f1f",
            900: "#6e1c1c",
            950: "#450c0c",
          },
          gold: {
            50: "#fffdf5",
            100: "#fef9e7",
            200: "#fdf0c3",
            300: "#fbe495",
            400: "#f8d05b",
            500: "#d49b28",
            600: "#b5791c",
            700: "#8e5717",
            800: "#754518",
            900: "#633917",
          },
          ivory: "#faf7f2",
          cream: "#f4eee4",
          sand: "#e7dccf",
          dark: "#1c1815",
          charcoal: "#292420",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cinzel", "Georgia", "serif"],
        chinese: ["var(--font-noto-serif-sc)", "STSong", "SimSun", "serif"],
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "float-slow": "float-slow 4s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "spin-slow": "spin-slow 20s linear infinite",
        "fade-in": "fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};
