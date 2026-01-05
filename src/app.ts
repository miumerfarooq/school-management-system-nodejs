import express, { Application } from "express";
import helmet from "helmet";
import routes from "./routes";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";

export const createApp = (): Application => {
  const app = express()

  app.use(helmet())

  app.use(express.json())
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))

  app.use(`/api/${env.apiVersion}`, routes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
