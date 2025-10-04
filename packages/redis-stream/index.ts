import { createClient } from "redis"
import axios from "axios"

const client = createClient({
  url: process.env.REDIS_URL as string
})
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

export const xReadGroup = async (consumerGroup: string, workerId: string) => {
  try {
    const res = await (await client).xReadGroup(
      consumerGroup,
      workerId,
      {
        key: STREAM_NAME,
        id: '>'
      },
      {
        COUNT: 5,
        BLOCK: 5000
      }
    );

    //@ts-ignore
    let messages: MessageType[] | undefined = res?.[0]?.messages;
    return messages;
  } catch (err: any) {
    if (err.message.includes("NOGROUP")) {
      console.warn(`Consumer group ${consumerGroup} not found on stream. Creating it now...`);
      await client.xGroupCreate(STREAM_NAME, consumerGroup, "$", { MKSTREAM: true });
      return [];
    }
    throw err;
  }
};


async function xAck(consumerGroup: string, eventId: string){
    (await client).xAck(STREAM_NAME, consumerGroup, eventId)
}

export const xAckBulk = async(consumerGroup: string, eventIds: string[]) => {
    await eventIds.map(event => xAck(consumerGroup, event))
}

export const xCreateGroup = async (consumerGroup: string) => {
  try {
    const res = await axios.post(`http://localhost:8000/api/v1/region`, {
      REGION_ID: consumerGroup,
    });

    if (res.status === 201 || res.status === 200) {
      console.log(`Region ${consumerGroup} created successfully.`);
      await client.xGroupCreate(STREAM_NAME, consumerGroup, "$", { MKSTREAM: true });
    }
  } catch (err: any) {
    if (err.response?.status === 409) {
      // Region already exists in DB — safe to skip creation
      console.log(`Region ${consumerGroup} already exists, skipping creation.`);
    } else if (err.message?.includes("BUSYGROUP")) {
      // Redis consumer group already exists — safe to ignore
      console.log(`Consumer group ${consumerGroup} already exists in Redis, skipping creation.`);
    } else {
      console.error("Error creating consumer group:", err.message || err);
      throw err;
    }
  }
};
