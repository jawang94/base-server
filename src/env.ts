export const expiration = process.env.JWT_EXPIRATION_MS
  ? parseInt(process.env.JWT_EXPIRATION_MS)
  : 7 * 24 * 60 * 60 * 1000;
export const secret = process.env.JWT_SECRET || '70p53cr37';
export const origin = process.env.ORIGIN || 'http://localhost:3000';
export const port = process.env.PORT || 8080;
export const resetDb = process.env.RESET_DB || false;
export const fakedDb = process.env.FAKED_DB ? parseInt(process.env.FAKED_DB, 10) : 0;
export const nodeEnv = process.env.NODE_ENV || 'development';
