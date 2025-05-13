import express from 'express'
import {userValidation} from '~/validations/userValidation'
import {userController} from '~/controllers/userController'

const Router = express.Router();

Router.post('/signup', userValidation.signup, userController.signup)
Router.post('/verify-otp', userController.verifyOTP)
Router.put('/change-password', userValidation.changePassword, userController.changePassword)
Router.post('/forgot-password', userValidation.forgotPassword, userController.forgotPassword)
Router.get('/verify-token/:token', userController.verifyToken) // check token before nagivate to set new password page
Router.post('/set-new-password/:token', userValidation.setNewPassword, userController.setNewPassword)
Router.post('/login', userValidation.login, userController.login)
Router.post('/refresh-token', userController.refreshToken)
Router.post('/logout', userController.logout)
Router.get('/check-session', userController.checkSession)
export default Router;