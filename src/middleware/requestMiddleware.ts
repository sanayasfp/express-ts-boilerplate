import logger from "@/utils/logger";
import safeMiddleware from "@/utils/safe-middleware";

export const requestLogger = safeMiddleware((req, _, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});
