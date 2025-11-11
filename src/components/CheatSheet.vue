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
          <div class="p-6 bg-[#282a36] text-[#f8f8f2] font-mono text-sm leading-relaxed min-h-[400px] max-h-[600px] overflow-auto relative">
            <!-- Watermark Background -->
            <div class="absolute inset-0 pointer-events-none overflow-hidden">
              <div class="watermark-container">
                <div class="watermark-text">@VamsiPenmetsa</div>
                <div class="watermark-text">@VamsiPenmetsa</div>
                <div class="watermark-text">@VamsiPenmetsa</div>
                <div class="watermark-text">@VamsiPenmetsa</div>
                <div class="watermark-text">@VamsiPenmetsa</div>
                <div class="watermark-text">@VamsiPenmetsa</div>
              </div>
            </div>
            <div class="mb-3 opacity-75 relative z-10">
              <span class="text-[#50fa7b]">vamsi@macbook</span>
              <span class="text-[#6272a4]">:~</span>
              <span class="text-white">$ </span>
              <span class="text-[#ffb86c]">cheatsheet</span>
            </div>
            <div v-if="formattedText" class="whitespace-pre-wrap break-words relative z-10" style="white-space: pre-wrap; tab-size: 4; -moz-tab-size: 4; word-break: break-word;">
              <div v-for="(line, index) in highlightedLines" :key="index" :class="line.class" v-html="line.html"></div>
            </div>
            <div v-else class="text-[#6272a4] italic text-center py-8 relative z-10">
              <div class="text-2xl mb-2">📋</div>
              # Your cheat sheet will appear here...<br>
              # Paste your content above and see the magic!
            </div>
            <div class="mt-4 opacity-75 relative z-10">
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
    },
    highlightedLines() {
      // Return array of line objects for proper Vue rendering
      if (!this.inputText) return [];
      return this.getHighlightedLines(this.inputText);
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
    
    // Generate HTML with inline styles for export (html2canvas needs inline styles)
    getExportHighlightedHTML(text) {
      const lines = text.split('\n');
      return lines.map(line => {
        // Highlight headings (lines starting with #)
        if (line.trim().startsWith('#')) {
          const level = (line.match(/^#+/) || [''])[0].length;
          const styles = [
            'color: #bd93f9; font-weight: bold; margin-top: 16px; margin-bottom: 8px; font-size: 15px; text-shadow: 0 0 10px rgba(189, 147, 249, 0.5); border-bottom: 2px solid rgba(189, 147, 249, 0.3); padding-bottom: 6px; line-height: 1.4;',
            'color: #ff79c6; font-weight: bold; margin-top: 14px; margin-bottom: 6px; font-size: 14px; text-shadow: 0 0 8px rgba(255, 121, 198, 0.4); line-height: 1.4;',
            'color: #8be9fd; font-weight: bold; margin-top: 12px; margin-bottom: 4px; font-size: 13.5px; text-shadow: 0 0 6px rgba(139, 233, 253, 0.3); line-height: 1.4;',
            'color: #ffb86c; font-weight: bold; margin-top: 10px; margin-bottom: 3px; font-size: 13px; line-height: 1.4;'
          ];
          const style = styles[Math.min(level - 1, styles.length - 1)];
          return `<div style="${style}">${this.escapeHtml(line)}</div>`;
        }
        // Highlight commands
        else if (line.includes('$') || line.match(/`[^`]+`/)) {
          let highlightedLine = this.escapeHtml(line);
          
          highlightedLine = highlightedLine.replace(/\$/g, '<span style="color: #50fa7b; font-weight: bold; text-shadow: 0 0 5px rgba(80, 250, 123, 0.3);">$</span>');
          highlightedLine = highlightedLine.replace(/`([^`]+)`/g, '<span style="color: #8be9fd; font-weight: 600; background: linear-gradient(135deg, rgba(139, 233, 253, 0.15), rgba(98, 114, 164, 0.15)); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(139, 233, 253, 0.3); box-shadow: 0 0 8px rgba(139, 233, 253, 0.2);">$1</span>');
          highlightedLine = highlightedLine.replace(/(\s|^|\$\s*)(kubectl|docker|npm|yarn|git|cd|ls|cat|grep|awk|sed|curl|wget|ssh|sudo|apt|yum|pip|python|node|java|mvn|gradle|terraform|ansible|helm|make|cargo|rustc|go|bash|zsh|powershell|az|gcloud|aws|ng|vue|react|vite|jest|mocha|pytest|cargo|composer|bundle)(\s+|$)/g, 
            '$1<span style="color: #50fa7b; font-weight: bold; text-shadow: 0 0 5px rgba(80, 250, 123, 0.3);">$2</span>$3');
          highlightedLine = highlightedLine.replace(/(kubectl|docker|git|npm|yarn|az|gcloud|aws)\s+<\/span>\s*(\w+)/g, 
            '$1 </span><span style="color: #8be9fd;">$2</span>');
          highlightedLine = highlightedLine.replace(/(--[\w-]+|-[a-zA-Z])\b/g, '<span style="color: #ffb86c; font-weight: 500; text-shadow: 0 0 5px rgba(255, 184, 108, 0.2);">$1</span>');
          highlightedLine = highlightedLine.replace(/(\s)(=|&gt;|&lt;|\||&amp;&amp;|\|\||&amp;)(\s)/g, '$1<span style="color: #ff79c6; font-weight: bold; padding: 0 2px;">$2</span>$3');
          highlightedLine = highlightedLine.replace(/([{\[\(])/g, '<span style="color: #f8f8f2; font-weight: bold;">$1</span>');
          highlightedLine = highlightedLine.replace(/([}\]\)])/g, '<span style="color: #f8f8f2; font-weight: bold;">$1</span>');
          highlightedLine = highlightedLine.replace(/"([^"]*)"/g, '<span style="color: #f1fa8c; font-style: italic; text-shadow: 0 0 5px rgba(241, 250, 140, 0.2);">"$1"</span>');
          highlightedLine = highlightedLine.replace(/'([^']*)'/g, '<span style="color: #f1fa8c; font-style: italic; text-shadow: 0 0 5px rgba(241, 250, 140, 0.2);">\'$1\'</span>');
          highlightedLine = highlightedLine.replace(/\b(0x[0-9a-fA-F]+|\d+\.?\d*)\b/g, '<span style="color: #bd93f9; font-weight: 600;">$1</span>');
          highlightedLine = highlightedLine.replace(/\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/g, '<span style="color: #8be9fd;">$1</span>');
          highlightedLine = highlightedLine.replace(/(https?:\/\/[^\s]+)/g, '<span style="color: #8be9fd; text-decoration: underline; text-decoration-color: rgba(139, 233, 253, 0.3);">$1</span>');
          highlightedLine = highlightedLine.replace(/(\/?[\w.-]+\/[\w./-]+)/g, '<span style="color: #8be9fd; text-decoration: underline; text-decoration-color: rgba(139, 233, 253, 0.3); text-underline-offset: 2px;">$1</span>');
          highlightedLine = highlightedLine.replace(/(\$[A-Z_][A-Z0-9_]*)/g, '<span style="color: #8be9fd;">$1</span>');
          
          return `<div style="color: #f8f8f2; line-height: 1.8; margin-bottom: 2px; padding-left: 4px;">${highlightedLine}</div>`;
        }
        // Highlight YAML/JSON keys
        else if (line.includes(':') && !line.trim().startsWith('-')) {
          let highlightedLine = this.escapeHtml(line);
          highlightedLine = highlightedLine.replace(/^(\s*)([^:]+)(:)(.*)$/g, 
            '$1<span style="color: #ff79c6; font-weight: 700; text-shadow: 0 0 5px rgba(255, 121, 198, 0.3);">$2</span><span style="color: #f8f8f2;">$3</span><span style="color: #f1fa8c; margin-left: 6px;">$4</span>');
          return `<div style="line-height: 1.8; margin-bottom: 2px;">${highlightedLine}</div>`;
        }
        // Highlight list items
        else if (line.trim().match(/^[-*•]\s/)) {
          let highlightedLine = this.escapeHtml(line);
          highlightedLine = highlightedLine.replace(/^(\s*)([-*•])(\s+)(.*)$/, 
            '$1<span style="color: #50fa7b; font-weight: bold; font-size: 16px; margin-right: 4px;">$2</span><span style="padding-left: 4px;"></span><span style="color: #f8f8f2;">$4</span>');
          return `<div style="line-height: 1.9; margin-bottom: 3px;">${highlightedLine}</div>`;
        }
        // Highlight comments
        else if (line.trim().match(/^(\/\/|#)/)) {
          return `<div style="color: #6272a4; font-style: italic; opacity: 0.8; line-height: 1.7; margin-bottom: 2px;">${this.escapeHtml(line)}</div>`;
        }
        // Highlight assignments
        else if (line.includes('=') && !line.trim().startsWith('-')) {
          let highlightedLine = this.escapeHtml(line);
          highlightedLine = highlightedLine.replace(/^(\s*)([^=]+)(=)(.*)$/g, 
            '$1<span style="color: #ff79c6; font-weight: 700;">$2</span><span style="color: #f8f8f2; padding: 0 4px;">$3</span><span style="color: #f1fa8c;">$4</span>');
          return `<div style="line-height: 1.8; margin-bottom: 2px;">${highlightedLine}</div>`;
        }
        // Special keywords
        else if (line.match(/\b(ERROR|FAIL|FAILED|FAILURE)\b/i)) {
          let highlightedLine = this.escapeHtml(line);
          highlightedLine = highlightedLine.replace(/\b(ERROR|FAIL|FAILED|FAILURE)\b/gi, '<span style="color: #ff5555; font-weight: bold; padding: 2px 6px; background: rgba(255, 85, 85, 0.15); border-radius: 3px;">$1</span>');
          return `<div style="color: #f8f8f2; line-height: 1.8; margin-bottom: 3px; padding-left: 4px;">${highlightedLine}</div>`;
        }
        else if (line.match(/\b(SUCCESS|PASS|PASSED|OK|DONE)\b/i)) {
          let highlightedLine = this.escapeHtml(line);
          highlightedLine = highlightedLine.replace(/\b(SUCCESS|PASS|PASSED|OK|DONE)\b/gi, '<span style="color: #50fa7b; font-weight: bold; padding: 2px 6px; background: rgba(80, 250, 123, 0.15); border-radius: 3px;">$1</span>');
          return `<div style="color: #f8f8f2; line-height: 1.8; margin-bottom: 3px; padding-left: 4px;">${highlightedLine}</div>`;
        }
        else if (line.match(/\b(WARNING|WARN|CAUTION|DEPRECATED)\b/i)) {
          let highlightedLine = this.escapeHtml(line);
          highlightedLine = highlightedLine.replace(/\b(WARNING|WARN|CAUTION|DEPRECATED)\b/gi, '<span style="color: #ffb86c; font-weight: bold; padding: 2px 6px; background: rgba(255, 184, 108, 0.15); border-radius: 3px;">$1</span>');
          return `<div style="color: #f8f8f2; line-height: 1.8; margin-bottom: 3px; padding-left: 4px;">${highlightedLine}</div>`;
        }
        else if (line.match(/\b(INFO|NOTE|TIP|HINT)\b/i)) {
          let highlightedLine = this.escapeHtml(line);
          highlightedLine = highlightedLine.replace(/\b(INFO|NOTE|TIP|HINT)\b/gi, '<span style="color: #8be9fd; font-weight: 600; padding: 2px 6px; background: rgba(139, 233, 253, 0.15); border-radius: 3px;">$1</span>');
          return `<div style="color: #f8f8f2; line-height: 1.8; margin-bottom: 3px; padding-left: 4px;">${highlightedLine}</div>`;
        }
        // Default with backticks and CAPS highlighting
        else {
          let highlightedLine = this.escapeHtml(line);
          highlightedLine = highlightedLine.replace(/`([^`]+)`/g, '<span style="color: #8be9fd; font-weight: 600; background: linear-gradient(135deg, rgba(139, 233, 253, 0.15), rgba(98, 114, 164, 0.15)); padding: 3px 7px; border-radius: 4px; border: 1px solid rgba(139, 233, 253, 0.3);">$1</span>');
          highlightedLine = highlightedLine.replace(/\b([A-Z][A-Z0-9_]{2,})\b/g, '<span style="color: #8be9fd; font-weight: 600;">$1</span>');
          return `<div style="color: #f8f8f2; line-height: 1.8; margin-bottom: 2px; padding-left: 4px;">${highlightedLine}</div>`;
        }
      }).join('');
    },
    
    getHighlightedLines(text) {
      const lines = text.split('\n');
      return lines.map(line => {
        // Highlight headings (lines starting with #)
        if (line.trim().startsWith('#')) {
          const level = (line.match(/^#+/) || [''])[0].length;
          const className = `hl-heading-${Math.min(level, 4)}`;
          return {
            class: className,
            html: this.escapeHtml(line)
          };
        }
        // Highlight commands (lines containing $ or commands with ` backticks)
        else if (line.includes('$') || line.match(/`[^`]+`/)) {
          let highlightedLine = this.escapeHtml(line);
          
          // Highlight $ prompt
          highlightedLine = highlightedLine.replace(/\$/g, '<span class="hl-command">$</span>');
          
          // Highlight backtick commands
          highlightedLine = highlightedLine.replace(/`([^`]+)`/g, '<span class="hl-backtick">$1</span>');
          
          // Highlight common commands with more variety
          highlightedLine = highlightedLine.replace(/(\s|^|\$\s*)(kubectl|docker|npm|yarn|git|cd|ls|cat|grep|awk|sed|curl|wget|ssh|sudo|apt|yum|pip|python|node|java|mvn|gradle|terraform|ansible|helm|make|cargo|rustc|go|bash|zsh|powershell|az|gcloud|aws|ng|vue|react|vite|jest|mocha|pytest|cargo|composer|bundle)(\s+|$)/g, 
            '$1<span class="hl-command">$2</span>$3');
          
          // Highlight subcommands (after main commands)
          highlightedLine = highlightedLine.replace(/(kubectl|docker|git|npm|yarn|az|gcloud|aws)\s+<\/span>\s*(\w+)/g, 
            '$1 </span><span class="hl-info">$2</span>');
          
          // Highlight flags/options
          highlightedLine = highlightedLine.replace(/(--[\w-]+|-[a-zA-Z])\b/g, '<span class="hl-flag">$1</span>');
          
          // Highlight operators (=, >, <, |, &, &&, ||)
          highlightedLine = highlightedLine.replace(/(\s)(=|&gt;|&lt;|\||&amp;&amp;|\|\||&amp;)(\s)/g, '$1<span class="hl-operator">$2</span>$3');
          
          // Highlight brackets and parentheses
          highlightedLine = highlightedLine.replace(/([{\[\(])/g, '<span class="hl-bracket">$1</span>');
          highlightedLine = highlightedLine.replace(/([}\]\)])/g, '<span class="hl-bracket">$1</span>');
          
          // Highlight strings in quotes
          highlightedLine = highlightedLine.replace(/"([^"]*)"/g, '<span class="hl-string">"$1"</span>');
          highlightedLine = highlightedLine.replace(/'([^']*)'/g, '<span class="hl-string">\'$1\'</span>');
          
          // Highlight numbers (including decimals, hex, etc.)
          highlightedLine = highlightedLine.replace(/\b(0x[0-9a-fA-F]+|\d+\.?\d*)\b/g, '<span class="hl-number">$1</span>');
          
          // Highlight IP addresses
          highlightedLine = highlightedLine.replace(/\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/g, '<span class="hl-info">$1</span>');
          
          // Highlight URLs (http/https)
          highlightedLine = highlightedLine.replace(/(https?:\/\/[^\s]+)/g, '<span class="hl-path">$1</span>');
          
          // Highlight file paths
          highlightedLine = highlightedLine.replace(/(\/?[\w.-]+\/[\w./-]+)/g, '<span class="hl-path">$1</span>');
          
          // Highlight environment variables ($VAR)
          highlightedLine = highlightedLine.replace(/(\$[A-Z_][A-Z0-9_]*)/g, '<span class="hl-info">$1</span>');
          
          return {
            class: 'hl-default',
            html: highlightedLine
          };
        }
        // Highlight lines with colons (YAML/JSON style)
        else if (line.includes(':') && !line.trim().startsWith('-')) {
          let highlightedLine = this.escapeHtml(line);
          highlightedLine = highlightedLine.replace(/^(\s*)([^:]+)(:)(.*)$/g, 
            '$1<span class="hl-key">$2</span><span class="hl-default">$3</span><span class="hl-value">$4</span>');
          return {
            class: '',
            html: highlightedLine
          };
        }
        // Highlight list items
        else if (line.trim().match(/^[-*•]\s/)) {
          let highlightedLine = this.escapeHtml(line);
          highlightedLine = highlightedLine.replace(/^(\s*)([-*•])(\s+)(.*)$/, 
            '$1<span class="hl-bullet">$2</span>$3<span class="hl-default">$4</span>');
          return {
            class: '',
            html: highlightedLine
          };
        }
        // Highlight comments
        else if (line.trim().match(/^(\/\/|#)/)) {
          return {
            class: 'hl-comment',
            html: this.escapeHtml(line)
          };
        }
        // Highlight assignments
        else if (line.includes('=') && !line.trim().startsWith('-')) {
          let highlightedLine = this.escapeHtml(line);
          highlightedLine = highlightedLine.replace(/^(\s*)([^=]+)(=)(.*)$/g, 
            '$1<span class="hl-key">$2</span><span class="hl-default">$3</span><span class="hl-value">$4</span>');
          return {
            class: '',
            html: highlightedLine
          };
        }
        // Highlight special keywords (ERROR, WARNING, SUCCESS, INFO, etc.)
        else if (line.match(/\b(ERROR|FAIL|FAILED|FAILURE)\b/i)) {
          let highlightedLine = this.escapeHtml(line);
          highlightedLine = highlightedLine.replace(/\b(ERROR|FAIL|FAILED|FAILURE)\b/gi, '<span class="hl-error">$1</span>');
          return {
            class: 'hl-default',
            html: highlightedLine
          };
        }
        else if (line.match(/\b(SUCCESS|PASS|PASSED|OK|DONE)\b/i)) {
          let highlightedLine = this.escapeHtml(line);
          highlightedLine = highlightedLine.replace(/\b(SUCCESS|PASS|PASSED|OK|DONE)\b/gi, '<span class="hl-success">$1</span>');
          return {
            class: 'hl-default',
            html: highlightedLine
          };
        }
        else if (line.match(/\b(WARNING|WARN|CAUTION|DEPRECATED)\b/i)) {
          let highlightedLine = this.escapeHtml(line);
          highlightedLine = highlightedLine.replace(/\b(WARNING|WARN|CAUTION|DEPRECATED)\b/gi, '<span class="hl-warning">$1</span>');
          return {
            class: 'hl-default',
            html: highlightedLine
          };
        }
        else if (line.match(/\b(INFO|NOTE|TIP|HINT)\b/i)) {
          let highlightedLine = this.escapeHtml(line);
          highlightedLine = highlightedLine.replace(/\b(INFO|NOTE|TIP|HINT)\b/gi, '<span class="hl-info">$1</span>');
          return {
            class: 'hl-default',
            html: highlightedLine
          };
        }
        // Default color for regular text with enhanced formatting
        else {
          let highlightedLine = this.escapeHtml(line);
          // Highlight anything in backticks even in regular text
          highlightedLine = highlightedLine.replace(/`([^`]+)`/g, '<span class="hl-backtick">$1</span>');
          // Highlight words in CAPS (potential constants or important terms)
          highlightedLine = highlightedLine.replace(/\b([A-Z][A-Z0-9_]{2,})\b/g, '<span class="hl-info">$1</span>');
          return {
            class: 'hl-default',
            html: highlightedLine
          };
        }
      });
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
        padding: 50px 35px 30px 35px;
        border-radius: 12px;
        width: fit-content;
        min-width: 500px;
        max-width: 1200px;
        box-sizing: border-box;
        position: relative;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        border: 1px solid #44475a;
      `;

      // Add watermark background to export
      const watermarkContainer = document.createElement('div');
      watermarkContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        transform: rotate(-25deg);
        pointer-events: none;
        overflow: hidden;
        z-index: 1;
      `;

      // Create multiple watermark text elements
      for (let i = 0; i < 6; i++) {
        const watermarkText = document.createElement('div');
        watermarkText.style.cssText = `
          font-family: 'Courier New', monospace;
          font-size: 24px;
          font-weight: bold;
          color: rgba(98, 114, 164, 0.08);
          text-align: center;
          white-space: nowrap;
          user-select: none;
          line-height: 1.5;
          letter-spacing: 2px;
          margin: -10px 0;
          transform: ${i % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)'};
        `;
        watermarkText.textContent = '@VamsiPenmetsa';
        watermarkContainer.appendChild(watermarkText);
      }
      tempElement.appendChild(watermarkContainer);

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
        z-index: 10;
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

      // Add the text content with enhanced syntax highlighting for export
      const textDiv = document.createElement('div');
      textDiv.style.cssText = `
        margin-top: 10px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        white-space: pre-wrap;
        tab-size: 4;
        -moz-tab-size: 4;
        line-height: 1.8;
        letter-spacing: 0.3px;
        position: relative;
        z-index: 10;
      `;
      textDiv.innerHTML = this.getExportHighlightedHTML(this.formattedText);
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
        position: relative;
        z-index: 10;
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
/* Dracula theme syntax highlighting colors */
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

/* Dracula syntax highlighting - scoped styles for production build */
:deep(.hl-heading-1) { 
  color: #bd93f9; 
  font-weight: bold; 
  margin-top: 12px; 
  margin-bottom: 4px;
  font-size: 15px; 
  text-shadow: 0 0 10px rgba(189, 147, 249, 0.5);
  border-bottom: 2px solid rgba(189, 147, 249, 0.3);
  padding-bottom: 4px;
}
:deep(.hl-heading-2) { 
  color: #ff79c6; 
  font-weight: bold; 
  margin-top: 10px; 
  margin-bottom: 3px;
  font-size: 14px;
  text-shadow: 0 0 8px rgba(255, 121, 198, 0.4);
}
:deep(.hl-heading-3) { 
  color: #8be9fd; 
  font-weight: bold; 
  margin-top: 8px; 
  margin-bottom: 2px;
  font-size: 13.5px;
  text-shadow: 0 0 6px rgba(139, 233, 253, 0.3);
}
:deep(.hl-heading-4) { 
  color: #ffb86c; 
  font-weight: bold; 
  margin-top: 6px; 
  font-size: 13px;
}

:deep(.hl-command) { 
  color: #50fa7b; 
  font-weight: bold;
  text-shadow: 0 0 5px rgba(80, 250, 123, 0.3);
}
:deep(.hl-flag) { 
  color: #ffb86c;
  font-weight: 500;
  text-shadow: 0 0 5px rgba(255, 184, 108, 0.2);
}
:deep(.hl-string) { 
  color: #f1fa8c;
  font-style: italic;
  text-shadow: 0 0 5px rgba(241, 250, 140, 0.2);
}
:deep(.hl-number) { 
  color: #bd93f9;
  font-weight: 600;
}
:deep(.hl-path) { 
  color: #8be9fd;
  text-decoration: underline;
  text-decoration-color: rgba(139, 233, 253, 0.3);
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}
:deep(.hl-key) { 
  color: #ff79c6; 
  font-weight: 700;
  text-shadow: 0 0 5px rgba(255, 121, 198, 0.3);
}
:deep(.hl-value) { 
  color: #f1fa8c;
  margin-left: 4px;
}
:deep(.hl-bullet) { 
  color: #50fa7b; 
  font-weight: bold;
  font-size: 16px;
  margin-right: 2px;
}
:deep(.hl-comment) { 
  color: #6272a4; 
  font-style: italic;
  opacity: 0.8;
}
:deep(.hl-default) { 
  color: #f8f8f2;
  line-height: 1.6;
}
:deep(.hl-backtick) { 
  color: #8be9fd; 
  font-weight: 600; 
  background: linear-gradient(135deg, rgba(139, 233, 253, 0.15), rgba(98, 114, 164, 0.15)); 
  padding: 2px 6px; 
  border-radius: 4px;
  border: 1px solid rgba(139, 233, 253, 0.3);
  box-shadow: 0 0 8px rgba(139, 233, 253, 0.2);
}
:deep(.hl-operator) {
  color: #ff79c6;
  font-weight: bold;
  padding: 0 2px;
}
:deep(.hl-bracket) {
  color: #f8f8f2;
  font-weight: bold;
}
:deep(.hl-error) {
  color: #ff5555;
  font-weight: bold;
}
:deep(.hl-success) {
  color: #50fa7b;
  font-weight: bold;
}
:deep(.hl-warning) {
  color: #ffb86c;
  font-weight: bold;
}
:deep(.hl-info) {
  color: #8be9fd;
}

/* Watermark Styles */
.watermark-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  transform: rotate(-25deg);
  pointer-events: none;
}

.watermark-text {
  font-family: 'Courier New', monospace;
  font-size: 24px;
  font-weight: bold;
  color: rgba(98, 114, 164, 0.08);
  text-align: center;
  white-space: nowrap;
  user-select: none;
  line-height: 1.5;
  letter-spacing: 2px;
  margin: -10px 0;
}

.watermark-text:nth-child(odd) {
  transform: translateX(-50px);
}

.watermark-text:nth-child(even) {
  transform: translateX(50px);
}
</style>