import express, { Request, Response, NextFunction } from "express";
import logger from "morgan"
import cookieParser from "cookie-parser";

import userRouter from "./routes/users"
import indexRouter from "./routes/index"

import { db } from "./config/index"

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

//ROUTER MIDDLEWARE

app.use("/users", userRouter)
app.use("/", indexRouter)


const port = 3550

app.listen(port, () => {
    console.log(`DONE AT PORT :${port}`)
})

export default app