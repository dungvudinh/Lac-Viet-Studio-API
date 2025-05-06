import Joi from "joi";
import { GET_DB } from "~/config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { ObjectId } from "mongodb";


const PRODUCT_COLLECTION_NAME = 'product'
const PRODUCT_COLLECTION_SCHEMA = Joi.object({
    name: Joi.string().required().min(3).max(50).trim().strict(), 
    slug: Joi.string().required().min(3).trim().strict(), 
    image: Joi.string().required().trim().strict(), 
    listedPrice: Joi.number().positive().required(), 
    sellingPrice: Joi.number().positive().required(), 
    age: Joi.number().integer().min(1).max(120).allow(null).default(null), 
    catalogId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE), 
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
        throw new Error(error)
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
        throw new Error(error)
    }
}

const getAll = async ()=>
{
    try 
    {
        return await GET_DB().collection(PRODUCT_COLLECTION_NAME).find({}).toArray();;
    }
    catch(error)
    {
        throw new Error(error)
    }
}

const update = async (id, newData)=>
{
    try 
    {
        const validatedData = await validation(newData);
        return await GET_DB().collection(PRODUCT_COLLECTION_NAME).findOneAndUpdate(
            {_id:new ObjectId(id)}, 
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
        return await GET_DB().collection(PRODUCT_COLLECTION_NAME).findOneAndDelete({_id:new ObjectId(id)})
    }
    catch(error)
    {
        throw new Error(error)
    }
}
export const productModel = {
    PRODUCT_COLLECTION_NAME,
    PRODUCT_COLLECTION_SCHEMA,
    createNew,
    getById,
    getAll,
    update,
    remove
}
