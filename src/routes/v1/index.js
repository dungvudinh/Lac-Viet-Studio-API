import express from "express";
import {StatusCodes} from 'http-status-codes'
import { productCatalogRoute } from "./productCatalogRoute";

const Router = express.Router();

Router.get("/status", async (req, res) => {res.status(StatusCodes.OK).json({ message: "Hello World" })});
Router.use('/productCatalog', productCatalogRoute)


export default Router;