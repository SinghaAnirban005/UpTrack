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
                    take: 5
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
                status: websiteStatus.ticks,
                data: websiteStatus
            }
        })
        return
    } catch (error) {
        res.status(500).json({
            message: `Server failed ${error}`
        })
    }
})

router.get('/website', userMiddleware, async(req, res) => {
    //@ts-ignore
    const userId = req?.userId
    try {
        const websites = await prismaClient.website.findMany({
            where: {
                user_id: userId,
            },
            orderBy: {
                "time_added": "desc"
            },
            include: {
                ticks: true
            }
        })

        if(websites.length === 0){
            res.status(401).json(
                {
                    message: "No websites availiable"
                }
            )

            return
        }

        res.status(200).json(
            {
                websites: websites
            }
        )

        return;
    } catch (error) {
        console.error(error)
        res.status(500).json(
            {
                message: error
            }
        )
        return
    }
})

router.post("/region", async (req, res) => {
  try {
    const { REGION_ID } = req.body;

    if (!REGION_ID) {
      return res.status(400).json({
        message: "REGION_ID is required",
      });
    }

    const existingRegion = await prismaClient.region.findUnique({
      where: { id: REGION_ID },
    });
    
    if (existingRegion) {
      return res.status(409).json({
        message: "Region already exists",
        region: existingRegion,
      });
    }

    const region = await prismaClient.region.create({
      data: {
        id: REGION_ID,
        name: REGION_ID,
      },
    });

    return res.status(201).json({
      message: "Region created successfully",
      region,
    });
  } catch (error) {
    console.error("Error creating region:", error);
    return res.status(500).json({
      message: "Failed to create region",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});


export default router