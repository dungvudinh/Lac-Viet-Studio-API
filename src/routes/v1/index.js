import express from "express";
import productRoute from './productRoutes.js'
import productCatalogRoute from './productCatalogRoute.js'
import userRoute from './userRoute.js'
const Router = express.Router();

Router.use('/products', productRoute)
Router.use('/product-catalogs', productCatalogRoute)
Router.use('/user', userRoute)

export default Router;