import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/apiError";
import { boardService } from "~/services/productService";
const createNew = async (req, res, next)=>{
    try
    {
        const createBoard = await boardService.createNew(req.body);
        console.log(createBoard)
        res.status(StatusCodes.CREATED).json(createBoard)
    }
    catch(error)
    {
        next(error)
    }
}

export const productController  = {
    createNew
}