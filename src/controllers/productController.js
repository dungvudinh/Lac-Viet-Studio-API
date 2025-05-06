import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/apiError";
import { productService } from "~/services/productService";
const createNew = async (req, res, next)=>{
    try
    {
        // if (!req.file) {
        //     throw new ApiError(StatusCodes.BAD_REQUEST, 'Image is required');
        // }
        console.log(req)
        const result = await productService.createNew({
            ...req.body
            // image: req.file.path
        });
        res.status(StatusCodes.CREATED).json(result)
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
        console.log('Get All Method')
        const result = await productService.getAll();
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