import { fetchUser } from "@/lib/api"
import { NextResponse } from "next/server"

export async function GET(request, { params }) {
    const userId = Number.parseInt(params.id)
    const searchParams = request.nextUrl.searchParams
    const skipCache = searchParams.get("skipCache") === "true"

    const response = await fetchUser(userId, skipCache)

    return NextResponse.json(response)
} 