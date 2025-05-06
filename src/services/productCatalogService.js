import { slugify } from "~/utils/fomatters";
import { productCalalogModel } from "~/models/productCatalogModel";
import { GET_DB } from "~/config/mongodb";
import ApiError from "~/utils/apiError";
import { StatusCodes } from "http-status-codes";
const createNew = async(data)=>
{
    try 
    {
        const name = data.name.trim().replace(/\s+/g, ' ') // remove blank gap
        const slug = slugify(name)
        const existing = await GET_DB().collection(productCalalogModel.PRODUCT_CATALOG_COLLECTION_NAME).findOne({slug})
        if(existing)
            throw new ApiError(StatusCodes.CONFLICT, 'Product catalog already exists')
        const newData = {name,slug};
        await productCalalogModel.createNew(newData);
    }
    catch(error)
    {
        throw error;
    }
}
const getAll = async ()=>
{
    try
    {
        return await productCalalogModel.getAll();
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
        const result = await productCalalogModel.getById(id)
        if(!result)
            throw new ApiError(StatusCodes.NOT_FOUND, "product catalog not found")
        return result
    }
    catch(error)
    {
        throw error
    }
}
const update  = async (data) =>
{
    try 
    {
        const newData = {
            _id: data._id,
            name: data.name,
            slug:slugify(data.name)
        }
        const result = await productCalalogModel.update(newData);
        if(!result)
            throw new ApiError(StatusCodes.NOT_FOUND, "Update failed, product catalog not found")
        return result
    }
    catch(error)
    {
        throw error
    }
}
const remove = async (id)=>
    {
        try 
        {
            const result = await productCalalogModel.remove(id);
            if(!result)
                throw new ApiError(StatusCodes.NOT_FOUND, "Delete failed, product catalog not found")
        }
        catch(error)
        {
            throw error
        }
    }
export const productCatalogService = {
    createNew, 
    getAll, 
    update,
    getById,
    remove
}