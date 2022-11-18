import express, { Request, Response, NextFunction } from "express";

export const Index = (req: Request, res: Response) => {
    try {
        res.status(200).send(`Welcome to Kings Shop ....`)

    } catch (error) {
        console.log(error)
    }
}