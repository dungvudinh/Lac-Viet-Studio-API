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
        throw new Error(error);
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
        throw new Error(error)
    }
}

const getById = async (id)=>
{
    try 
    {
        return await productCalalogModel.getById(id);
    }
    catch(error)
    {
        throw new Error(error)
    }
}
const update  = async (id, newData) =>
{
    try 
    {
        return await productCalalogModel.update(id, newData)
    }
    catch(error)
    {
        throw new Error(error)
    }
}
export const productCatalogService = {
    createNew, 
    getAll, 
    update,
    getById
}