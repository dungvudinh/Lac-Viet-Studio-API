import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/apiError";
import {userService} from '~/services/userService'

const signup = async (req, res, next) =>
{
    try 
    {
        const result = userService.signup(req.body)
        res.status(StatusCodes.CREATED).json(result)
    }
    catch(error)
    {
        console.log(error)
        next(error)
    }
}

const verifyEmail = async (req, res, next)=>
{
    try 
    {
        await userService.verifyEmail(req.params)
        return res.status(StatusCodes.OK).json({ msg: 'Email verified successfully' });
    }
    catch(error)
    {
        console.log(error)
        next(error)
    }
}
export const userController = {
    signup,
    verifyEmail
}