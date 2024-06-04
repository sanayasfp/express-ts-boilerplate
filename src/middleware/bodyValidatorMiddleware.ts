import {z} from "zod";
import safeMiddleware from "@/utils/safe-middleware";
import HTTPException from "@/exceptions/HTTPException";
import {zodMultiValidator, zodValidator} from "@/utils/zodValidator";

export const bodyValidator = (schema: z.ZodSchema<any> | z.ZodSchema<any>[]) => safeMiddleware(
  async (req, res, next) => {
    const {validated, errorMessages, error} = Array.isArray(schema)
      ? await zodMultiValidator(schema, req.body)
      : await zodValidator(schema, req.body);

    if (errorMessages) {
      next(new HTTPException(400, {errors: errorMessages}));
    } else if (error) {
      next(error);
    } else {
      req.validatedBody = () => validated;
      next();
    }
  }
);
