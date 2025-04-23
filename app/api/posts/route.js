import { fetchPosts } from "@/lib/api"
import { NextResponse } from "next/server"

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams
    const skipCache = searchParams.get("skipCache") === "true"

    const response = await fetchPosts(skipCache)

    return NextResponse.json(response)
} 