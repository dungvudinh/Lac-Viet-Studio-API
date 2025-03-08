import express from "express";
import {StatusCodes} from 'http-status-codes'
import { productValidation } from "~/validations/productValidation.js";
import { productController } from "~/controllers/productController";

const Router = express.Router();
Router.route('/')
    .get((req, res) => {
        res.status(StatusCodes.OK).json({ message: "HELLO WORLD" })
    })
    .post(productValidation.createNew, productController.createNew)

    export const BoardRoutes = Router;