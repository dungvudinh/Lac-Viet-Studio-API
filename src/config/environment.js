import dotenv from 'dotenv'
dotenv.config()
export const env = {
    MONGODB_URI: process.env.MONGODB_URI,
    DATABASE_NAME: process.env.DATABASE_NAME,
    APP_PORT: process.env.APP_PORT,
    AUTHOR:process.env.AUTHOR, 
    APP_HOST: process.env.APP_HOST, 
    BUILD_MODE:process.env.BUILD_MODE,
    CLOUDINARY_NAME:process.env.CLOUDINARY_NAME,
    API_KEY: process.env.API_KEY, 
    API_SECRET: process.env.API_SECRET
}

