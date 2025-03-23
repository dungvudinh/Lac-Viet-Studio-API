import { slugify } from "~/utils/fomatters";
import { productModel } from "~/models/productModel";
import ApiError from "~/utils/apiError";
import { StatusCodes } from "http-status-codes";
const createNew = async (data)=>
{
    try 
    {
        const newData = {
            ...data, 
            slug:slugify(data.name)
        }
        const {insertedId} = await productModel.createNew(newData)
        return await productModel.getById(insertedId)
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
        const result = await productModel.getById(id)
        if(!result)
            throw new ApiError(StatusCodes.NOT_FOUND, "product not found")
        return result;
    }
    catch(error)
    {
        throw error
    }
}
const getAll = async ()=>
{
    try 
    {
        return await productModel.getAll();
    }
    catch(error)
    {
        throw error
    }
}
const update = async (id, data)=>
{
    try 
    {
        const newData = {
            ...data, 
            slug:slugify(data.name)
        }
        const result = await productModel.update(id, newData);
        if(!result)
            throw new ApiError(StatusCodes.NOT_FOUND, "update failed, product not found")
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
        const result = await productModel.remove(id);
        if(!result)
            throw new ApiError(StatusCodes.NOT_FOUND, "delete failed, product not found")
        return await productModel.getAll()
    }
    catch(error)
    {
        throw error
    }
}
export const productService = {
    createNew,
    getById,
    getAll,
    update,
    remove
}