import { NextFunction, Request, Response } from "express"
import { logger } from "../utils/logger";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  res.status(404).json({
    error: 'not_found',
    message: `Route ${req.method} ${req.path} not found`,
  });
}

export const errorHandler = (err: Error | ApiError, _req: Request, res: Response, _next: NextFunction): void => {
    if (err instanceof ApiError) {
      res.status(err.statusCode).json({
          error: err.errorCode,
          message: err.message,
          details: err.details?.details ?? err.details
          // ...(err.details && { details: err.details }),
      });
    } else {
      logger.error('Unhandled error:', err);

      const statusCode = 500;
      const response: any = {
        error: 'internal_server_error',
        message: 'An unexpected error occurred',
      };

      if (env.nodeEnv === 'development') {
        response.stack = err.stack;
        response.details = err.message;
      }

      res.status(statusCode).json(response);
    }
};
