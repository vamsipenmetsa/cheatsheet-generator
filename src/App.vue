<template>
  <div id="app">
    <CheatSheet />
  </div>
</template>

<script>
import CheatSheet from './components/CheatSheet.vue';

export default {
  name: 'App',
  components: {
    CheatSheet
  }
};
</script>

<style>
/* Import Fira Code font */
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap');

/* Global styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Fira Code', 'Source Code Pro', 'Monaco', 'Menlo', monospace;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  color: #f8f8f2;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #6272a4 0%, #bd93f9 100%);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #bd93f9 0%, #ff79c6 100%);
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Selection styling */
::selection {
  background: rgba(189, 147, 249, 0.3);
  color: #f8f8f2;
}

/* Focus styles */
*:focus {
  outline: 2px solid #bd93f9;
  outline-offset: 2px;
}
</style>