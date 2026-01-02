import { createApp } from "./app";
import connectDB from "./config/db";
import { env } from "./config/env";
import { logger } from "./utils/logger";

const startServer = async (): Promise<void> => {
  try {
    await connectDB()

    const app = createApp()

    app.listen(env.port, () => {
      logger.info(`🚀 Server running on port ${env.port}`)
      logger.info(`📝 Environment: ${env.nodeEnv}`)
      logger.info(`🔗 API Base URL: http://localhost:${env.port}/api/${env.apiVersion}`)
    })
  } catch (error) {
    logger.error(`❌ Failed to start server: ${error}`)
    process.exit(1)
  }
}

startServer()
