import { slugify } from "~/utils/fomatters";
import { productCalalogModel } from "~/models/productCatalogModel";
const createNew = async(data)=>
{
    try 
    {
        const newData = {...data, slug: slugify(data.name)};
        const {insertedId} =await productCalalogModel.createNew(newData);
        //return new data 
        return await productCalalogModel.getById(insertedId)
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
const update  = async (id, data) =>
{
    try 
    {
        const newData = {
            ...data, 
            slug:slugify(data.name)
        }
        const result = await productCalalogModel.update(id, newData);
        if(!result)
            throw new ApiError(StatusCodes.NOT_FOUND, "update failed, product catalog not found")
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
                throw new ApiError(StatusCodes.NOT_FOUND, "delete failed, product catalog not found")
            return await productCalalogModel.getAll()
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