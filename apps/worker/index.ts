import "dotenv/config"
import axios from "axios"
import { prismaClient } from "prisma/client"
import { xReadGroup, xAckBulk, xCreateGroup } from "redis-stream/client"

// const REGION_ID = process.env.REGION_ID as string
const REGION_ID = 'usa'
// const WORKER_ID = process.env.WORKER_ID as string
const WORKER_ID = 'worker-1'

async function main() {

    console.log('entering main')
    // Before reading from groups need to ensure that the consumer group is created
    await xCreateGroup(REGION_ID)
    
    while(1) {
        const response = await xReadGroup(REGION_ID, WORKER_ID)

        if(!response){
            continue
        }

        console.log('logging response ', response)

        let promises = response?.map(({message}) => fetchWebsite(message.url, message.id))

        await Promise.all(promises as [])

        await xAckBulk(REGION_ID, response?.map((event) => event.id) as string[])
    }
}

async function fetchWebsite(url: string, websiteId: string) {
    return new Promise<void>(async (resolve, reject) => {
        const startTime = Date.now()

        await axios.get(url)
                   .then( async () => {
                        const endTime = Date.now()
                        await prismaClient.websiteTick.create({
                            data: {
                                response_time_ms: endTime - startTime,
                                status: "Up",
                                region_id: REGION_ID,
                                website_id: websiteId
                            }
                        })

                        resolve()
                   })
                   .catch(async() => {
                        const endTime = Date.now()
                        await prismaClient.websiteTick.create({
                            data: {
                                response_time_ms: endTime - startTime,
                                status: "Down",
                                region_id: REGION_ID,
                                website_id: websiteId
                            }
                        })

                        resolve()
                   })
    })
}

main()