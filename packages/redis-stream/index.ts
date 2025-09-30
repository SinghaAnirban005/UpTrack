import { createClient } from "redis"

const client = createClient()
                .on("error", (err) => {
                    console.log(err)
                })
                .connect()

type WebsiteEvent = {
        url: string
        id: string,
}

type MessageType = {
    id: string,
    message: {
        id: string,
        url: string
    }
}

const STREAM_NAME = "UpTrack:website"

async function xAdd({url, id}: WebsiteEvent){
    (await client).xAdd(
        STREAM_NAME, '*', {
            url,
            id
        }
    )
}

export const xAddBulk = async(websites: WebsiteEvent[]) => {
    for(let i = 0; i < websites.length; i++){
        await xAdd({
            url: websites[i]?.url as string,
            id: websites[i]?.id as string
        })
    }
}

export async function xReadGroup(consumerGroup: string, workerId: string){
    const res = (await client).xReadGroup(consumerGroup, workerId, {
        key: STREAM_NAME,
        id: '>'
    }, {
        COUNT: 5
    })
    //@ts-ignore
    let  messages: MessageType[] | undefined = res?.[0]?.messages;

    return messages
}

async function xAck(consumerGroup: string, eventId: string){
    (await client).xAck(STREAM_NAME, consumerGroup, eventId)
}

export const xAckBulk = async(consumerGroup: string, eventIds: string[]) => {
    eventIds.map(event => xAck(consumerGroup, event))
}