import ApiError from "~/utils/apiError";
import { StatusCodes } from "http-status-codes";
import { userModel } from "~/models/userModel";
import { GET_DB } from "~/config/mongodb";
import { env } from "~/config/environment";
import { ObjectId } from "mongodb";

const signup = async (data) =>
{
    try 
    {
        const {email} = data;
        const result = userModel.getByEmail(email)
        if(result)
            throw new ApiError(StatusCodes.CONFLICT, 'Email already exist')
        await userModel.signup(email)
    }
    catch(error)
    {
        throw error 
    }
}
const createNew = async (data) =>
{
    try 
    {
        //finding before create new
        const result = await userModel.getByEmail(data.email);
        if(result)
            throw new ApiError(StatusCodes.CONFLICT, 'Email already exist')
        await userModel.createNew(data)  
    }
    catch(error)
    {
        throw error
    }
}
const verifyOTP = async (data) =>
{
    try 
    {
        const {email,otp} = data;
        const user = await GET_DB().collection(userModel.USER_COLLECTION_NAME).findOne({
            email,
            otp,
            otpExpires: { $gt: new Date()}
        })
        if(!user)
            throw new ApiError(StatusCodes.NOT_FOUND, 'Invalid or expired OTP')        
        // Mask user as verified
        await GET_DB().collection(userModel.USER_COLLECTION_NAME).updateOne(
            { _id: user._id },
            {
                $set: { isVerified: true },
                $unset: { otp: "", otpExpires:"" }
            }
        )
        
    }
    catch(error)
    {
        throw error
    }
}
const verifyToken = async (token) =>
{
    try 
    {
        const user = await GET_DB().collection(userModel.USER_COLLECTION_NAME).findOne(
            {
                resetPasswordToken: token, 
                resetPasswordExpires: { $gt: new Date()},
            }
          )

          if(!user)
            throw new Error('Invalid or expired token')
        return user;

    }
    catch(error)
    {
        throw error 
    }
}
const changePassword = async (data) =>
{
    try 
    {
        const {email, currentPassword, newPassword} = data;
        await userModel.changePassword(email,currentPassword, newPassword)
    }
    catch(error)
    {
        throw error
    }
}
const forgotPassword = async (data) =>
{
    try 
    {
        const {email} = data;
        await userModel.forgotPassword(email);
    }
    catch(error)
    {
        throw error
    }
}
const setNewPassword = async (token, password) => 
{
    try 
    {
        const user = await verifyToken(token)
        await userModel.setNewPassword(user,password)
    }
    catch(error)
    {
        throw error
    }
}
const login = async (data) =>
{
    try 
    {
        const {email, password,userAgent, ipAddress} = data;
        return await userModel.login(email, password, userAgent, ipAddress)
    }
    catch(error)
    {
        throw error
    }
}
const refreshToken = async (refreshToken)=>
{
    try 
    {
        return await userModel.refreshToken(refreshToken)
    }
    catch(error)
    {
        throw error
    }
}
const logout = async (refreshToken) =>
{
    try 
    {
        await userModel.logout(refreshToken)
    }
    catch(error)
    {
        throw error
    }
}
export const userService = {
    signup,
    createNew,
    verifyOTP,
    changePassword,
    forgotPassword,
    verifyToken,
    setNewPassword,
    login,
    refreshToken,
    logout
}