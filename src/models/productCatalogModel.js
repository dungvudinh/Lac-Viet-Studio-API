import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
const PRODUCT_CATALOG_COLLECTION_NAME = 'productCatalog';
const PRODUCT_CATALOG_COLLECTION_SCHEMA = Joi.object({
    name: Joi.string().required().min(3).max(50).trim().strict(), 
    slug: Joi.string().required().min(3).trim().strict(), 
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').allow(null).default(null),
    deletedAt: Joi.date().timestamp('javascript').allow(null).default(null)
})

const validation = async (data) =>
{

    data.name = data.name.trim().replace(/\s+/g, ' ') 
    return await PRODUCT_CATALOG_COLLECTION_SCHEMA.validateAsync(data, {abortEarly:false, stripUnknown:true})
}

const createNew = async (data)=>
{
    try 
    {
        const validatedData = await validation(data);
        await GET_DB().collection(PRODUCT_CATALOG_COLLECTION_NAME).insertOne(validatedData);
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
        return await GET_DB().collection(PRODUCT_CATALOG_COLLECTION_NAME).find({}).toArray();
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
        throw error;
    }
}
const getBySlug = async (slug)=>
{
    try 
    {
        return await GET_DB().collection(PRODUCT_CATALOG_COLLECTION_NAME).findOne({slug})
    }
    catch(error)
    {
        throw error
    }
}

const update = async (newData)=>
{
    try 
    {
        const validatedData = await validation(newData);
        console.log(validatedData)
        return await GET_DB().collection(PRODUCT_CATALOG_COLLECTION_NAME).findOneAndUpdate(
            {_id:new ObjectId(newData._id)}, 
            {$set:validatedData}, 
            {new: true, runValidators: true}
        )
    }
    catch(error)
    {
        throw new Error(error)
    }
}
const remove = async (id)=>
{
    try 
    {
        return await GET_DB().collection(PRODUCT_CATALOG_COLLECTION_NAME).findOneAndDelete({_id:new ObjectId(id)})
    }
    catch(error)
    {
        throw new Error(error)
    }
}
export const productCatalogModel = {
    PRODUCT_CATALOG_COLLECTION_NAME, 
    PRODUCT_CATALOG_COLLECTION_SCHEMA, 
    createNew,
    getAll, 
    getById, 
    update,
    remove,
    getBySlug
}