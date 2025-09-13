import { app } from "../index";
import { Request, Response } from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { prismaClient } from "prisma/client"
 
app.post("/api/v1/login", async(req: Request, res: Response) => {
    const { username , password } = req.body();

    if(!username || password){
        res.status(401).json({
            message: "Username or Password is missing"
        })
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

    const isPasswordCorrect = await bcrypt.compare(user.password, password)

    if(!isPasswordCorrect){
        res.status(401).json({
            message: "Password is incorrect"
        })
        
        return;
    }

    const genToken = await jwt.sign({
        username: username
    }, process.env.JWT_SECRET)

    if(!genToken){
        res.status(401).json({
            message: "Token gen failed"
        })

        return;
    }

    res.status(200).json({
        message: {
            username: user.username;
            token: genToken
        }
    })

    return;

})

app.post("/api/v1/signup", async(req: Request, res: Response) => {
    const { username , password } = req.body();

    if(!username || password){
        res.status(401).json({
            message: "Username or Password is missing"
        })
    }

    const encryptedPass = await bcrypt.hash(password, 10);

    const existingUser = await prismaClient.user.findMany({
        where: {
            username: username
        }
    })

    if(existingUser){
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