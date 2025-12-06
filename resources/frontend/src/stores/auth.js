import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  function setToken(newToken) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function clearToken() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  async function login(email, password) {
    try {
      const response = await api.post('/login', { email, password })
      if (response.data.token) {
        setToken(response.data.token)
        return { success: true }
      }
      return { success: false, message: 'Login gagal' }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login gagal' }
    }
  }

  async function register(email, password) {
    try {
      const response = await api.post('/register', { email, password })
      if (response.data.token) {
        setToken(response.data.token)
        return { success: true }
      }
      return { success: false, message: 'Registrasi gagal' }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registrasi gagal' }
    }
  }

  function logout() {
    clearToken()
  }

  function checkAuth() {
    if (!token.value) {
      clearToken()
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  }
})
