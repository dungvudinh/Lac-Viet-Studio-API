import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import ApiError from "~/utils/apiError";

const correctCondition = Joi.object({
    name: Joi.string().min(3).max(30).trim().required(), 
    listedPrice: Joi.number().positive().required(), 
    sellingPrice: Joi.number().positive().required(),
    age: Joi.number().integer().min(1).max(120).allow(null).default(null),
    catalogSlug: Joi.string().required(),
});
const createNew = async (req, res, next) => {
    try 
    {
        console.log(req.body.images[0])
        await correctCondition.validateAsync(req.body, {abortEarly:false})
        next();
    }
    catch(error){
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }
}

const update = async (req, res, next)=>
{
    try 
    {
        await correctCondition.validateAsync(req.body, {abortEarly:false})
        next();
    }
    catch(error)
    {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }
}

export const productValidation = {createNew,update}