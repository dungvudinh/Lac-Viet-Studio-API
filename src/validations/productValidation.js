import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import ApiError from "~/utils/apiError";


const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        title:Joi.string().required().min(3).max(30).trim().strict(),
        description:Joi.string().required().min(3).max(30).trim().strict(),
    })
    try 
    {
        await correctCondition.validateAsync(req.body, {abortEarly:false})
        next();
    }
    catch(error){
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }
}

export const productValidation = {createNew}