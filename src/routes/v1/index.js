import express from "express";
import {StatusCodes} from 'http-status-codes'
import productRoute from './productRoutes'
import productCatalogRoute from './productCatalogRoute'
import userRoute from './userRoute'
const Router = express.Router();

Router.use('/products', productRoute)
Router.use('/product-catalogs', productCatalogRoute)
Router.use('/user', userRoute)

export default Router;