"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function UserProfilePage({ params }) {
    const userId = Number.parseInt(params.id)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [source, setSource] = useState(null)
    const [duration, setDuration] = useState(null)
    const [refreshing, setRefreshing] = useState(false)

    const fetchUser = async (skipCache = false) => {
        setRefreshing(true)
        try {
            const response = await fetch(`/api/users/${userId}?skipCache=${skipCache}`)
            const data = await response.json()
            setUser(data.data)
            setSource(data.source)
            setDuration(data.duration)
        } catch (error) {
            console.error("Error fetching user:", error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [userId])

    return (
        <div className="space-y-6">
            <Button asChild variant="outline" size="sm">
                <Link href="/users">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Users
                </Link>
            </Button>

            {loading ? (
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-1/3" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </CardContent>
                </Card>
            ) : user ? (
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                            {source && (
                                <Badge variant={source === "cache" ? "secondary" : "outline"}>
                                    {source === "cache" ? "Served from Redis cache" : "Fetched from API"}
                                </Badge>
                            )}
                            {duration && <span className="text-xs text-muted-foreground">Fetched in {duration.toFixed(2)}ms</span>}
                        </div>
                        <CardTitle>{user.name}</CardTitle>
                        <CardDescription>@{user.username}</CardDescription>

                        <div className="flex gap-2 mt-4">
                            <Button variant="outline" size="sm" onClick={() => fetchUser()} disabled={refreshing}>
                                Refresh (Use Cache)
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => fetchUser(true)} disabled={refreshing}>
                                Refresh (Skip Cache)
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                                <div className="grid gap-1 text-sm">
                                    <p>
                                        <span className="font-medium">Email:</span> {user.email}
                                    </p>
                                    <p>
                                        <span className="font-medium">Phone:</span> {user.phone}
                                    </p>
                                    <p>
                                        <span className="font-medium">Website:</span> {user.website}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-2">Company</h3>
                                <div className="grid gap-1 text-sm">
                                    <p>
                                        <span className="font-medium">Name:</span> {user.company.name}
                                    </p>
                                    <p>
                                        <span className="font-medium">Catch Phrase:</span> {user.company.catchPhrase}
                                    </p>
                                    <p>
                                        <span className="font-medium">BS:</span> {user.company.bs}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-2">Address</h3>
                                <div className="grid gap-1 text-sm">
                                    <p>
                                        {user.address.street}, {user.address.suite}
                                    </p>
                                    <p>
                                        {user.address.city}, {user.address.zipcode}
                                    </p>
                                    <p>
                                        <span className="font-medium">Geo:</span> Lat: {user.address.geo.lat}, Lng: {user.address.geo.lng}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="text-center py-8">
                    <p>User not found</p>
                </div>
            )}
        </div>
    )
} 