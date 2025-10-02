import { createClient } from "redis"
import axios from "axios"

const client = createClient()
                .on("error", (err) => {
                    console.log(err)
                })

client.connect()

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

export const xReadGroup = async(consumerGroup: string, workerId: string) => {
    const res = await (await client).xReadGroup(consumerGroup, workerId, {
        key: STREAM_NAME,
        id: '>'
    }, {
        COUNT: 5
    })

    console.log('res ', res)
    //@ts-ignore
    let  messages: MessageType[] | undefined = res?.[0]?.messages;

    return messages
}

async function xAck(consumerGroup: string, eventId: string){
    (await client).xAck(STREAM_NAME, consumerGroup, eventId)
}

export const xAckBulk = async(consumerGroup: string, eventIds: string[]) => {
    await eventIds.map(event => xAck(consumerGroup, event))
}

export const xCreateGroup = async (consumerGroup: string) => {
    const res = await axios.post(`http://localhost:8000/api/v1/region`, {
        REGION_ID: consumerGroup
    })

    if (res.status !== 200) return

    await client.xGroupCreate(STREAM_NAME, consumerGroup, "$", { MKSTREAM: true })

    console.log('Successfully created Group')
}