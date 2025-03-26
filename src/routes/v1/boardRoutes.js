import express from "express";
import {StatusCodes} from 'http-status-codes'
import { BoardValidation } from "~/validations/boardValidation.js";
const Router = express.Router();
Router.route('/')
    .get((req, res) => {
        res.status(StatusCodes.OK).json({ message: "HELLO WORLD" })
    })
    .post(BoardValidation.createNew)

    export const BoardRoutes = Router;