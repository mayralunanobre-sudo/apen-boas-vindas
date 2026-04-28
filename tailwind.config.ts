import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'apen-dark': '#162040',
        'apen-medium': '#1e3260',
        'apen-light': '#2b4a8a',
        'sticky': '#fffacd',
      },
      fontFamily: {
        cursive: ['Dancing Script', 'cursive'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
