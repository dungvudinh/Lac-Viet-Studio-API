import { MongoClient,ServerApiVersion } from "mongodb";
import { env } from "./environment.js";
//dunggdev:AY1lqYnMthLWFNZU

let lacVietStudioInstance = null;
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
    serverApi:{
        version:ServerApiVersion.v1,
        strict:true, 
        deprecationErrors:true
    }
})

export const CONNECT_DB = async () =>{
    await mongoClientInstance.connect();
    lacVietStudioInstance = mongoClientInstance.db(env.DATABASE_NAME);
}
export const GET_DB = ()=>{
    if(!lacVietStudioInstance) throw new Error('Must connect to Database first');
    return lacVietStudioInstance;
}

export const CLOSE_DB = async ()=>{
    await mongoClientInstance.close();
}