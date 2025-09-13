import { app } from "../index";
import { Request, Response } from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { prismaClient } from "prisma/client"
 
app.post("/api/v1/login", (req, res) => {

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