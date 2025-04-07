import { config as conf } from "dotenv";
conf();

const _config = {
  PORT: process.env.PORT,
  ACCESS_TOEKN_SECRET_KEY: process.env.ACCESS_TOEKN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY: process.env.REFRESH_TOKEN_SECRET_KEY,
  DEBUG_MODE: process.env.DEBUG_MODE,
  DB_URL: process.env.DB_URL,
  DASHBOARD_DOMAIN: process.env.DASHBOARD_DOMAIN,
  WEBSITE_DOMAIN: process.env.WEBSITE_DOMAIN,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
  WEBSITE_DOMAIN_ONLY: process.env.WEBSITE_DOMAIN_ONLY,
};

const config = Object.freeze(_config);
export default config;
