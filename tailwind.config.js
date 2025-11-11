module.exports = {
  purge: {
    content: ['./public/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    safelist: [
      // Safelist dynamic colors to prevent purging
      { pattern: /text-\[#.*\]/ },
      { pattern: /bg-\[#.*\]/ },
      { pattern: /border-\[#.*\]/ },
    ]
  },
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
        green: '#50fa7b', // Dracula green color
        dracula: {
          bg: '#282a36',
          'bg-dark': '#21222c',
          current: '#44475a',
          fg: '#f8f8f2',
          comment: '#6272a4',
          cyan: '#8be9fd',
          green: '#50fa7b',
          orange: '#ffb86c',
          pink: '#ff79c6',
          purple: '#bd93f9',
          red: '#ff5555',
          yellow: '#f1fa8c',
        }
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