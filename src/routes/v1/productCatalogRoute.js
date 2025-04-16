import express from "express";
import {StatusCodes} from 'http-status-codes'
import { productCatalogValidation } from "~/validations/productCatalogValidation";
import { productCatalogController } from "~/controllers/productCatalogController";

const Router = express.Router();
Router.route('/')
    .get(productCatalogController.getAll)
    .post(productCatalogValidation.createNew, productCatalogController.createNew)
Router.route('/:id')
    .get(productCatalogController.getById)
    .put(productCatalogValidation.update, productCatalogController.update)
    .delete(productCatalogController.remove)

export default Router;