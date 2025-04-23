import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import ApiError from "~/utils/apiError";
import { PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from "~/utils/validators"

const signupCondition = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 3 characters',
      'any.required': 'Name is required',
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required',
    }),

  password: Joi.string()
    .pattern(PASSWORD_RULE)
    .required()
    .messages({
      'string.pattern.base': PASSWORD_RULE_MESSAGE,
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
})

const loginCondition = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required',
    }),

  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
})
const signup = async (req, res, next )=>
{
    try 
    {
        await signupCondition.validateAsync(req.body, {abortEarly:false})
        next()
    }
    catch(error)
    {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }
}
export const userValidation = {signup}