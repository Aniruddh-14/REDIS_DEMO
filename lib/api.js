import { getFromCache, setCache } from "./redis"

// Default TTL for cache items (5 minutes)
const DEFAULT_TTL = 300

export async function fetchWithCache(url, cacheKey, ttl = DEFAULT_TTL, skipCache = false) {
    const startTime = performance.now()

    // Try to get data from cache if not skipping cache
    if (!skipCache) {
        const cachedData = await getFromCache(cacheKey)
        if (cachedData) {
            const duration = performance.now() - startTime
            return {
                data: cachedData,
                source: "cache",
                duration,
            }
        }
    }

    // If not in cache or skipping cache, fetch from API
    const response = await fetch(url)
    const data = await response.json()

    // Store in cache if not skipping cache
    if (!skipCache) {
        await setCache(cacheKey, data, ttl)
    }

    const duration = performance.now() - startTime
    return {
        data,
        source: "api",
        duration,
    }
}

export async function fetchPosts(skipCache = false) {
    return fetchWithCache("https://jsonplaceholder.typicode.com/posts", "posts", DEFAULT_TTL, skipCache)
}

export async function fetchPost(id, skipCache = false) {
    return fetchWithCache(`https://jsonplaceholder.typicode.com/posts/${id}`, `post:${id}`, DEFAULT_TTL, skipCache)
}

export async function fetchUsers(skipCache = false) {
    return fetchWithCache("https://jsonplaceholder.typicode.com/users", "users", DEFAULT_TTL, skipCache)
}

export async function fetchUser(id, skipCache = false) {
    return fetchWithCache(`https://jsonplaceholder.typicode.com/users/${id}`, `user:${id}`, DEFAULT_TTL, skipCache)
} 