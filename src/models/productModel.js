import Joi from "joi";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const PRODUCT_COLLECTION_NAME = 'product'
const PRODUCT_COLLECTION_SCHEMA = Joi.object({
    name: Joi.string().required().min(3).max(50).trim().strict(), 
    slug: Joi.string().required().min(3).trim().strict(), 
    image: Joi.string().required().trim().strict(), 
    listedPrice: Joi.number().required(), 
    sellingPrice: Joi.number().required(), 
    age: Joi.number().default(null), 
    catalogId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE), 
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    deletedAt: Joi.date().timestamp('javascript').default(null)
})

export const productModel = {
    PRODUCT_COLLECTION_NAME,
    PRODUCT_COLLECTION_SCHEMA
}
