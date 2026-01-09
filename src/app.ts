import express, { Application } from "express";
import helmet from "helmet";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from "./routes";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";

export const createApp = (): Application => {
  const app = express()

  app.use(helmet())
  app.use(cors({
    origin: env.cors.origin,
    credentials: true
  }))

  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))
  app.use(cookieParser());

  // API routes
  app.use(`/api/${env.apiVersion}`, routes)

  // Error handling
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
