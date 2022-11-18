import express, { Request, Response, NextFunction } from "express";
import { Index } from "../controller/indexController"


const router = express.Router()

router.get('/', Index)

export default router