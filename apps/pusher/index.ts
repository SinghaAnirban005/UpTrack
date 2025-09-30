import { prismaClient } from "prisma/client"
import { xAddBulk } from "redis-stream/client"

async function main() {
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
    }
    
}

setInterval(() => {
    main()
}, 3 * 1000 * 60)