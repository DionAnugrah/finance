<template>
  <div class="login-container">
    <div class="login-card">
      <h1>💰 Finance App</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">📧 Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="your@email.com"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">🔒 Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>
        <button type="submit" class="btn primary" :disabled="loading">
          {{ loading ? 'Loading...' : 'Login' }}
        </button>
      </form>
      <p v-if="error" class="error-text">{{ error }}</p>
      <div class="auth-footer">
        <p>Don't have an account? <router-link to="/register">Register here</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: '',
})

const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''

  const result = await authStore.login(form.value.email, form.value.password)

  if (result.success) {
    router.push('/')
  } else {
    error.value = result.message
  }

  loading.value = false
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
}

.login-card {
  background: rgba(30, 30, 40, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  font-size: 0.9rem;
}

input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(40, 40, 50, 0.6);
  color: #fff;
  outline: none;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

input:focus {
  border-color: #667eea;
  background: rgba(40, 40, 50, 0.8);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  transform: translateY(-2px);
}

input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 0.95rem;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  margin-top: 1rem;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-text {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  padding: 0.8rem;
  border-radius: 8px;
  margin-top: 1rem;
  font-size: 0.9em;
  border-left: 3px solid #ff6b6b;
}

.auth-footer {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.auth-footer p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.auth-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.auth-footer a:hover {
  color: #764ba2;
}
</style>
