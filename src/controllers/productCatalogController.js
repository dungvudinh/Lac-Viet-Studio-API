import { StatusCodes } from "http-status-codes";
import { productCatalogService } from "~/services/productCatalogService";
const createNew = async (req, res, next)=>{
    try
    {
        await productCatalogService.createNew(req.body);
        res.status(StatusCodes.CREATED).json({msg:'Create product catalog successfully'})
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
        await productCatalogService.update(req.body);
        res.status(StatusCodes.OK).json({msg:'Update product catalog successfully'})
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
        await productCatalogService.remove(id);
        return res.status(StatusCodes.OK).json({msg:'Delete product catalog successfully'})
    }
    catch(error)
    {
        console.log(error)
        next(error)
    }
}
export const productCatalogController  = {
    createNew,
    getAll, 
    getById,
    update,
    remove

}