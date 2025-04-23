import { getCacheStats } from "@/lib/redis"
import { NextResponse } from "next/server"

export async function GET() {
    const stats = await getCacheStats()
    return NextResponse.json(stats)
} 