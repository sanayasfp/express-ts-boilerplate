import {z} from "zod";
import safeMiddleware from "@/utils/safe-middleware";
import HTTPException from "@/exceptions/HTTPException";
import {zodMultiValidator, zodValidator} from "@/utils/zodValidator";

const slugValidator = (schema: z.ZodSchema<any> | z.ZodSchema<any>[]) => safeMiddleware(
  async (req, res, next) => {
    const {validated, errorMessages, error} = Array.isArray(schema)
      ? await zodMultiValidator(schema, req.params)
      : await zodValidator(schema, req.params);

    if (errorMessages) {
      next(new HTTPException(404, {
        message: 'Query parameter validation failed',
        errors: errorMessages,
      }));
    } else if (error) {
      next(error);
    } else {
      req.validatedParams = () => validated;
      next();
    }
  }
);

export default slugValidator;
