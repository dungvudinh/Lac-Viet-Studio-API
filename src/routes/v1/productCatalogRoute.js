import express from "express";
import {StatusCodes} from 'http-status-codes'
import { productCatalogValidation } from "~/validations/productCatalogValidation";
import { productCatalogController } from "~/controllers/productCatalogController";

const Router = express.Router();
Router.route('/')
    .get(productCatalogController.getAll)
    .post(productCatalogValidation.createNew, productCatalogController.createNew)
Router.route('/:id')
    .put(productCatalogValidation.update, productCatalogController.update)
    .get(productCatalogController.getById)

export const productCatalogRoute = Router;