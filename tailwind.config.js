module.exports = {
  purge: ['./public/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class', // Enable dark mode
  theme: {
    extend: {
      colors: {
        background: '#282a36', // Dracula background color
        foreground: '#f8f8f2', // Dracula foreground color
        comment: '#6272a4', // Dracula comment color
        cyan: '#8be9fd', // Dracula cyan color
        pink: '#ff79c6', // Dracula pink color
        orange: '#ffb86c', // Dracula orange color
        yellow: '#f1fa8c', // Dracula yellow color
        purple: '#bd93f9', // Dracula purple color
      },
      fontFamily: {
        mono: ['Fira Code', 'monospace'], // Monospace font for code
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};