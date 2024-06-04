export {};

declare global {
  namespace Express {
    export interface Request {
      validatedBody<T = any>(): T;
      validatedParams<T = any>(): T;
    }
  }
}
