<template>
  <div id="app" class="min-h-screen bg-gray-900">
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
  background-color: #282a36;
  color: #f8f8f2;
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #44475a;
}

::-webkit-scrollbar-thumb {
  background: #6272a4;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #bd93f9;
}
</style>