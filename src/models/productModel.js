import Joi from "joi";
import { GET_DB } from "~/config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const objectId = (value, helpers) => {
    if (value instanceof mongoose.Types.ObjectId || mongoose.Types.ObjectId.isValid(value)) {
        return value;
    }
    return helpers.error('any.invalid');
};
const PRODUCT_COLLECTION_NAME = 'product'
const PRODUCT_COLLECTION_SCHEMA = Joi.object({
    name: Joi.string().required().min(3).max(50).trim().strict(), 
    slug: Joi.string().required().min(3).trim().strict(), 
    images:Joi.array().items(Joi.object({
        url: Joi.string().uri().required(), 
        publicId: Joi.string().required(),
        isRepresentative:Joi.boolean().optional()
    })),
    listedPrice: Joi.number().positive().required(), 
    sellingPrice: Joi.number().positive().required(), 
    age: Joi.number().integer().min(1).max(120).allow(null).default(null), 
    catalogId: Joi.custom(objectId).required(),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    deletedAt: Joi.date().timestamp('javascript').default(null)
})


const validation = async (data) =>
{
    return await PRODUCT_COLLECTION_SCHEMA.validateAsync(data, {abortEarly:false})
}
const createNew = async (data)=>
{
    try 
    {
        const validatedData = await validation(data);
        return await GET_DB().collection(PRODUCT_COLLECTION_NAME).insertOne(validatedData);
    }
    catch(error)
    {
        throw error
    }
}
const getById = async (id)=>
{
    try 
    {
        return await GET_DB().collection(PRODUCT_COLLECTION_NAME).findOne({_id:new ObjectId(id)})
    }
    catch(error)
    {
        throw error
    }
}

const getAll = async (_id)=>
{
    try 
    {
        return await GET_DB().collection(PRODUCT_COLLECTION_NAME).find({catalogId:new ObjectId(_id)}).toArray();;
    }
    catch(error)
    {
        throw error
    }
}

const update = async (catalogId,productId, newData)=>
{
    try 
    {
        const validatedData = await validation(newData);
        return await GET_DB().collection(PRODUCT_COLLECTION_NAME).updateOne(
            {_id:new ObjectId(productId), catalogId: catalogId}, 
            {
                $set:{name: validatedData.name,listedPrice: validatedData.listedPrice, sellingPrice: validatedData.sellingPrice,age: validatedData.age},
                $push: {images: {$each: validatedData.images}}
            }, 
            
        )
    }
    catch(error)
    {
        throw error
    }
}
const remove = async (catalogId, id)=>
{
    try 
    {
        console.log(catalogId, id)
        return await GET_DB().collection(PRODUCT_COLLECTION_NAME).findOneAndDelete({_id:new ObjectId(id), catalogId: catalogId})
    }
    catch(error)
    {
        throw error
    }
}
const removeImage = async (catalogId, productId,  publicId)=>
{
    try 
    {
        return await GET_DB().collection(PRODUCT_COLLECTION_NAME).updateOne(
            {
                _id: new ObjectId(productId),
                catalogId: new ObjectId(catalogId)
            }, 
            {
                $pull: {images: {publicId: publicId}}
            }

        )

    }
    catch(error)
    {
        throw error 
    }
}
const getBySlug = async (slug)=>
{
    try 
    {
        return await GET_DB().collection(PRODUCT_COLLECTION_NAME).findOne({slug})
    }
    catch(error)
    {
        throw error
    }
}
export const productModel = {
    PRODUCT_COLLECTION_NAME,
    PRODUCT_COLLECTION_SCHEMA,
    createNew,
    getById,
    getAll,
    update,
    remove,
    removeImage,
    getBySlug
}
