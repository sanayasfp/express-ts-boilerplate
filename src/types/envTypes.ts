export interface IEnv {
  NODE_ENV: string;
  PORT: string;
  SSL_KEY: string;
  SSL_CERT: string;
  SESSION_SECRET: string;
}

export type EnvVariable = keyof IEnv;
