import { prismaClient } from "prisma/client"
import { xAddBulk } from "redis-stream/redis"


async function main() {
    let websites = await prismaClient.website.findMany({
        select: {
            url: true,
            id: true
        }
    })

    await xAddBulk(websites.map(website => (
        {
            url: website.url,
            id: website.id
        }
    )))
    
}

setInterval(() => {
    main()
}, 3 * 1000 * 60)