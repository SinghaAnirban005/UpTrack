import { Router } from "express";
import { prismaClient } from "prisma/client";
import { userMiddleware } from "../Middleware/user.js";

const router: Router = Router()

router.post("/website", userMiddleware, async(req, res) => {

    const { url } = req.body;

    if(!url){
        res.status(401).json({
            message: "URL missing !!"
        })

        return;
    }

    try {
        const website = await prismaClient.website.create({
            data: {
                url: url,
                //@ts-ignore
                user_id: req.userId as string,
                time_added: new Date()
            }
        })

        if(!website){
            res.status(401).json({
                message: "Enter details correctly"
            })

            return
        }

        res.status(200).json({
            message: "Website stored succesfully"
        })

        return;


    } catch (error) {
        res.status(500).json({
            message: `Server Failed : ${error}`
        })

        return
    }
})

router.get("/website/:websiteId", userMiddleware, async(req, res) => {
    try {
        const websiteStatus = await prismaClient.website.findFirst({
            where: {
                id: req.params.websiteId as string,
                //@ts-ignore
                user_id: req.userId as string
            },
            include: {
                ticks: {
                    orderBy: {
                        createdAt: "desc"
                    },
                    take: 1
                }
            }
        })

        if(!websiteStatus){
            res.status(400).json({
                message: "Failed to fetch status"
            })

            return;
        }

        res.status(200).json({
            data: {
                status: websiteStatus.ticks
            }
        })
    } catch (error) {
        res.status(500).json({
            message: `Server failed ${error}`
        })
    }
})

export default router