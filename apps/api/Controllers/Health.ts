import { Router } from "express";

const router: Router = Router()

router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        uptime: process.uptime()
    })
})

export default router