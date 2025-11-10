# Cheatsheet Generator

A beautiful Vue.js application for generating geeky cheat sheet images with an authentic iTerm-style terminal interface. Features Dracula theme colors and macOS window controls for that perfect terminal screenshot look.

## ✨ Features

- **iTerm-style Interface**: Authentic terminal appearance with Dracula theme
- **macOS Window Controls**: Red, yellow, and green dots just like macOS terminals
- **Image Export**: Generate PNG images of your cheat sheets
- **Perfect Indentation**: Preserves all spacing and formatting
- **Responsive Design**: Works on all devices
- **GitHub Pages Hosted**: Live demo available online

## 🚀 Live Demo

Visit the live application: [https://vamsipenmetsa.github.io/cheatsheet-generator](https://vamsipenmetsa.github.io/cheatsheet-generator)

## 📋 Usage

1. **Input your cheat sheet content** in the textarea
2. **See the live preview** in the terminal-style interface
3. **Click "Export Text as PNG Image"** to download your formatted cheat sheet
4. **Share your geeky cheat sheets** with the perfect terminal aesthetic!

## 🛠️ Local Development

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vamsipenmetsa/cheatsheet-generator.git
   cd cheatsheet-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run serve
   ```

4. Open your browser and visit `http://localhost:8080`

## 🚀 Deployment

### Automatic Deployment (GitHub Pages)

The project is configured for automatic deployment to GitHub Pages:

1. Push changes to the `main` branch
2. GitHub Actions will automatically build and deploy
3. Your changes will be live at: https://vamsipenmetsa.github.io/cheatsheet-generator

### Manual Deployment

```bash
npm run build
npm run deploy
```

## 🎨 Features in Detail

- **Dracula Theme**: Dark background (#282a36) with bright text (#f8f8f2)
- **Monospace Font**: Fira Code for authentic terminal appearance
- **Window Controls**: macOS-style traffic light buttons
- **High-Quality Export**: 2x resolution PNG images
- **Responsive Layout**: Adapts to different screen sizes

## 📁 Project Structure

```
cheatsheet-generator/
├── public/
│   └── index.html
├── src/
│   ├── App.vue
│   ├── main.js
│   ├── components/
│   │   └── CheatSheet.vue
│   └── assets/
│       └── styles.css
├── .github/
│   └── workflows/
│       └── deploy.yml
├── vue.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Vue.js and Tailwind CSS
- Inspired by iTerm2 and modern terminal aesthetics
- Dracula theme colors
- html2canvas for image export

---

**Created by @VamsiPenmetsa**