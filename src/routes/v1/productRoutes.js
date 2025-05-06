import express from "express";
import { productController } from "~/controllers/productController.js";
import { productValidation } from "~/validations/productValidation.js";
import upload from '~/middlewares/upload'

const Router = express.Router();
Router.route('/')
    .get(productController.getAll)
    .post(productValidation.createNew,upload.single('image'), productController.createNew)
Router.route('/:id')
    .get(productController.getById)
    .put(productValidation.update, productController.update)
    .delete(productController.remove)
export default Router;