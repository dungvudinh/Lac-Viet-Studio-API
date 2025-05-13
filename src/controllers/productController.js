import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/apiError";
import { productService } from "~/services/productService";
const createNew = async (req, res, next)=>{
    try
    {
        const images = req.files.map((file, index)=>{
            var isRepresentative = false;
            if(index === 0) isRepresentative = true;
            return {url:file.path, isRepresentative}
        })
        const newProduct = {...req.body, images};
        await productService.createNew(newProduct);
        res.status(StatusCodes.CREATED).json({msg:'Create product successfully'})
    }
    catch(error)
    {
        console.log(error)
        next(error)
    }
}

const getById = async (req, res, next)=>
{
    try
    {
        const result = await productService.getById(req.params.id);
        res.status(StatusCodes.OK).json(result)
    }
    catch(error)
    {
        console.log(error)
        next(error)
    }
}
const getAll = async (req, res, next)=>
{
    try 
    {
        const {productCatalogSlug} = req.params;
        const result = await productService.getAll(productCatalogSlug);
        res.status(StatusCodes.OK).json(result)
    }
    catch(error)
    {
        next(error)
    }
}

const update = async (req, res, next)=>
{
    try 
    {
        const {id} = req.params;
        const result = await productService.update(id, req.body);
        return res.status(StatusCodes.OK).json(result)
    }
    catch(error)
    {
        next(error)
    }
}
const remove = async (req, res, next)=>
{
    try 
    {
        const {id} = req.params;
        const result = await productService.remove(id);
        return res.status(StatusCodes.OK).json(result)
    }
    catch(error)
    {
        next(error)
    }
}
export const productController  = {
    createNew,
    getById,
    getAll,
    update,
    remove
}