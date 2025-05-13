import { slugify } from "~/utils/fomatters";
import { productModel } from "~/models/productModel";
import { productCatalogModel } from "~/models/productCatalogModel";
import ApiError from "~/utils/apiError";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
const createNew = async (data)=>
{
    try 
    {
         
        const slug = slugify(data.name);
        const existedProductCatalog = await productCatalogModel.getBySlug(data.catalogSlug)
        if(!existedProductCatalog)
            throw new ApiError(StatusCodes.NOT_FOUND, 'Product catalog not found')
        const existedProduct = await productModel.getBySlug(slug);
        if(existedProduct)
            throw new ApiError(StatusCodes.CONFLICT, 'Product already exists')
        // const newData = {...data, productCatalogId: existedProductCatalog._id,slug }
        const {catalogSlug, ...validData} = data;
        validData.catalogId =existedProductCatalog._id;
        validData.slug = slug;
        await productModel.createNew(validData)
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
            throw new ApiError(StatusCodes.NOT_FOUND, "Product not found")
        return result;
    }
    catch(error)
    {
        throw error
    }
}
const getAll = async (productCatalogSlug)=>
{
    try 
    {
        const productCatalog = await productCatalogModel.getBySlug(productCatalogSlug)
        if(!productCatalog)
            throw new ApiError(StatusCodes.NOT_FOUND, 'Product catalog not found')
        return await productModel.getAll(productCatalog._id);
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