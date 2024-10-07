/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      blue:'#24ABEC',
      white:'#FFFFFF',
      black:'#000000',
      red:'#EC4824',
      'light-gray':'#434D6B',
      gray:'#707B81'
    },
    extend: {
      borderRadius: {
        'text-input': '12px',
      },
    },
  },
  plugins: [],
}

