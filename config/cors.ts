import { defineConfig } from '@adonisjs/cors'

const corsConfig = defineConfig({
  enabled: true,
  origin: (origin) => {
    // Allow localhost for development
    if (
      origin === 'http://localhost:5173' ||
      origin === 'http://localhost:3333' ||
      !origin
    ) {
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
