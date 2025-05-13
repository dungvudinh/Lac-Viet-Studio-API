import express from "express";
import { productController } from "~/controllers/productController.js";
import { productValidation } from "~/validations/productValidation.js";
import upload from '~/middlewares/upload'

const Router = express.Router({mergeParams:true});
Router.route('/')
    .get(productController.getAll)
    .post(upload.array('images', 10), productController.createNew)
Router.route('/:id')
    .get(productController.getById)
    .put(productValidation.update, productController.update)
    .delete(productController.remove)
export default Router;