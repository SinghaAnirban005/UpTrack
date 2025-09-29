import { Express } from "express"
import express from "express"
import "dotenv/config"
import authRoutes from "../api/Controllers/Auth.js"

export const app: Express = express()

app.use(express.json())

const PORT = process.env.PORT_NO

app.use("/api/v1", authRoutes)

app.listen(PORT, (err) => {
    if(err){
        console.error("Failed to start server")
    }

    console.log(`Server running on port ${PORT}`)
})