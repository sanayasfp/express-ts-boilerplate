import safeMiddleware from "@/utils/safe-middleware";

export const saveSession = safeMiddleware((req, _, next) => {
  req.session.viewCount = (req.session.viewCount || 0) + 1;

  next();
});

