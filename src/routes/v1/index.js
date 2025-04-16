import express from "express";
import {StatusCodes} from 'http-status-codes'
import productRoute from './productRoutes'
import productCatalog from './productCatalogRoute'

const Router = express.Router();

Router.use('/products', productRoute)
Router.use('product-catalogs', productCatalog)


export default Router;