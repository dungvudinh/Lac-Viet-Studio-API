import express from 'express'
import {userValidation} from '~/validations/userValidation'
import {userController} from '~/controllers/userController'

const Router = express.Router();

Router.post('/signup',userValidation.signup, userController.signup )
Router.get('/verify-email/:token', userController.verifyEmail)

export default Router;