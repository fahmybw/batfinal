import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(220 20% 18%)",
        background: "hsl(220 16% 8%)",
        foreground: "hsl(220 10% 92%)",
        muted: "hsl(220 14% 14%)",
        card: "hsl(220 16% 10%)",
        primary: "hsl(210 90% 60%)"
      }
    }
  },
  plugins: []
};

export default config;
