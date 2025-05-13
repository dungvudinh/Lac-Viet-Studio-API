import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/apiError";
import {userService} from '~/services/userService'
import { env } from "~/config/environment";
const signup = async (req, res, next) =>
{
    try 
    {
        userService.signup(req.body)
        res.status(StatusCodes.OK).json({msg:'OTP has been sent to your email address'})
    }
    catch(error)
    {
        console.log(error)
        next(error)
    }
}
const createNew = async (req, res, next) =>
{
  try 
  {
    userService.createNew(req.body)
    res.status(StatusCodes.OK).json({msg:'Account created successfully'})
  }
  catch(error)
  {
    console.log(error)
    next(error)
  }
}
const verifyOTP = async (req, res, next)=>
{
    try 
    {
        await userService.verifyOTP(req.body)
        return res.status(StatusCodes.OK).json({ msg: 'Email verified successfully' });
    }
    catch(error)
    {
        console.log(error)
        next(error)
    }
}
const changePassword = async (req, res, next)=>
{
    try 
    {
        console.log(req.body)
        await userService.changePassword(req.body)
        return res.status(StatusCodes.OK).json({msg:'Password change successfully'})
    }
    catch(error)
    {
        console.log(error)
        next(error)
    }
}

const forgotPassword = async (req, res, next) => {
  try {
    await userService.forgotPassword(req.body)
    return res.status(StatusCodes.OK).json({ msg: 'Password reset email sent successfully' })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const verifyToken = async (req, res, next) => {
  try {
    await userService.verifyToken(req.params.token)
    // return res.status(StatusCodes.OK).json({ msg: 'Token verify successfully' })
    return res.redirect(`${env.APP_FRONT_URL}`) // test
  } catch (error) {
    console.log(error)
    next(error)
  }
}
const setNewPassword = async (req, res, next) =>
{
  try 
  {
    const {token} = req.params;
    const {password} = req.body;
    await userService.setNewPassword(token, password)
    return res.status(StatusCodes.OK).json({msg:'Set new password successfully'})
  }
  catch(error)
  {
    console.log(error)
    next(error)
  }
}
const login = async (req, res, next) =>
{
  try 
  {
    
    const {refreshToken, ...result} = await userService.login({...req.body, userAgent: req.headers['user-agent'], ipAddress: req.ip});
    res.cookie("refreshToken", refreshToken, {
      httpOnly:true, 
      secure:true, 
      sameSite:'Strict', 
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
    })
    res.status(StatusCodes.OK).json({
      msg:'Login successfully',
      result
    })
  }
  catch(error)
  {
    console.log(error)
    next(error)
  }
}
const refreshToken = async (req, res, next) =>
{
  try 
  {
    const {refreshToken, ...result} = await userService.refreshToken(req.cookies.refreshToken);
    res.cookie("refreshToken", refreshToken, {
      httpOnly:true, 
      secure:true, 
      sameSite:'Strict', 
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
    })
    res.status(StatusCodes.OK).json({
      data: result
    })
  }
  catch(error)
  {
    console.log(error)
    next(error)
  }
}
const logout = async (req, res, next)=>
{
  try 
  {
    await userService.logout(req.cookies.refreshToken)
    res.status(StatusCodes.OK).json({msg:'logout successfully'})
  }
  catch(error)
  {
    console.log(error)
    next(error)
  }
}
const checkSession = async (req, res, next)=>
{
  try 
  {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken)
      res.status(StatusCodes.UNAUTHORIZED).json({msg:'No session found'})
    await userService.checkSession(refreshToken)
    res.status(StatusCodes.OK).json({msg:'Session valid'})
  }
  catch(error)
  {
    console.log(error)
    next(error)
  }
}
export const userController = {
    signup,
    createNew,
    verifyOTP,
    changePassword,
    forgotPassword,
    verifyToken,
    setNewPassword,
    login,
    refreshToken,
    logout,
    checkSession
}