/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        "proxima-nova": ['"Mark Simonson - Proxima Nova"', "sans-serif"],
        "proxima-nova-bold": [
          '"Mark Simonson - Proxima Nova Bold"',
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
