import { slugify } from "~/utils/fomatters";
const createNew = async (data)=>
{
    try 
    {
        const newBoard = {
            ...data, 
            slug:slugify(data.title)
        }
        return newBoard
    }
    catch(error)
    {
        throw error;
    }
}

export const boardService = {
    createNew
}