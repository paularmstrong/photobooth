'use strict';

module.exports = {
  content: ['./src/**/*.{html,ts,tsx}'],
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      backgroundColor: ['selection'],
      textColor: ['selection'],
    },
  },
  plugins: ['tailwindcss-selection-variant'],
};
