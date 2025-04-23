import { Redis } from "@upstash/redis"

// Initialize Redis client using the REST API URL and token
const redis = new Redis({
    url: process.env.KV_REST_API_URL || "",
    token: process.env.KV_REST_API_TOKEN || "",
})

export async function getFromCache(key) {
    try {
        const cachedData = await redis.get(key)
        return cachedData
    } catch (error) {
        console.error("Redis get error:", error)
        return null
    }
}

export async function setCache(key, data, ttl) {
    try {
        if (ttl) {
            await redis.set(key, data, { ex: ttl })
        } else {
            await redis.set(key, data)
        }
    } catch (error) {
        console.error("Redis set error:", error)
    }
}

export async function deleteFromCache(key) {
    try {
        await redis.del(key)
    } catch (error) {
        console.error("Redis delete error:", error)
    }
}

export async function getCacheStats() {
    try {
        const keys = await redis.dbsize()
        return { keys }
    } catch (error) {
        console.error("Redis stats error:", error)
        return { keys: 0 }
    }
}

export { redis } 