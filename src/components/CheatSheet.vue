<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <div class="container mx-auto px-4 py-8 max-w-5xl">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-2" style="color: #bd93f9; text-shadow: 0 0 20px rgba(189, 147, 249, 0.5);">
          🖥️ Cheatsheet Generator
        </h1>
        <p class="text-lg" style="color: #8be9fd;">Create beautiful terminal-style cheat sheets with Dracula theme</p>
      </div>

      <!-- Input Section -->
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700/50 shadow-xl">
        <label class="block mb-3 font-semibold text-lg" style="color: #ff79c6;">📝 Enter your cheat sheet content:</label>
        <textarea
          v-model="inputText"
          placeholder="Paste your cheat sheet text here with proper indentation..."
          class="w-full h-48 p-4 border border-gray-600 rounded-lg bg-gray-900/80 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
          style="white-space: pre; tab-size: 4; -moz-tab-size: 4;"
        ></textarea>
      </div>

      <!-- Preview Section -->
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700/50 shadow-xl">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold" style="color: #ffb86c;">👀 Live Preview</h2>
          <div class="flex items-center space-x-2 text-sm" style="color: #50fa7b;">
            <div class="w-2 h-2 rounded-full animate-pulse" style="background-color: #50fa7b;"></div>
            <span>Ready to export</span>
          </div>
        </div>

        <!-- iTerm-like Terminal Window -->
        <div id="terminal-window" class="bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-700/50">
          <!-- Window Chrome -->
          <div class="bg-gradient-to-r from-gray-800 to-gray-700 px-4 py-3 flex items-center border-b border-gray-600/50">
            <div class="flex space-x-2">
              <div class="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
              <div class="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
              <div class="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
            </div>
            <div class="flex-1 text-center">
              <span class="text-gray-400 text-sm font-mono">cheatsheet — vamsi@macbook</span>
            </div>
          </div>

          <!-- Terminal Content -->
          <div class="p-6 bg-[#282a36] text-[#f8f8f2] font-mono text-sm leading-relaxed min-h-[400px] max-h-[600px] overflow-auto">
            <div class="mb-3 opacity-75">
              <span class="text-[#50fa7b]">vamsi@macbook</span>
              <span class="text-[#6272a4]">:~</span>
              <span class="text-white">$ </span>
              <span class="text-[#ffb86c]">cheatsheet</span>
            </div>
            <div v-if="formattedText" class="whitespace-pre-wrap break-words" style="white-space: pre-wrap; tab-size: 4; -moz-tab-size: 4; word-break: break-word;" v-html="highlightedPreview"></div>
            <div v-else class="text-[#6272a4] italic text-center py-8">
              <div class="text-2xl mb-2">📋</div>
              # Your cheat sheet will appear here...<br>
              # Paste your content above and see the magic!
            </div>
            <div class="mt-4 opacity-75">
              <span class="text-[#50fa7b]">vamsi@macbook</span>
              <span class="text-[#6272a4]">:~</span>
              <span class="text-white">$ </span>
              <span class="animate-pulse text-[#ffb86c]">█</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Export Section -->
      <div class="text-center">
        <button
          @click="exportAsImage"
          class="font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          style="background: linear-gradient(135deg, #bd93f9 0%, #ff79c6 100%); color: #f8f8f2;"
          :disabled="!inputText.trim()"
        >
          <span class="flex items-center space-x-2">
            <span>📸</span>
            <span>Export as Beautiful PNG</span>
          </span>
        </button>
        <p class="text-sm mt-3" style="color: #6272a4;">High-resolution image with Dracula theme and macOS window style</p>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';

export default {
  data() {
    return {
      inputText: ''
    };
  },
  computed: {
    formattedText() {
      // Preserve all whitespace and indentation
      return this.inputText;
    },
    highlightedPreview() {
      // Apply syntax highlighting to the preview as well
      if (!this.inputText) return '';
      return this.applySyntaxHighlighting(this.inputText);
    }
  },
  methods: {
    // Helper method to apply Dracula syntax highlighting
    applySyntaxHighlighting(text) {
      const lines = text.split('\n');
      return lines.map(line => {
        // Highlight headings (lines starting with #)
        if (line.trim().startsWith('#')) {
          const level = (line.match(/^#+/) || [''])[0].length;
          const colors = ['#bd93f9', '#ff79c6', '#8be9fd', '#ffb86c']; // Purple, Pink, Cyan, Orange
          const color = colors[Math.min(level - 1, colors.length - 1)];
          return `<div style="color: ${color}; font-weight: bold; margin-top: 8px; font-size: ${14 - level * 0.5}px;">${this.escapeHtml(line)}</div>`;
        }
        // Highlight commands (lines containing $ or commands with ` backticks)
        else if (line.includes('$') || line.match(/`[^`]+`/)) {
          let highlightedLine = this.escapeHtml(line);
          
          // Highlight $ prompt
          highlightedLine = highlightedLine.replace(/\$/g, '<span style="color: #50fa7b; font-weight: bold;">$</span>');
          
          // Highlight backtick commands
          highlightedLine = highlightedLine.replace(/`([^`]+)`/g, '<span style="color: #8be9fd; font-weight: 600; background: rgba(98, 114, 164, 0.2); padding: 2px 4px; border-radius: 3px;">$1</span>');
          
          // Highlight common commands at start of line or after $
          highlightedLine = highlightedLine.replace(/(\s|^|\$\s*)(kubectl|docker|npm|yarn|git|cd|ls|cat|grep|awk|sed|curl|wget|ssh|sudo|apt|yum|pip|python|node|java|mvn|gradle|terraform|ansible|helm|make|cargo|rustc|go|bash|zsh|powershell|az|gcloud|aws)(\s+|$)/g, 
            '$1<span style="color: #50fa7b; font-weight: bold;">$2</span>$3');
          
          // Highlight flags/options (--flag or -f)
          highlightedLine = highlightedLine.replace(/(--[\w-]+|-[a-zA-Z])\b/g, '<span style="color: #ffb86c;">$1</span>');
          
          // Highlight strings in quotes
          highlightedLine = highlightedLine.replace(/"([^"]*)"/g, '<span style="color: #f1fa8c;">"$1"</span>');
          highlightedLine = highlightedLine.replace(/'([^']*)'/g, '<span style="color: #f1fa8c;">\'$1\'</span>');
          
          // Highlight numbers
          highlightedLine = highlightedLine.replace(/\b(\d+)\b/g, '<span style="color: #bd93f9;">$1</span>');
          
          // Highlight paths (starting with / or ./ or ~/)
          highlightedLine = highlightedLine.replace(/(\/?[\w.-]+\/[\w./-]+)/g, '<span style="color: #8be9fd;">$1</span>');
          
          return `<div>${highlightedLine}</div>`;
        }
        // Highlight lines with colons (labels/keys) - YAML/JSON style
        else if (line.includes(':') && !line.trim().startsWith('-')) {
          let highlightedLine = this.escapeHtml(line);
          // Match key: value pattern
          highlightedLine = highlightedLine.replace(/^(\s*)([^:]+)(:)(.*)$/g, 
            '$1<span style="color: #ff79c6; font-weight: 600;">$2</span><span style="color: #f8f8f2;">$3</span><span style="color: #f1fa8c;">$4</span>');
          return `<div>${highlightedLine}</div>`;
        }
        // Highlight list items (starting with - or *)
        else if (line.trim().match(/^[-*•]\s/)) {
          let highlightedLine = this.escapeHtml(line);
          highlightedLine = highlightedLine.replace(/^(\s*)([-*•])(\s+)(.*)$/, 
            '$1<span style="color: #50fa7b; font-weight: bold;">$2</span>$3<span style="color: #f8f8f2;">$4</span>');
          return `<div>${highlightedLine}</div>`;
        }
        // Highlight comments (lines starting with // or #)
        else if (line.trim().match(/^(\/\/|#)/)) {
          return `<div style="color: #6272a4; font-style: italic;">${this.escapeHtml(line)}</div>`;
        }
        // Highlight lines with = (assignments)
        else if (line.includes('=') && !line.trim().startsWith('-')) {
          let highlightedLine = this.escapeHtml(line);
          highlightedLine = highlightedLine.replace(/^(\s*)([^=]+)(=)(.*)$/g, 
            '$1<span style="color: #ff79c6;">$2</span><span style="color: #f8f8f2;">$3</span><span style="color: #f1fa8c;">$4</span>');
          return `<div>${highlightedLine}</div>`;
        }
        // Default color for regular text
        return `<div style="color: #f8f8f2;">${this.escapeHtml(line)}</div>`;
      }).join('');
    },
    
    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },
    
    async exportAsImage() {
      if (!this.inputText.trim()) return;

      // Create a temporary element with beautiful Dracula-themed styling
      const tempElement = document.createElement('div');
      tempElement.style.cssText = `
        position: absolute;
        left: -9999px;
        top: -9999px;
        background: linear-gradient(135deg, #282a36 0%, #21222c 100%);
        color: #f8f8f2;
        font-family: 'Fira Code', 'JetBrains Mono', 'Source Code Pro', 'Monaco', 'Menlo', monospace;
        font-size: 13px;
        line-height: 1.6;
        white-space: pre-wrap;
        tab-size: 4;
        -moz-tab-size: 4;
        word-break: break-word;
        padding: 50px 25px 25px 25px;
        border-radius: 12px;
        width: fit-content;
        min-width: 500px;
        max-width: 1200px;
        box-sizing: border-box;
        position: relative;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        border: 1px solid #44475a;
      `;

      // Add macOS-style window controls (traffic light buttons) with better styling
      const controlsDiv = document.createElement('div');
      controlsDiv.style.cssText = `
        position: absolute;
        top: 15px;
        left: 15px;
        display: flex;
        gap: 10px;
        z-index: 10;
      `;

      // Red close button with shadow
      const redButton = document.createElement('div');
      redButton.style.cssText = `
        width: 14px;
        height: 14px;
        background: linear-gradient(135deg, #ff5f57 0%, #ff3b30 100%);
        border-radius: 50%;
        border: 1px solid #cc4c46;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      `;

      // Yellow minimize button with shadow
      const yellowButton = document.createElement('div');
      yellowButton.style.cssText = `
        width: 14px;
        height: 14px;
        background: linear-gradient(135deg, #ffbd2e 0%, #ffb700 100%);
        border-radius: 50%;
        border: 1px solid #cc9600;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      `;

      // Green maximize button with shadow
      const greenButton = document.createElement('div');
      greenButton.style.cssText = `
        width: 14px;
        height: 14px;
        background: linear-gradient(135deg, #28ca42 0%, #00c853 100%);
        border-radius: 50%;
        border: 1px solid #1e9e33;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      `;

      controlsDiv.appendChild(redButton);
      controlsDiv.appendChild(yellowButton);
      controlsDiv.appendChild(greenButton);
      tempElement.appendChild(controlsDiv);

      // Add a subtle title bar
      const titleBar = document.createElement('div');
      titleBar.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 40px;
        background: linear-gradient(90deg, #21222c 0%, #282a36 50%, #21222c 100%);
        border-radius: 12px 12px 0 0;
        border-bottom: 1px solid #44475a;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      const titleText = document.createElement('span');
      titleText.style.cssText = `
        color: #6272a4;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.5px;
      `;
      titleText.textContent = 'cheatsheet — vamsi@macbook';
      titleBar.appendChild(titleText);
      tempElement.appendChild(titleBar);

      // Add the text content with syntax highlighting
      const textDiv = document.createElement('div');
      textDiv.style.cssText = `
        margin-top: 10px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        white-space: pre-wrap;
        tab-size: 4;
        -moz-tab-size: 4;
      `;
      textDiv.innerHTML = this.applySyntaxHighlighting(this.formattedText);
      tempElement.appendChild(textDiv);

      // Add a subtle footer with attribution
      const footer = document.createElement('div');
      footer.style.cssText = `
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid #44475a;
        text-align: center;
        color: #6272a4;
        font-size: 10px;
        opacity: 0.7;
      `;
      footer.textContent = 'Created with ❤️ by Vamsi Penmetsa';
      tempElement.appendChild(footer);

      // Add to DOM temporarily
      document.body.appendChild(tempElement);

      try {
        // Wait for fonts and layout to settle
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const canvas = await html2canvas(tempElement, {
          backgroundColor: 'transparent',
          scale: 2, // Higher resolution
          useCORS: true,
          allowTaint: true,
          logging: false
        });

        // Create download link
        const link = document.createElement('a');
        link.download = 'cheatsheet.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error('Error exporting image:', error);
        alert('Error exporting image. Please try again.');
      } finally {
        // Remove temporary element
        document.body.removeChild(tempElement);
      }
    }
  }
};
</script>

<style scoped>
/* Dracula theme colors are applied inline for better control */
/* Ensure monospace font is used */
.font-mono {
  font-family: 'Fira Code', 'Source Code Pro', 'Monaco', 'Menlo', monospace;
}

/* Ensure proper whitespace handling */
pre, .whitespace-pre-wrap {
  white-space: pre-wrap !important;
  tab-size: 4;
  -moz-tab-size: 4;
  word-break: break-word;
}

/* Ensure textarea preserves whitespace */
textarea {
  white-space: pre-wrap;
  tab-size: 4;
  -moz-tab-size: 4;
}
</style>