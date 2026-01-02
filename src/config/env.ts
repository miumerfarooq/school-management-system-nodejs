import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default(3001),
  API_VERSION: z.string().default('v1'),

  DB_URI: z.string(),
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
}

export const env = Object.freeze(_env)
