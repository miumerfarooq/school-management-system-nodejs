import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default(3001),
  API_VERSION: z.string().default('v1'),

  DB_URI: z.string(),

  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_ACCESS_EXPIRY: z.string(),
  JWT_REFRESH_EXPIRY: z.string(),
  JWT_RESET_PASSWORD_EXPIRY: z.string(),
  JWT_EMAIL_VERIFY_EXPIRY: z.string(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors)
  throw new Error('Invalid environment variables')
}

const _env = {
  nodeEnv: parsed.data.NODE_ENV,
  port: parsed.data.PORT,
  apiVersion: parsed.data.API_VERSION,

  mongodb: {
    uri: parsed.data.DB_URI
  },

  jwt: {
    accessSecret: parsed.data.JWT_ACCESS_SECRET,
    refreshSecret: parsed.data.JWT_REFRESH_SECRET,
    accessExpiry: parsed.data.JWT_ACCESS_EXPIRY,
    refreshExpiry: parsed.data.JWT_REFRESH_EXPIRY,
    resetPasswordExpiry: parsed.data.JWT_RESET_PASSWORD_EXPIRY,
    emailVerifyExpiry: parsed.data.JWT_EMAIL_VERIFY_EXPIRY,
  },
}

export const env = Object.freeze(_env)
