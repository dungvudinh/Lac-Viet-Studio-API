import express from 'express'
import { CONNECT_DB, GET_DB, CLOSE_DB } from './config/mongodb.js'
import AsyncExitHook from 'async-exit-hook'
import {env} from './config/environment.js'
import  APIs_V1  from './routes/v1/index.js'
import cors from 'cors'
import path from 'path'
const app = express()
const hostName = 'localhost'
const START_SERVER =  ()=>{
    app.use(cors())
    app.use(express.static(path.join(__dirname, 'build', 'src')));
    app.use('/v1', APIs_V1)
    app.use(express.json())
    app.use(express.urlencoded({extended:true}))
    
    app.listen(env.APP_PORT, env.APP_HOST, ()=> console.log(`server is running on port:${env.APP_PORT}`))
    AsyncExitHook(()=>{
        console.log('Disconnecting from Database')
        CLOSE_DB()
        console.log('Disconnected from Database')
    })
}

(async ()=>{
    try 
    {
        console.log('Connecting to Database')
        await CONNECT_DB()
        console.log('Connected to Database')
        START_SERVER()
    }
    catch(error)
    {
        console.error(error)
        process.exit(0)
    }
   
})()
