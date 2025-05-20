import { slugify } from "~/utils/fomatters";
import { productModel } from "~/models/productModel";
import { productCatalogModel } from "~/models/productCatalogModel";
import ApiError from "~/utils/apiError";
import { StatusCodes } from "http-status-codes";
import sharp from "sharp";
import cloudinary from "~/config/cloudinary";
import path from 'path'
import {optimizeImages, uploadImagesToCloudinary} from '~/utils/imageOptimize';
const createNew = async (productCatalogSlug, files, product)=>
{
    try 
    {
        const slug = slugify(product.name);
        const existedProductCatalog = await productCatalogModel.getBySlug(productCatalogSlug)
        if(!existedProductCatalog)
            throw new ApiError(StatusCodes.NOT_FOUND, 'Product catalog not found')
        const existedProduct = await productModel.getBySlug(slug);
        if(existedProduct)
            throw new ApiError(StatusCodes.CONFLICT, 'Product already exists')
          //optimize image
        const processedImages = await optimizeImages(files);
          // Upload to Cloudinary
        const cloudinaryResults = await uploadImagesToCloudinary(processedImages);
        const images = cloudinaryResults.map((file, index)=>{
            var isRepresentative = false;
            if(index === 0) isRepresentative = true;
            return {url:file.url, isRepresentative, publicId: file.public_id}
        })
        product.catalogId =existedProductCatalog._id;
        product.slug = slug;
        product.images = images;
        await productModel.createNew(product)
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
const update = async (productCatalogSlug,productId,files,product)=>
{
    try 
    {
        const slug = slugify(product.name);
        const existedProductCatalog = await productCatalogModel.getBySlug(productCatalogSlug)
        if(!existedProductCatalog)
            throw new ApiError(StatusCodes.NOT_FOUND, 'Product catalog not found')
        const existedProduct = await productModel.getById(productId);
        if(!existedProduct)
            throw new ApiError(StatusCodes.CONFLICT, 'Product not found')
        const {imageDeletedIds, ...validData} = product;
        const imageDeletedIdsParse = JSON.parse(imageDeletedIds)
        //handle delete image in db 
        if(imageDeletedIdsParse.length > 0)
        {
            imageDeletedIdsParse.forEach(async image=>{
                await productModel.removeImage(existedProductCatalog._id, productId, image.publicId)
                await cloudinary.uploader.destroy(image.publicId)
            })
        }
         //optimize image
        const processedImages = await optimizeImages(files);
         // Upload to Cloudinary
        const cloudinaryResults = await uploadImagesToCloudinary(processedImages);
        const images = cloudinaryResults.map((file, index)=>{
            var isRepresentative = false;
            if(index === 0)
              if(imageDeletedIdsParse.some(image=> image.publicId === true))
                isRepresentative = true;              
            return {url:file.url, isRepresentative, publicId: file.public_id}
        })
        validData.catalogId =existedProductCatalog._id;
        validData.slug = slug;
        validData.images = images;
        await productModel.update(existedProductCatalog._id, productId,validData)
    }
    catch(error)
    {
        throw error
    }
}
const remove = async (productCatalogSlug,id)=>
{
    try 
    {
        const existedProductCatalog = await productCatalogModel.getBySlug(productCatalogSlug)
        console.log(!existedProductCatalog)

        // if(!existedProductCatalog)
        //     throw new ApiError(StatusCodes.NOT_FOUND, 'Product catalog not found')
        const result = await productModel.remove(existedProductCatalog._id,id);
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