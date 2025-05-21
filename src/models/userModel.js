import Joi from "joi";
import { GET_DB } from "~/config/mongodb";
import { PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from "~/utils/validators";
import { ObjectId } from "mongodb";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { env } from "~/config/environment";
import {Resend} from 'resend'
import otpGenerator from 'otp-generator'
import {sessionModel }from './sessionModel'

const resend = new Resend(env.RESEND_APIKEY);
const USER_COLLECTION_NAME = 'user';
const USER_COLLECTION_SCHEMA = Joi.object({
    name: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.base': 'Name must be a text',
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 3 characters',
      'any.required': 'Name is required',
    }),
    email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required',
    }),
    password: Joi.string()
    .min(6)
    .max(100)
    .pattern(PASSWORD_RULE)
    .required()
    .messages({
      'string.pattern.base': PASSWORD_RULE_MESSAGE,
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required',
    }),
    role:Joi.string().required(),
    otp:Joi.string().optional(),
    otpExpires:Joi.date().optional(),
    isVerified: Joi.boolean().optional().default(false),
    resetPasswordToken: Joi.string().optional(),
    resetPasswordExpires: Joi.date().optional()
})

const sendWelcomeEmail = async (email, name) => {
  try {
      const { data, error } = await resend.emails.send({
          from: 'Lac Viet Studio <noreply@lacvietstudio.store>',
          to: email,
          subject: 'Welcome to Lac Viet Studio! 🎉',
          html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
              <div style="text-align: center; margin-bottom: 30px;">
                  <img src="https://lacvietstudio.store/images/logo.png" alt="Lac Viet Studio Logo" style="max-width: 200px;">
              </div>
              <h2 style="color: #333; text-align: center;">Welcome to Lac Viet Studio!</h2>
              <p style="color: #666; line-height: 1.6;">Dear ${name},</p>
              <p style="color: #666; line-height: 1.6;">Thank you for joining Lac Viet Studio! We're thrilled to have you as a member of our community.</p>
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                  <p style="color: #666; line-height: 1.6;">With your account, you can:</p>
                  <ul style="color: #666; line-height: 1.8;">
                      <li>Browse our exclusive collections</li>
                      <li>Save your favorite items</li>
                      <li>Track your orders</li>
                      <li>Receive special offers and updates</li>
                  </ul>
              </div>
              <p style="color: #666; line-height: 1.6;">Start exploring our collection today!</p>
              <div style="text-align: center; margin: 30px 0;">
                  <a href="${env.APP_URL}" 
                     style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                      Visit Our Store
                  </a>
              </div>
              <p style="color: #666; line-height: 1.6;">If you have any questions or need assistance, don't hesitate to contact our support team.</p>
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                  <p style="color: #999; font-size: 12px; text-align: center;">
                      Follow us on social media:<br>
                      <a href="#" style="color: #4CAF50; text-decoration: none;">Facebook</a> | 
                      <a href="#" style="color: #4CAF50; text-decoration: none;">Instagram</a> | 
                      <a href="#" style="color: #4CAF50; text-decoration: none;">Twitter</a>
                  </p>
              </div>
          </div>
          `
      });

      if (error) {
          throw error;
      }
  } catch (error) {
      throw error;
  }
};
const sendOTPEmail = async (email, otp, purpose) =>
{
  try 
  {
    const subject = purpose === 'signup' ? 'Verify Your Email with OTP 👋' : 'Reset Password OTP 🔐';
    const { data, error } = await resend.emails.send({
      from: 'Lac Viet Studio <noreply@lacvietstudio.store>',
      to: email,
      subject: subject,
      html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
              <img src="https://lacvietstudio.store/images/logo.png" alt="Lac Viet Studio Logo" style="max-width: 200px;">
          </div>
          <h2 style="color: #333; text-align: center;">${purpose === 'signup' ? 'Email Verification' : 'Reset Password'}</h2>
          <p style="color: #666; line-height: 1.6;">Dear valued customer,</p>
          <p style="color: #666; line-height: 1.6;">Your OTP code is:</p>
          <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
                  ${otp}
              </div>
          </div>
          <p style="color: #666; line-height: 1.6;">This code will expire in 5 minutes.</p>
          <p style="color: #666; line-height: 1.6;">If you didn't request this code, please ignore this email.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px; text-align: center;">
                  This email was sent by Lac Viet Studio
              </p>
          </div>
      </div>
      `
    });

    if (error) {
        throw error;
    }
  }
  catch(error)
  {
    throw error
  }
}
const sendResetPasswordEmail = async (email, resetLink) =>
{
  try {
    const { data, error } = await resend.emails.send({
        from: 'Lac Viet Studio <noreply@lacvietstudio.store>',
        to: email,
        subject: 'Reset Password Request 🔐',
        html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <div style="text-align: center; margin-bottom: 30px;">
                <img src="https://lacvietstudio.store/images/logo.png" alt="Lac Viet Studio Logo" style="max-width: 200px;">
            </div>
            <h2 style="color: #333; text-align: center;">Reset Password</h2>
            <p style="color: #666; line-height: 1.6;">Dear valued customer,</p>
            <p style="color: #666; line-height: 1.6;">We received a request to reset your password. Click the button below to create a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
            </div>
            <p style="color: #666; line-height: 1.6;">If you didn't request this, please ignore this email.</p>
            <p style="color: #666; line-height: 1.6;">This link will expire in 1 hour.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #999; font-size: 12px; text-align: center;">
                    This email was sent by Lac Viet Studio
                </p>
            </div>
        </div>
        `
    });

    if (error) {
        throw error;
    }
  } catch (err) {
      throw err;
  }
}
const validation = async (data) =>
{
    return await USER_COLLECTION_SCHEMA.validateAsync(data,{abortEarly:false})
}
const signup = async (email)=>
{
  try 
  {
    const otp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
      digits: true
    });
    await sendOTPEmail(email, otp, 'signup')

  }
  catch(error)
  {
    throw error
  }
}
const createNew = async (data)=>
{
    try 
    {
        const validatedData = await validation(data) 
        const otp = otpGenerator.generate(6, {
          upperCase: false,
          specialChars: false,
          alphabets: false,
          digits: true
        });
        const user = {
          name: validatedData.name, 
          email:validatedData.email,
          password: await bcrypt.hash(validatedData.password, 10),
          otp:otp,
          otpExpires:new Date(Date.now() + 300000) // 5 minutes 
        }
        await GET_DB().collection(USER_COLLECTION_NAME).insertOne(user)
        await sendWelcomeEmail(validatedData.email, validatedData.name)
    }
    catch(error)
    {
        throw error;
    }
}

const changePassword = async (email, currentPassword, newPassword) =>
{
  try 
  {
    const user = await getByEmail(email)
    if(!user)
      throw new Error('Email is not exist')
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if(!isPasswordValid)
      throw new Error('Current password is incorrect')
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await GET_DB().collection(USER_COLLECTION_NAME).updateOne(
      {_id:new ObjectId(user._id)},
      {$set:{password:hashedPassword}}
    )
  }
  catch(error)
  {
    throw error
  }
}
const forgotPassword = async (email) =>
{
  try 
  {
    const user = await getByEmail(email)
    if(!user)
      throw new Error('Email is not exist')
    const resetPasswordToken = crypto.randomBytes(32).toString('hex')
    const resetPasswordExpires = new Date(Date.now() + 3600000) // 1 hours
    await GET_DB().collection(USER_COLLECTION_NAME).updateOne(
      {email},
      {$set:{
        resetPasswordToken,
        resetPasswordExpires
      }}
    )
    const resetLink = `${env.APP_URL}/v1/user/verify-token/${resetPasswordToken}`;
    await sendResetPasswordEmail(user.email,resetLink)
  }
  catch(error)
  {
    throw error
  }
}

const setNewPassword = async (user,password) =>
{
  try 
  {
    const hashedPassword = await bcrypt.hash(password, 10);
    await GET_DB().collection(USER_COLLECTION_NAME).updateOne(
        { _id: user._id },
        {
            $set: { password: hashedPassword },
            $unset: {
                resetToken: "",
                resetTokenExpires: ""
            }
        }
    );
  }
  catch(error)
  {
    throw error
  }
}

const login = async (email, password, userAgent, ipAddress) =>
{
  try 
  {
    const user = await getByEmail(email)
    if(!user)
      throw new Error('Email or Password is incorrect')
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid)
      throw new Error('Email or Password is incorrect')
    const accessToken = jwt.sign(
      {userId:user._id, email:user.email, role:user.role},
      env.ACCESS_TOKEN_SECRET_KEY,
      {expiresIn:'15m'}
    )
    const refreshToken = jwt.sign(
      {userId:user._id, email:user.email, role:user.role},
      env.REFRESH_TOKEN_SECRET_KEY,
      {expiresIn:'7d'}
    )
    const session = {
      userId: user._id, // or user._id.toString() if you want string
      refreshToken,
      userAgent: userAgent ,
      ipAddress: ipAddress
    }
    await GET_DB().collection(sessionModel.SESSION_COLLECTION_NAME).insertOne(session)

    return {
      accessToken,
      refreshToken,
      user:{
        _id:user._id, 
        name:user.name, 
        email:user.email,
        role:user.role,
        isVerified:user.isVerified
      }
    }
  }
  catch(error)
  {
    throw error
  }
}
const refreshToken = async (refreshToken) =>
{
  try 
  {
    if(!refreshToken) 
      throw new Error('Refresh token is required')
    const session = await GET_DB().collection(sessionModel.SESSION_COLLECTION_NAME).findOne({refreshToken})
    if(!session)
      throw new Error('Session not found or refresh token is invalid')
    //Verify the refresh token
    try 
    {
      const decoded = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET_KEY);
      const user = await GET_DB().collection(USER_COLLECTION_NAME).findOne(
        {_id: new ObjectId(decoded.userId)}
      )
      if(!user)
        throw new Error('User not found')
      //Generate new accessToken
      const newAccessToken = jwt.sign(
        {userId: user._id, email:user.email, role:user.role},
        env.ACCESS_TOKEN_SECRET_KEY,
        {expiresIn:'15m'}
      )
      const newRefreshToken = jwt.sign(
        {userId: user._id,email:user.email, role: user.role},
        env.REFRESH_TOKEN_SECRET_KEY,
        {expiresIn:'7d'}
      )
      // Update session with new refresh token
      await GET_DB().collection(sessionModel.SESSION_COLLECTION_NAME).updateOne(
        {refreshToken},
        {
          $set: 
          {
            refreshToken:newRefreshToken,
            updatedAt: new Date()
          }
        }
      )
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken, 
        user:{
          _id: user._id, 
          name: user.name, 
          email:user.email,
          isVerified:user.isVerified
        }
      }
    }
    catch(error)
    {
      //If refresh token is expired or invalid 
      //Remove the session 
      await GET_DB().collection(sessionModel.SESSION_COLLECTION_NAME).deleteOne({refreshToken})
      throw new Error('Refresh token expired')
    }
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
    if(!refreshToken)
      throw new Error('Refresh token is required')
    await GET_DB().collection(sessionModel.SESSION_COLLECTION_NAME).deleteOne({refreshToken})
  }
  catch(error)
  {
    throw error
  }
}

const getByEmail = async (email)=>
  {
      try 
      {
          return await GET_DB().collection(USER_COLLECTION_NAME).findOne({email})
      }
      catch(error)
      {
          throw error
      }
  }

export const userModel = {
  USER_COLLECTION_NAME, 
  USER_COLLECTION_SCHEMA,
  signup, 
  createNew,
  changePassword,
  forgotPassword,
  getByEmail,
  setNewPassword,
  login,
  refreshToken,
  logout
}