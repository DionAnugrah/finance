import { defineConfig } from '@adonisjs/cors'
import env from '#start/env'

const corsConfig = defineConfig({
  enabled: true,
  origin: (origin) => {
    // Allow localhost for development
    if (origin === 'http://localhost:5173' || origin === 'http://localhost:3333' || !origin) {
      return true
    }

    // Allow production domain
    const appUrl = env.get('APP_URL', '')
    if (appUrl && origin === appUrl) {
      return true
    }

    // 2. Allow Frontend Railway (Production) - TAMBAHKAN INI
    if (origin === 'https://efficient-balance-production.up.railway.app') {
      return true
    }

    return false
  },
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH'],
  headers: true,
  exposeHeaders: [],
  credentials: true,
  maxAge: 90,
})

export default corsConfig
