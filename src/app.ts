import express, { Application } from "express"
import helmet from "helmet"

export const createApp = (): Application => {
  const app = express()

  app.use(helmet())

  app.use(express.json())
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))

  return app
}
