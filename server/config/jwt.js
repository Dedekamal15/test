import dotenv from 'dotenv';
dotenv.config();

export const JWT_CONFIG = {
  accessSecret: process.env.JWT_ACCESS_SECRET || 'access_secret_change_in_production',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret_change_in_production',
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
};

export const COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  domain: process.env.COOKIE_DOMAIN || undefined, // set domain for SSO cross-subdomain
};
