import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette for the demo "TaxRate" product.
        brand: {
          50: "#eef4ff",
          100: "#d9e6ff",
          500: "#2f6bff",
          600: "#1f56e6",
          700: "#1a45b8",
          900: "#12275c",
        },
        ink: "#0b1220",
      },
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
