import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  TZ: Env.schema.string(),
  PORT: Env.schema.number(),
  HOST: Env.schema.string(),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'] as const),
  APP_KEY: Env.schema.string(),
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),

  DB_CONNECTION: Env.schema.string(),
  DB_HOST: Env.schema.string(),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  EXCHANGE_RATE_API_KEY: Env.schema.string(),
  EXCHANGE_RATE_API_URL: Env.schema.string(),

  ALPHA_VANTAGE_API_KEY: Env.schema.string(),
  ALPHA_VANTAGE_API_URL: Env.schema.string(),
})
