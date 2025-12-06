<template>
  <div id="app" class="app-container">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  // Check if user is already logged in
  authStore.checkAuth()
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', 'Segoe UI', 'Poppins', sans-serif;
}

body {
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  background-attachment: fixed;
  color: #eee;
  min-height: 100vh;
  overflow-x: hidden;
}

body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.app-container {
  position: relative;
  z-index: 1;
}
</style>
