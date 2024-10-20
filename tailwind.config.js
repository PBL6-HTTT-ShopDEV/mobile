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
      gray:'#707B81',
      'black-60': 'rgba(0, 0, 0, 0.6)',
    },
    extend: {
      fontFamily: {
        'vollkorn-regular': ['Vollkorn-Regular'],
        'vollkorn-medium': ['Vollkorn-Medium'],
        'vollkorn-semibold': ['Vollkorn-SemiBold'],
        'vollkorn-bold': ['Vollkorn-Bold'],
        'vollkorn-italic': ['Vollkorn-Italic'],
      },
      borderRadius: {
        'text-input': '12px',
        'button': '12px',
        'card': '20px',
      },
    },
  },
  plugins: [],
}

