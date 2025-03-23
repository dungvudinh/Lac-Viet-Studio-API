import express from "express";
import {StatusCodes} from 'http-status-codes'
import productCatalogRoute from "./productCatalogRoute";
import productRoute from './productRoutes'

const Router = express.Router();

Router.get("/status", async (req, res) => {res.status(StatusCodes.OK).json({ message: "Hello World" })});
Router.use('/productCatalog', productCatalogRoute)
Router.use('/product', productRoute)

export default Router;