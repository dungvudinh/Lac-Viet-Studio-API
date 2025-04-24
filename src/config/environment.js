import dotenv from 'dotenv'
dotenv.config()
export const env = {
    MONGODB_URI: process.env.MONGODB_URI,
    DATABASE_NAME: process.env.DATABASE_NAME,
    APP_PORT: process.env.APP_PORT,
    AUTHOR:process.env.AUTHOR, 
    APP_HOST: process.env.APP_HOST,
    JWT_SECRET: process.env.JWT_SECRET,
    EMAIL_HOST:process.env.EMAIL_HOST, 
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_USER:process.env.EMAIL_USER,
    EMAIL_PASS:process.env.EMAIL_PASS,
    APP_URL:process.env.BUILD_MODE === 'production' ? process.env.PROD_URL : process.env.DEV_URL,
    RESEND_APIKEY:process.env.RESEND_APIKEY
}