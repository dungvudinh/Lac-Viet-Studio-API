import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
const PRODUCT_CATALOG_COLLECTION_NAME = 'productCatalog';
const PRODUCT_CATALOG_COLLECTION_SCHEMA = Joi.object({
    name: Joi.string().required().min(3).max(50).trim().strict(), 
    slug: Joi.string().required().min(3).trim().strict(), 
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    deletedAt: Joi.date().timestamp('javascript').default(null)
})

const validateBeforeCreate = async (data) =>
{
    return await PRODUCT_CATALOG_COLLECTION_SCHEMA.validateAsync(data, {abortEarly:false})
}
const createNew = async (data)=>
{
    try 
    {
        const validatedData = await validateBeforeCreate(data);
        return await GET_DB().collection(PRODUCT_CATALOG_COLLECTION_NAME).insertOne(validatedData);
    }
    catch(error)
    {
        throw new Error(error)
    }
}
const getAll = async ()=>
{
    try 
    {
        const data  = await GET_DB().collection(PRODUCT_CATALOG_COLLECTION_NAME).find({}).toArray();
        console.log(data)
        return data
    }
    catch(error)
    {
        throw new Error(error)
    }
}

const getById = async (id)=>
{
    try 
    {
        return await GET_DB().collection(PRODUCT_CATALOG_COLLECTION_NAME).findOne({_id:new ObjectId(id)})
    }
    catch(error)
    {
        throw new Error(error);
    }
}

const update = async (id, newData)=>
{
    try 
    {
        return await GET_DB().collection(PRODUCT_CATALOG_COLLECTION_NAME).findOneAndUpdate(
            {_id:id}, 
            {$set:newData}, 
            {new: true, runValidators: true}
        )
    }
    catch(error)
    {
        throw new Error(error)
    }
}
export const productCalalogModel = {
    PRODUCT_CATALOG_COLLECTION_NAME, 
    PRODUCT_CATALOG_COLLECTION_SCHEMA, 
    createNew,
    getAll, 
    getById, 
    update
}