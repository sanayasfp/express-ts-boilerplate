import {RequestHandler} from "express";
import logger from "@/utils/logger";

const safeMiddleware = (handler: RequestHandler): RequestHandler => {
  return async (req, res, next) => {
    try {
      await Promise.all([handler(req, res, next)]);
    } catch (error) {
      next(error);
    }
  };
}

export default safeMiddleware;
