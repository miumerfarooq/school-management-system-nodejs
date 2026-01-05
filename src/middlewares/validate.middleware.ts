import { NextFunction, Request, Response } from "express"
import { ZodError, ZodObject } from "zod"
import { ApiError } from "../utils/ApiError"

export const validate = (schema: ZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      // await schema.parseAsync({
      //   body: req.body,
      //   query: req.query,
      //   params: req.params
      // })

      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      })
      // overwrite with parsed values (defaults applied)
      req.body = parsed.body
      Object.assign(req.query, parsed.query)
      Object.assign(req.params, parsed.params)

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        // If only one error, use its specific message for better visibility
        const mainMessage = details.length === 1
          ? details[0].message
          : 'Invalid input data: Please check the requirements';

        next(new ApiError(400, 'validation_error', mainMessage, { details }));
      } else {
        next(error);
      }
    }
  }
}
