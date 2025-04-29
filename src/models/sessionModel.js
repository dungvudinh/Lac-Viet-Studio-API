import Joi from "joi";
const SESSION_COLLECTION_NAME = 'session';
const SESSION_COLLECTION_SCHEMA = Joi.object({
    userId: Joi.string().required(), // Validate that userId is a string (ObjectId)
    refreshToken: Joi.string().required(), // Validate that refreshToken is a string
    userAgent: Joi.string().optional(), // Validate that userAgent is optional
    ipAddress: Joi.string().optional(),
    createdAt:Joi.date().default(new Date()),
    updatedAt: Joi.date().default(null)
})


export const sessionModel = {
    SESSION_COLLECTION_NAME, 
    SESSION_COLLECTION_SCHEMA
}