/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#d32f2f',
          darkRed: '#b71c1c',
          crimson: '#c8102e',
          deepCrimson: '#991b1b',
          gold: '#ffb300',
          yellow: '#f59e0b',
          charcoal: '#1e293b',
          lightRose: '#fff1f1'
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif']
      }
    },
  },
  plugins: [],
}
