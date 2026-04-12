/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sand: {
          50: "#fcfaf5",
          100: "#f5f0e6",
          200: "#e6dccb",
          300: "#d6c5ac"
        },
        ink: {
          950: "#171411"
        },
        ember: {
          300: "#f5a36a",
          400: "#f08b48",
          500: "#d96d2d"
        }
      },
      boxShadow: {
        diffusion: "0 24px 80px -40px rgba(42, 28, 18, 0.35)",
        panel: "0 14px 40px -28px rgba(47, 31, 20, 0.25)"
      },
      fontFamily: {
        display: ['"Space Grotesk"', "ui-sans-serif", "system-ui", "sans-serif"],
        body: ['"Outfit"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "SFMono-Regular", "monospace"]
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -8px, 0)" }
        }
      },
      animation: {
        shimmer: "shimmer 3s linear infinite",
        drift: "drift 6s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
