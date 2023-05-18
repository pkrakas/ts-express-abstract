import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { NextFunction, Request, Response } from "express";

export default (err: Error, req: Request, res: Response, next: NextFunction) => {
    const statusCode = res.statusCode ? res.statusCode : 500
    
    res.status(statusCode).send({
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : null
    })
}