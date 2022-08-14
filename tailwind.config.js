module.exports = {
  content: ['./packages/renderer/src/**/*.{html,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Yanone Kaffeesatz', 'sans-serif'],
      },
      fontSize: {
        dynamic: 'clamp(6rem, 0.4615rem + 18.4615vw, 30rem)',
      },
      animation: {
        'bounce-slow': 'bounce-slow 3s infinite',
        flap0: 'flap0 0.5s 1',
        flap1: 'flap1 0.5s 1',
        flap2: 'flap2 0.5s 1',
        flap3: 'flap3 0.5s 1',
        flap4: 'flap4 0.5s 1',
        flap5: 'flap5 0.5s 1',
      },
      keyframes: {
        'bounce-slow': {
          '0%, 100%': {
            transform: 'translateY(-10%)',
            'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        flap0: {
          '48%, 52%': {
            transform: 'rotate(-0.25turn) rotate(0) skewX(30deg) translateX(0%) translateY(0%)',
            'animation-timing-function': 'cubic-bezier(0.5, 0, 0.5, 1)',
          },
        },
        flap1: {
          '48%, 52%': {
            transform: 'rotate(-0.25turn) rotate(calc(1turn * 0.16666667)) skewX(30deg) translateX(0%) translateY(0%)',
            'animation-timing-function': 'cubic-bezier(0.5, 0, 0.5, 1)',
          },
        },
        flap2: {
          '48%, 52%': {
            transform: 'rotate(-0.25turn) rotate(calc(1turn * 0.33333333)) skewX(30deg) translateX(0%) translateY(0%)',
            'animation-timing-function': 'cubic-bezier(0.5, 0, 0.5, 1)',
          },
        },
        flap3: {
          '48%, 52%': {
            transform: 'rotate(-0.25turn) rotate(calc(0.5turn)) skewX(30deg) translateX(0%) translateY(0%)',
            'animation-timing-function': 'cubic-bezier(0.5, 0, 0.5, 1)',
          },
        },
        flap4: {
          '48%, 52%': {
            transform: 'rotate(-0.25turn) rotate(calc(1turn * 0.66666667)) skewX(30deg) translateX(0%) translateY(0%)',
            'animation-timing-function': 'cubic-bezier(0.5, 0, 0.5, 1)',
          },
        },
        flap5: {
          '48%, 52%': {
            transform: 'rotate(-0.25turn) rotate(calc(1turn * 0.83333333)) skewX(30deg) translateX(0%) translateY(0%)',
            'animation-timing-function': 'cubic-bezier(0.5, 0, 0.5, 1)',
          },
        },
      },
    },
  },
};
