import { Request, Response } from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { prismaClient } from "prisma/client"
import "dotenv/config"
import { Router } from "express";
import { userMiddleware } from "../Middleware/user.js";

const router:Router  = Router()
 
router.post("/login", async(req: Request, res: Response) => {
    const { username , password } = req.body;

    if(!username || !password){
        res.status(401).json({
            message: "Username or Password is missing"
        })

        return;
    }

    const user = await prismaClient.user.findFirst({
        where: {
            username: username
        }
    })

    if(!user){
        res.status(401).json({
            message: "No user exists"
        })

        return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if(!isPasswordCorrect){
        res.status(401).json({
            message: "Password is incorrect"
        })
        
        return;
    }

    const genToken = await jwt.sign({
        username: username
    }, process.env.JWT_SECRET as string)

    if(!genToken){
        res.status(401).json({
            message: "Token gen failed"
        })

        return;
    }

    res.status(200).json({
        message: {
            username: user.username,
            token: genToken
        }
    })

    return;

})

router.post("/signup", async(req: Request, res: Response) => {
    const { username , password } = req.body;

    if(!username || !password){
        res.status(401).json({
            message: "Username or Password is missing"
        })
        return;
    }

    const encryptedPass = await bcrypt.hash(password, 10);

    const existingUser = await prismaClient.user.findMany({
        where: {
            username: username
        }
    })

    if(existingUser.length > 0){
        res.status(401).json({
            message: "User already exists"
        })
        
        return;
    }

    const newUser = await prismaClient.user.create({
        data: {
            username: username,
            password: encryptedPass
        }
    })

    if(!newUser){
        res.status(401).json({
            message: "Failed to create User"
        })

        return;
    }

    res.status(200).json({
        message: {
            username: username
        }
    })

    return
})

router.post("/logout", userMiddleware, async(req: Request, res: Response) => {
    //@ts-ignore
    req.userId = null;

    res.status(200).json({
        message: "Logged out"
    })

    return
})

export default router