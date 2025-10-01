import { Express } from "express"
import express from "express"
import "dotenv/config"
import authRoutes from "../api/Controllers/Auth.js"
import websiteRoutes from "../api/Controllers/Website.js"
import cors from "cors"

export const app: Express = express()

app.use(express.json())
app.use(cors())

const PORT = process.env.PORT_NO

app.use("/api/v1", authRoutes)
app.use("/api/v1", websiteRoutes)

app.listen(PORT, (err) => {
    if(err){
        console.error("Failed to start server")
    }

    console.log(`Server running on port ${PORT}`)
})