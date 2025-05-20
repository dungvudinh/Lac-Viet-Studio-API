import { StatusCodes } from "http-status-codes";
import { productService } from "~/services/productService";

const createNew = async (req, res, next)=>{
    try
    {
      if(!req.files)
        res.status(StatusCodes.BAD_REQUEST).json({msg:"No file uploaded"})
      else 
      {
        const {productCatalogSlug} = req.params;
        const files = req.files;
        await productService.createNew(productCatalogSlug, files, req.body)
        res.status(StatusCodes.CREATED).json({msg:'Create product successfully'})
      }
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
        if(!req.files)
          res.status(StatusCodes.BAD_REQUEST).json({msg:'No file uploaded'})
        else 
        {
          const {productCatalogSlug, id} = req.params;
          await productService.update(productCatalogSlug, id, req.files, req.body);
          return res.status(StatusCodes.OK).json({msg:'Update product successfully'})
        }
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
        const {productCatalogSlug,id} = req.params;
        console.log(productCatalogSlug)
        await productService.remove(productCatalogSlug,id);
        return res.status(StatusCodes.OK).json({msg:'Delete product successfully'})
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