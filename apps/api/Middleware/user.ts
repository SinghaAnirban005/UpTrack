import { prismaClient } from "prisma/client"
import jwt from "jsonwebtoken"
import { NextFunction, Request, Response } from "express"

export const userMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    try {

        const token = req.headers["authorization"]?.split("Bearer ")[1];

        if(!token){
            res.status(400).json({
                message: "Token does not exist"
            })
            return;
        }


        const verifyToken = await  jwt.verify(token, process.env.JWT_SECRET as string)

        if(!verifyToken){
            res.status(400).json({
                message: "Token is incorrect"
            })
        
            return;
        }

        const user = await prismaClient.user.findFirst({
            where: {
                //@ts-ignore
                id: verifyToken?.id
            }
        })

        //@ts-ignore
        req.userId = user.id

        next()


    } catch (error) {
        res.status(500).json({
            message: "Middleware failed"
        })
    }
}