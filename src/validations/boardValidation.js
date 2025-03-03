import { StatusCodes } from "http-status-codes";
import Joi from "joi";


const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        title:Joi.string().required().min(3).max(30).trim().strict(),
        description:Joi.string().required(),
    })
    try 
    {
        console.log(req)
        console.log(res)
        correctCondition.validateAsync(req.body)
        res.status(StatusCodes.CREATED).json({ message: "create new data sucessfully" })
    }
    catch(error){
        console.error(error)
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            errors: new Error(error).message
        })
    }
}

export const BoardValidation = {createNew}