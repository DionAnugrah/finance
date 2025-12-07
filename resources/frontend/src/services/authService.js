import api from './api'

export default {
  async register(name, email, password, password_confirmation) {
    const response = await api.post('/register', {
      name,
      email,
      password,
      password_confirmation,
    })
    return response.data
  },

  async login(email, password) {
    const response = await api.post('/login', {
      email,
      password,
    })
    return response.data
  },

  async logout() {
    // Clear token from localStorage
    localStorage.removeItem('token')
    // Optional: Call logout endpoint if you have one
    // await api.post('/logout')
  },
}
