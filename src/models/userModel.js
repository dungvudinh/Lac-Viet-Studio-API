import Joi from "joi";
import { GET_DB } from "~/config/mongodb";
import { PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from "~/utils/validators";
import { ObjectId } from "mongodb";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import { env } from "~/config/environment";
import {Resend} from 'resend'

const logoUrl = `${process.env.CLIENT_URL}/images/logo.png`;
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
    isVerified: Joi.boolean().optional(),
    verificationToken: Joi.string().optional(),
})

const sendEmail = async (verificationLink) =>{
  try {
    const { data, error } = await resend.emails.send({
      from: 'Lac Viet Studio <noreply@lacvietstudio.store>',
      to: 'dunggdev2002@gmail.com',
      subject: 'Hello from Resend 👋',
      html:`
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://lacvietstudio.store/images/logo.png" alt="Lac Viet Studio Logo" style="max-width: 200px;">
        </div>
        <h2 style="color: #333; text-align: center;">Email Verification</h2>
        <p style="color: #666; line-height: 1.6;">Dear valued customer,</p>
        <p style="color: #666; line-height: 1.6;">Thank you for registering with Lac Viet Studio. To complete your registration and verify your email address, please click the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
        </div>
        <p style="color: #666; line-height: 1.6;">If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p style="color: #666; line-height: 1.6; word-break: break-all;">${verificationLink}</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            This email was sent by Lac Viet Studio<br>
            If you didn't request this verification, please ignore this email.
          </p>
        </div>
      </div>
      `
    });

    if (error) {
      console.error('Email error:', error);
      return;
    }

    console.log('Email sent:', data);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

const validation = async (data) =>
{
    return await USER_COLLECTION_SCHEMA.validateAsync(data,{abortEarly:false})
}
// const transporter = nodemailer.createTransport({
//   host:env.EMAIL_HOST,
//   port:env.EMAIL_PORT,
//   secure:false, 
//   auth:{
//     user:env.EMAIL_USER,
//     pass:env.EMAIL_PASS
//   }
// })

const createNew = async (data)=>
{
    try 
    {
        const validatedData = await validation(data) 
        const verificationToken = crypto.randomBytes(32).toString('hex')
        const user ={
          name:validatedData.name, 
          email:validatedData.email, 
          password:await bcrypt.hash(validatedData.password, 10),
          verificationToken
        }
        await GET_DB().collection(USER_COLLECTION_NAME).insertOne(user)
        const verificationLink = `${env.CLIENT_URL}/v1/user/verify-email/${verificationToken}`
        await sendEmail(verificationLink)
        // const mailOptions = {
        //   from:env.EMAIL_USER, 
        //   to:validatedData.email,
        //   subject:'Please verify your email address',
        //   html:`
        //     <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        //       <div style="text-align: center; margin-bottom: 30px;">
        //         <img src="http://localhost:3000/images/logo.png" alt="Lac Viet Studio Logo" style="max-width: 200px;">
        //       </div>
        //       <h2 style="color: #333; text-align: center;">Email Verification</h2>
        //       <p style="color: #666; line-height: 1.6;">Dear valued customer,</p>
        //       <p style="color: #666; line-height: 1.6;">Thank you for registering with Lac Viet Studio. To complete your registration and verify your email address, please click the button below:</p>
        //       <div style="text-align: center; margin: 30px 0;">
        //         <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
        //       </div>
        //       <p style="color: #666; line-height: 1.6;">If the button doesn't work, you can also copy and paste this link into your browser:</p>
        //       <p style="color: #666; line-height: 1.6; word-break: break-all;">${verificationLink}</p>
        //       <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        //         <p style="color: #999; font-size: 12px; text-align: center;">
        //           This email was sent by Lac Viet Studio<br>
        //           If you didn't request this verification, please ignore this email.
        //         </p>
        //       </div>
        //     </div>
        //   `
        // }
        // transporter.sendMail(mailOptions, (err, info)=>{
        //   if(err)
        //     console.log('Email send failed:', err)
        //   console.log('Verification email sent')
        //     return res.status(500).json({ msg: 'Email send failed', error: err });
        //   return res.status(200).json({ msg: 'Verification email sent' });
        // })
    }
    catch(error)
    {
        throw new Error(error)
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
          throw new Error(error)
      }
  }

export const userModel = {
  USER_COLLECTION_NAME, 
  USER_COLLECTION_SCHEMA,
  createNew,
  getByEmail
}