import ApiError from "~/utils/apiError";
import { StatusCodes } from "http-status-codes";
import { userModel, USER_COLLECTION_NAME } from "~/models/userModel";
import { GET_DB } from "~/config/mongodb";
const signup = async (data) =>
{
    try 
    {
        //finding before create new
        const result = await userModel.getByEmail(data.email);
        if(result)
            throw new ApiError(StatusCodes.NOT_FOUND, 'Email already exist')
        await userModel.createNew(data)
    }
    catch(error)
    {
        throw error
    }
}
const verifyEmail = async (data) =>
{
    try 
    {
        const {token} = data;
        const user = await GET_DB().collection(USER_COLLECTION_NAME).findOne({verificationToken:token})
        if(!user)
            throw new ApiError(StatusCodes.NOT_FOUND, 'Invalid or expired token')
        //Mask user as verified
        user.isVerified = true
        user.verificationToken = undefined
        await user.save()
        
    }
    catch(error)
    {
        throw error
    }
}
export const userService = {
    signup,
    verifyEmail
}