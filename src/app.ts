import express, { Application } from "express";
import helmet from "helmet";
import routes from "./routes";
import { env } from "./config/env";

export const createApp = (): Application => {
  const app = express()

  app.use(helmet())

  app.use(express.json())
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))

  app.use(`/api/${env.apiVersion}`, routes)

  return app
}
