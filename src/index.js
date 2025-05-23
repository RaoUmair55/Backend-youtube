// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from "./app.js"

dotenv.config({
    path: './env'
})

connectDB()
.then(()=>{
    app.on("error", (error)=>{
        console.log("ERROR " ,error);
        throw error
    })
    app.listen(process.env.PORT || 3000 , ()=>{
        console.log(`Servier is runing at port : ${process.env.PORT}`);
    })
})
.catch((err) =>{
    console.log("Mongo db connecton faild" , err)
})




/*
approach 01
( async ()=>{
    try {
       await mongoos.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    } catch (error) {
        console.error("ERROR" ,error)
    }throw err
} )()

*/