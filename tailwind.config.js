/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    extend: {
      screens: {
        'mobile': '640px',
        'tablet': '768px',
        'desktop': '1440px',
      },
      colors: {
        cPurple: '#AD1FEA',
        blue: '#4661E6',
        darkBlue: '#373F68',
        white: '#ffffff',
        darkGray: '#F2F4FF',
        gray: '#F7F8FD',
        darkBlueGray: '#3A4374',
        lightBlueGray: '#647196',
        peach: '#F49F85',
        lightBlue: '#62BCFA',
        cRed: '#D73737',
        purpleHover: '#C75AF6',
        blueHover: '#7C91F9',
        darkBlueHover: '#656EA3',
        redHover: '#E98888',
      },
      fontFamily: {
        sans: ['var(--font-jost)', ...fontFamily.sans]
      }
    },
  },
  plugins: [],
};
