import dotenv from "dotenv";
dotenv.config();

export const DATABASE_CONFIG = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  host: process.env.HOST,
  dialect: process.env.DIALECT,
};

export const APP_CONFIG = {
  port: process.env.PORT,
	jwtSecret:process.env.JWT_SECRET
};
