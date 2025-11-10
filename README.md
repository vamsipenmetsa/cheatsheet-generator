# Vue Tailwind Cheat Sheet

## Overview
This project is a simple Vue.js application styled with Tailwind CSS, designed to serve as a minimalistic cheat sheet. It features a dark Dracula-themed interface for inputting text and displaying it in a geeky format.

## Features
- Text input for user entries
- Display of formatted text in a dark theme
- Responsive design using Tailwind CSS

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd vue-tailwind-cheatsheet
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the development server:
   ```
   npm run serve
   ```

2. Open your browser and go to `http://localhost:8080` to view the application.

## Project Structure
```
vue-tailwind-cheatsheet
├── public
│   └── index.html          # Main HTML file
├── src
│   ├── App.vue             # Root Vue component
│   ├── main.js             # Entry point of the application
│   ├── components
│   │   └── CheatSheet.vue  # Component for input and display
│   └── assets
│       └── styles.css      # Custom styles
├── package.json            # NPM configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── README.md               # Project documentation
```

## License
This project is open-source and available under the MIT License.