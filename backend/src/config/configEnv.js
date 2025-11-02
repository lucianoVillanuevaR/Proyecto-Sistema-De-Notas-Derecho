import dotenv from "dotenv";
dotenv.config();

// Exporto constantes con los mismos nombres de tu .env:
export const HOST = process.env.HOST || "0.0.0.0";     // host del servidor Express
export const PORT = process.env.PORT || 3000;          // puerto del servidor Express

export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_PORT = Number(process.env.DB_PORT || 5432);
export const DB_USERNAME = process.env.DB_USERNAME || "postgres";
export const DB_PASSWORD = process.env.DB_PASSWORD || "postgres";
export const DATABASE = process.env.DATABASE || "ingSw";

export const JWT_SECRET = process.env.JWT_SECRET || "supersecreto";
export const COOKIE_KEY = process.env.COOKIE_KEY || "clavecookies";
