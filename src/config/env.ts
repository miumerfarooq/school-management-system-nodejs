import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default(3001),
  API_VERSION: z.string().default('v1'),

  DB_URI: z.string(),

  BCRYPT_ROUNDS: z.string().default('12'),

  CORS_ORIGIN: z.string(),

  RATE_LIMIT_WINDOW_MS: z.string().default('900000'), // 15*60*1000 = 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),

  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_ACCESS_EXPIRY: z.string(),
  JWT_REFRESH_EXPIRY: z.string(),
  JWT_RESET_PASSWORD_EXPIRY: z.string(),
  JWT_EMAIL_VERIFY_EXPIRY: z.string(),

  SMTP_HOST: z.string(),
  SMTP_PORT: z.string(),
  SMTP_SECURE: z.string(),
  SMTP_USER: z.string(),
  SMTP_PASSWORD: z.string(),
  EMAIL_FROM: z.string(),

  FRONTEND_URL: z.string().default('http://localhost:3000'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  // console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors)
  console.error('❌ Invalid environment variables:', z.prettifyError(parsed.error))
  throw new Error('Invalid environment variables')
}

const _env = {
  nodeEnv: parsed.data.NODE_ENV,
  port: parsed.data.PORT,
  apiVersion: parsed.data.API_VERSION,

  mongodb: {
    uri: parsed.data.DB_URI
  },

  bcrypt: {
    rounds: parseInt(parsed.data.BCRYPT_ROUNDS, 10),
  },

  cors: {
    origin: parsed.data.CORS_ORIGIN.split(','),
  },

  rateLimit: {
    windowMs: parseInt(parsed.data.RATE_LIMIT_WINDOW_MS, 10),
    maxRequests: parseInt(parsed.data.RATE_LIMIT_MAX_REQUESTS, 10),
  },

  jwt: {
    accessSecret: parsed.data.JWT_ACCESS_SECRET,
    refreshSecret: parsed.data.JWT_REFRESH_SECRET,
    accessExpiry: parsed.data.JWT_ACCESS_EXPIRY,
    refreshExpiry: parsed.data.JWT_REFRESH_EXPIRY,
    resetPasswordExpiry: parsed.data.JWT_RESET_PASSWORD_EXPIRY,
    emailVerifyExpiry: parsed.data.JWT_EMAIL_VERIFY_EXPIRY,
  },

  email: {
    smtp: {
      host: parsed.data.SMTP_HOST,
      port: parsed.data.SMTP_PORT ? parseInt(parsed.data.SMTP_PORT, 10) : undefined,
      secure: parsed.data.SMTP_SECURE === 'true',
      user: parsed.data.SMTP_USER,
      password: parsed.data.SMTP_PASSWORD,
    },
    from: parsed.data.EMAIL_FROM || 'noreply@yourapp.com',
  },

  frontendUrl: parsed.data.FRONTEND_URL,
}

export const env = Object.freeze(_env)
