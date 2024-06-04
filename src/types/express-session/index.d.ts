export {};

declare module 'express-session' {
  interface SessionData {
    viewCount: number;
  }
}
