"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Loader2 } from "lucide-react"

export default function PerformancePage() {
    const [loading, setLoading] = useState(true)
    const [testing, setTesting] = useState(false)
    const [postsData, setPostsData] = useState([])
    const [usersData, setUsersData] = useState([])
    const [cacheStats, setCacheStats] = useState(null)

    const fetchCacheStats = async () => {
        try {
            const response = await fetch("/api/cache/stats")
            const data = await response.json()
            setCacheStats(data)
        } catch (error) {
            console.error("Error fetching cache stats:", error)
        }
    }

    const runPerformanceTest = async () => {
        setTesting(true)

        // Test posts performance
        const postsResults = []
        for (let i = 1; i <= 5; i++) {
            // With cache
            const withCacheResponse = await fetch(`/api/posts?skipCache=false`)
            const withCacheData = await withCacheResponse.json()

            // Without cache
            const withoutCacheResponse = await fetch(`/api/posts?skipCache=true`)
            const withoutCacheData = await withoutCacheResponse.json()

            const improvement = ((withoutCacheData.duration - withCacheData.duration) / withoutCacheData.duration) * 100

            postsResults.push({
                id: i,
                withCache: withCacheData.duration,
                withoutCache: withoutCacheData.duration,
                improvement,
            })
        }
        setPostsData(postsResults)

        // Test users performance
        const usersResults = []
        for (let i = 1; i <= 5; i++) {
            // With cache
            const withCacheResponse = await fetch(`/api/users?skipCache=false`)
            const withCacheData = await withCacheResponse.json()

            // Without cache
            const withoutCacheResponse = await fetch(`/api/users?skipCache=true`)
            const withoutCacheData = await withoutCacheResponse.json()

            const improvement = ((withoutCacheData.duration - withCacheData.duration) / withoutCacheData.duration) * 100

            usersResults.push({
                id: i,
                withCache: withCacheData.duration,
                withoutCache: withoutCacheData.duration,
                improvement,
            })
        }
        setUsersData(usersResults)

        // Update cache stats
        await fetchCacheStats()

        setTesting(false)
        setLoading(false)
    }

    useEffect(() => {
        fetchCacheStats()
        runPerformanceTest()
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Performance Benchmarking</h1>
                <p className="text-muted-foreground">Compare API response times with and without Redis caching</p>
            </div>

            <div className="flex justify-between items-center">
                <div>
                    {cacheStats && (
                        <p className="text-sm text-muted-foreground">
                            Current Redis cache: <span className="font-medium">{cacheStats.keys} keys</span>
                        </p>
                    )}
                </div>
                <Button onClick={runPerformanceTest} disabled={testing}>
                    {testing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Run Performance Test
                </Button>
            </div>

            <Tabs defaultValue="posts">
                <TabsList>
                    <TabsTrigger value="posts">Posts API</TabsTrigger>
                    <TabsTrigger value="users">Users API</TabsTrigger>
                </TabsList>

                <TabsContent value="posts" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Posts API Performance</CardTitle>
                            <CardDescription>Comparing response times with and without Redis caching</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading || testing ? (
                                <div className="flex justify-center items-center h-[300px]">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                <div className="h-[300px]">
                                    <ChartContainer
                                        config={{
                                            withCache: {
                                                label: "With Redis Cache (ms)",
                                                color: "hsl(var(--chart-1))",
                                            },
                                            withoutCache: {
                                                label: "Without Cache (ms)",
                                                color: "hsl(var(--chart-2))",
                                            },
                                        }}
                                    >
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={postsData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="id" label={{ value: "Request Number", position: "insideBottom", offset: -5 }} />
                                                <YAxis label={{ value: "Response Time (ms)", angle: -90, position: "insideLeft" }} />
                                                <ChartTooltip content={<ChartTooltipContent />} />
                                                <Legend />
                                                <Line
                                                    type="monotone"
                                                    dataKey="withCache"
                                                    stroke="var(--color-withCache)"
                                                    name="With Redis Cache (ms)"
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="withoutCache"
                                                    stroke="var(--color-withoutCache)"
                                                    name="Without Cache (ms)"
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </ChartContainer>
                                </div>
                            )}

                            {!loading && !testing && postsData.length > 0 && (
                                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium">Avg. With Cache</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-2xl font-bold">
                                                {(postsData.reduce((acc, item) => acc + item.withCache, 0) / postsData.length).toFixed(2)}ms
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium">Avg. Without Cache</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-2xl font-bold">
                                                {(postsData.reduce((acc, item) => acc + item.withoutCache, 0) / postsData.length).toFixed(2)}ms
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium">Avg. Improvement</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-2xl font-bold">
                                                {(postsData.reduce((acc, item) => acc + item.improvement, 0) / postsData.length).toFixed(2)}%
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Users API Performance</CardTitle>
                            <CardDescription>Comparing response times with and without Redis caching</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading || testing ? (
                                <div className="flex justify-center items-center h-[300px]">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                <div className="h-[300px]">
                                    <ChartContainer
                                        config={{
                                            withCache: {
                                                label: "With Redis Cache (ms)",
                                                color: "hsl(var(--chart-1))",
                                            },
                                            withoutCache: {
                                                label: "Without Cache (ms)",
                                                color: "hsl(var(--chart-2))",
                                            },
                                        }}
                                    >
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={usersData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="id" label={{ value: "Request Number", position: "insideBottom", offset: -5 }} />
                                                <YAxis label={{ value: "Response Time (ms)", angle: -90, position: "insideLeft" }} />
                                                <ChartTooltip content={<ChartTooltipContent />} />
                                                <Legend />
                                                <Line
                                                    type="monotone"
                                                    dataKey="withCache"
                                                    stroke="var(--color-withCache)"
                                                    name="With Redis Cache (ms)"
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="withoutCache"
                                                    stroke="var(--color-withoutCache)"
                                                    name="Without Cache (ms)"
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </ChartContainer>
                                </div>
                            )}

                            {!loading && !testing && usersData.length > 0 && (
                                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium">Avg. With Cache</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-2xl font-bold">
                                                {(usersData.reduce((acc, item) => acc + item.withCache, 0) / usersData.length).toFixed(2)}ms
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium">Avg. Without Cache</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-2xl font-bold">
                                                {(usersData.reduce((acc, item) => acc + item.withoutCache, 0) / usersData.length).toFixed(2)}ms
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium">Avg. Improvement</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-2xl font-bold">
                                                {(usersData.reduce((acc, item) => acc + item.improvement, 0) / usersData.length).toFixed(2)}%
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
} 