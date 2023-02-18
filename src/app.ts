import express, { Request, Response, NextFunction } from "express";
import logger from "morgan"
import cookieParser from "cookie-parser";
import cors from 'cors'

import userRouter from "./routes/users"
import adminRouter from "./routes/admin"
import indexRouter from "./routes/index"
import vendorRouter from "./routes/vendor"


import { db } from "./config/index";
import dotenv from "dotenv";
dotenv.config()

//SEQUELIZE CONNECTION

// db.sync({ force: true }).then(() => {
db.sync().then(() => {

    console.log('Db connected successfully')
}).catch(err => {
    console.log(err)
})


const app = express();

app.use(express.json());
app.use(logger('dev'))
app.use(cookieParser())
app.use(cors())

//ROUTER MIDDLEWARE

app.use("/", indexRouter)
app.use("/users", userRouter)
app.use("/admins", adminRouter)
app.use("/vendors", vendorRouter)



const port = 3550

app.listen(port, () => {
    console.log(`DONE AT PORT :${port}`)
})

export default app