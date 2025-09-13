import express from "express"
import { Express } from "express"
import "dotenv/config"

export const app: Express = express()

app.use(express.json())

const PORT = process.env.PORT_NO

app.listen(PORT, (err) => {
    if(err){
        console.error("Failed to start server")
    }

    console.log(`Server running on port ${PORT}`)
})