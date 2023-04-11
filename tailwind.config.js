/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  corePlugins: {
    textOpacity: false,
    backgroundOpacity: false,
    borderOpacity: false
  },
  theme: {
    extend: {
      borderColor: {
        DEFAULT: 'var(--border-color)'
      },
      screens: {
        xs: '375px'
      },
      colors: {
        // Theme colors
        black: '#101010'
      },
      maxWidth: {
        '8xl': '90rem'
      }
    }
  },
  variants: {},
  plugins: []
};
