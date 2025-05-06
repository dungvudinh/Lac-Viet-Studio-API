import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import ApiError from "~/utils/apiError";

const correctCondition = Joi.object({
    name:Joi.string().required(),
}).unknown(true)
const createNew = async (req, res, next) => {
    
    try 
    {
        await correctCondition.validateAsync(req.body, {abortEarly:false})
        next();
    }
    catch(error){
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }
}
const update = async (req,res, next)=>
{
    try 
    {
        await correctCondition.validateAsync(req.body, {abortEarly:false})
        next()
    }
    catch(error)
    {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY), new Error(error).message)
    }
}

export const productCatalogValidation = {
    createNew,
    update
}