import {z} from "zod";

export const zodValidator = async (schema: z.ZodSchema<any>, data: any) => {
  try {
    return {validated: schema.parse(data)}
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((issue: any) => ({
        message: `${issue.path.join('.')} is ${issue.message}`,
      }))

      return {errorMessages};
    } else {
      return {error};
    }
  }
};


export const zodMultiValidator = async (schemas: z.ZodSchema<any>[], data: any) => {
  try {
    const results = await Promise.allSettled(schemas.map((schema) => {
      return new Promise((resolve, reject) => {
        zodValidator(schema, data)
          .then(({validated, errorMessages, error}) => {
            if (errorMessages) {
              reject({validated: null, errorMessages, error: null});
            } else if (error) {
              reject({validated: null, errorMessages: null, error});
            } else {
              resolve({validated, errorMessages: undefined, error: null});
            }
          });
      }) as ReturnType<typeof zodValidator>;
    }));

    const fulfilled = results.find(({status}) => status === 'fulfilled');

    if (fulfilled) {
      return (fulfilled as PromiseFulfilledResult<Awaited<ReturnType<typeof zodValidator>>>).value;
    }

    const rejected = results
      .filter(({status}) => status === 'rejected') as PromiseRejectedResult[];

    type Rejected = { reason: Awaited<ReturnType<typeof zodValidator>> };

    const errorMessages = rejected
      .filter(({reason}: Rejected) => reason.errorMessages)
      .map(({reason}: Rejected) => reason.errorMessages);

    if (errorMessages.length) {
      return {errorMessages, error: null, validated: null};
    }

    const errors = rejected
      .filter(({reason}: Rejected) => reason.error)
      .map(({reason}: Rejected) => (reason.error as Error).message)
      .join("\n");

    return {
      error: new Error(errors),
      validated: null,
      errorMessages: null
    };
  } catch (error) {
    return {
      error,
      validated: null,
      errorMessages: null
    }
  }
}
