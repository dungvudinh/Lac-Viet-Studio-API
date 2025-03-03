import express from "express";
import {StatusCodes} from 'http-status-codes'
import { BoardRoutes } from './boardRoutes.js'

const Router = express.Router();

Router.get("/status", async (req, res) => {res.status(StatusCodes.OK).json({ message: "Hello World" })});
Router.use('/boards', BoardRoutes)


export default Router;