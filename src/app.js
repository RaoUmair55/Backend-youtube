import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser" // to manage cookies from server

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"})) // to accept form data

app.use(express.urlencoded({extended: true ,limit:"16kb"})) //to accept data from url

app.use(express.static("public")) //pdf picture etc for public anyone can accept

app.use(cookieParser())

export {app}