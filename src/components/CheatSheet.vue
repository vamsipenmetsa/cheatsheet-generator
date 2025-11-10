<template>
  <div class="min-h-screen bg-gray-900 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6 text-white">Geeky Cheat Sheet Generator</h1>

      <!-- Input Section -->
      <div class="mb-6">
        <label class="block text-white mb-2 font-semibold">Enter your cheat sheet content:</label>
        <textarea
          v-model="inputText"
          placeholder="Paste your cheat sheet text here..."
          class="w-full h-40 p-3 border border-gray-700 rounded bg-gray-800 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 whitespace-pre-wrap"
          style="white-space: pre; tab-size: 4; -moz-tab-size: 4;"
        ></textarea>
      </div>

      <!-- iTerm-like Terminal Window -->
      <div id="terminal-window" class="bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
        <!-- Window Chrome -->
        <div class="bg-gray-700 px-4 py-2 flex items-center">
          <div class="flex space-x-2">
            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
            <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div class="flex-1 text-center">
            <span class="text-gray-300 text-sm font-mono">vamsi@macbook ~</span>
          </div>
        </div>

        <!-- Terminal Content -->
        <div class="p-6 bg-[#282a36] text-[#f8f8f2] font-mono text-sm leading-relaxed min-h-[600px] overflow-auto">
          <div class="mb-2">
            <span class="text-[#50fa7b]">vamsi@macbook</span>
            <span class="text-[#6272a4]">:~</span>
            <span class="text-white">$ </span>
            <span class="text-[#ffb86c]">cheatsheet</span>
          </div>
          <div v-if="formattedText" class="whitespace-pre-wrap break-words" style="white-space: pre-wrap; tab-size: 4; -moz-tab-size: 4; word-break: break-word;">{{ formattedText }}</div>
          <div v-else class="text-[#6272a4] italic">
            # Your cheat sheet will appear here...
            # Paste your content above and see the magic!
          </div>
          <div class="mt-4">
            <span class="text-[#50fa7b]">vamsi@macbook</span>
            <span class="text-[#6272a4]">:~</span>
            <span class="text-white">$ </span>
            <span class="animate-pulse">█</span>
          </div>
        </div>
      </div>

      <!-- Export Button -->
      <div class="mt-6 text-center">
        <button
          @click="exportAsImage"
          class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
          :disabled="!inputText"
        >
          Export Text as PNG Image
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';

export default {
  data() {
    return {
      inputText: `🖥️ KUBERNETES NODES — CHEAT SHEET

    WHAT IS A NODE?
    - A Node is a worker machine in Kubernetes (VM or physical).
    - Runs Pods and provides the runtime environment.
    - Each cluster has at least one Node.

    NODE COMPONENTS
    - kubelet: Ensures containers are running in Pods.
    - kube-proxy: Manages networking rules and service discovery.
    - Container Runtime: Runs containers (e.g., containerd, CRI-O).

    NODE STATUS
    - Ready: Node is healthy and schedulable.
    - NotReady: Node is unhealthy.
    - SchedulingDisabled: Node is cordoned (unschedulable).

    COMMON COMMANDS
    - List Nodes: kubectl get nodes
    - Describe Node: kubectl describe node <node-name>
    - Cordon Node: kubectl cordon <node-name>
    - Uncordon Node: kubectl uncordon <node-name>
    - Drain Node: kubectl drain <node-name> --ignore-daemonsets
    - Label Node: kubectl label nodes <node-name> key=value
    - Taint Node: kubectl taint nodes <node-name> key=value:NoSchedule

    NODE SELECTION
    - Labels: Key-value pairs for identifying nodes.
    - NodeSelector: Simple label-based scheduling.
    - Node Affinity: Advanced scheduling rules using expressions.

    NODE RESOURCES
    - Includes CPU, memory, and ephemeral storage.
    - Allocatable = Capacity - Reserved.
    - Check with: kubectl describe node <node-name>

    NODE AUTHENTICATION
    - Nodes use certificates to authenticate with the control plane.
    - kubelet uses TLS for secure communication.

    TIPS
    - Monitor node health regularly.
    - Use taints and tolerations to control Pod placement.
    - Use labels and affinity for intelligent scheduling.

    @VamsiPenmetsa`
    };
  },
  computed: {
    formattedText() {
      // Preserve all whitespace and indentation
      return this.inputText;
    }
  },
  methods: {
    async exportAsImage() {
      if (!this.inputText.trim()) return;

      // Create a temporary element with only the text content and macOS-style window controls
      const tempElement = document.createElement('div');
      tempElement.style.cssText = `
        position: absolute;
        left: -9999px;
        top: -9999px;
        background: #282a36;
        color: #f8f8f2;
        font-family: 'Fira Code', 'Source Code Pro', 'Monaco', 'Menlo', monospace;
        font-size: 14px;
        line-height: 1.5;
        white-space: pre-wrap;
        tab-size: 4;
        -moz-tab-size: 4;
        word-break: break-word;
        padding: 40px 20px 20px 20px;
        border-radius: 8px;
        max-width: 800px;
        box-sizing: border-box;
        position: relative;
      `;

      // Add macOS-style window controls (traffic light buttons)
      const controlsDiv = document.createElement('div');
      controlsDiv.style.cssText = `
        position: absolute;
        top: 12px;
        left: 12px;
        display: flex;
        gap: 8px;
        z-index: 10;
      `;

      // Red close button
      const redButton = document.createElement('div');
      redButton.style.cssText = `
        width: 12px;
        height: 12px;
        background: #ff5f57;
        border-radius: 50%;
        border: 1px solid #cc4c46;
      `;

      // Yellow minimize button
      const yellowButton = document.createElement('div');
      yellowButton.style.cssText = `
        width: 12px;
        height: 12px;
        background: #ffbd2e;
        border-radius: 50%;
        border: 1px solid #cc9600;
      `;

      // Green maximize button
      const greenButton = document.createElement('div');
      greenButton.style.cssText = `
        width: 12px;
        height: 12px;
        background: #28ca42;
        border-radius: 50%;
        border: 1px solid #1e9e33;
      `;

      controlsDiv.appendChild(redButton);
      controlsDiv.appendChild(yellowButton);
      controlsDiv.appendChild(greenButton);
      tempElement.appendChild(controlsDiv);

      // Add the text content
      const textDiv = document.createElement('div');
      textDiv.textContent = this.formattedText;
      tempElement.appendChild(textDiv);

      // Add to DOM temporarily
      document.body.appendChild(tempElement);

      try {
        const canvas = await html2canvas(tempElement, {
          backgroundColor: '#282a36',
          scale: 2, // Higher resolution
          useCORS: true,
          allowTaint: true,
          width: tempElement.offsetWidth,
          height: tempElement.offsetHeight
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