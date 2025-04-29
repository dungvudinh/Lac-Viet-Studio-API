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

const changePasswordCondition = Joi.object({
  email: Joi.string()
  .email()
  .required()
  .messages({
    'string.email': 'Please enter a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
  currentPassword: Joi.string()
    .required()
    .messages({
      'string.empty': 'Current password is required',
      'any.required': 'Current password is required',
    }),

  newPassword: Joi.string()
    .pattern(PASSWORD_RULE)
    .required()
    .messages({
      'string.pattern.base': PASSWORD_RULE_MESSAGE,
      'string.empty': 'New password is required',
      'any.required': 'New password is required',
    }),
})

const forgotPasswordCondition = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required',
    }),
})

const setNewPasswordCondition = Joi.object({
  password: Joi.string()
    .pattern(PASSWORD_RULE)
    .required()
    .messages({
      'string.pattern.base': PASSWORD_RULE_MESSAGE,
      'string.empty': 'New password is required',
      'any.required': 'New password is required',
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

const changePassword = async (req, res, next) => {
  try {
    await changePasswordCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const forgotPassword = async (req, res, next) => {
  try {
    await forgotPasswordCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}
const setNewPassword = async (req, res, next) =>
{
  try 
  {
    console.log(req.body)
    await setNewPasswordCondition.validateAsync(req.body, {abortEarly:false})
    next()
  }
  catch(error)
  {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}
const login = async (req, res, next) =>
{
  try 
  {
    await loginCondition.validateAsync(req.body, {abortEarly:false})
    next()
  }
  catch(error)
  {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}
// const resetPassword = async (req, res, next) => {
//   try {
//     //check token
    
//     await resetPasswordCondition.validateAsync(req.body, { abortEarly: false })
//     next()
//   } catch (error) {
//     next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
//   }
// }

export const userValidation = {
  signup,
  changePassword,
  forgotPassword,
  setNewPassword,
  login
  // resetPassword
}