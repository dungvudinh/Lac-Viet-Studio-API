import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/apiError";
import { productCatalogService } from "~/services/productCatalogService";
const createNew = async (req, res, next)=>{
    try
    {
        const result = await productCatalogService.createNew(req.body);
        console.log(result)
        res.status(StatusCodes.CREATED).json(result)
    }
    catch(error)
    {
        next(error)
    }
}

const getAll = async (req, res, next)=>
{
    try 
    {
        const result = await productCatalogService.getAll();
        res.status(StatusCodes.OK).json(result)
    }
    catch(error)
    {
        next(error)
    }
}
const getById = async (req, res, next)=>
{
    try 
    {
        const result = await productCatalogService.getById(req.params.id);
        res.status(StatusCodes.OK).json(result);
    }
    catch(error)
    {
        next(error)
    }
}
const update = async (req,res, next)=>
{
    try 
    {
        const {id} = req.params;
        const newData = req.body;
        const result = await productCatalogService.update(id, newData);
        res.status(StatusCodes.OK).json(result)
    }
    catch(error)
    {
        next(error)
    }
}
export const productCatalogController  = {
    createNew,
    getAll, 
    getById,
    update
    
}