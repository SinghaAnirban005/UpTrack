import { prismaClient } from "prisma/client"
import { xAddBulk } from "redis-stream/client"

async function main() {

    console.log("entering main ")
    let websites = await prismaClient.website.findMany({
        select: {
            url: true,
            id: true
        }
    })

    if(websites.length > 0){
        await xAddBulk(websites.map(website => (
            {
                url: website.url,
                id: website.id
            }
        )))

        console.log('pushed to redis stream')
    }
    
}

setInterval(() => {
    main()
}, 20 * 1000)

main()