"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export default function UsersPage() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [source, setSource] = useState(null)
    const [duration, setDuration] = useState(null)
    const [refreshing, setRefreshing] = useState(false)

    const fetchUsers = async (skipCache = false) => {
        setRefreshing(true)
        try {
            const response = await fetch(`/api/users?skipCache=${skipCache}`)
            const data = await response.json()
            setUsers(data.data)
            setSource(data.source)
            setDuration(data.duration)
        } catch (error) {
            console.error("Error fetching users:", error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Users (Client-Side Rendering)</h1>
                <p className="text-muted-foreground">
                    This page demonstrates client-side rendering with Redis caching via API routes.
                </p>

                {!loading && source && duration && (
                    <div className="flex items-center gap-2 text-sm">
                        <Badge variant={source === "cache" ? "secondary" : "outline"}>
                            {source === "cache" ? "Served from Redis cache" : "Fetched from API"}
                        </Badge>
                        <span className="text-muted-foreground">Fetched in {duration.toFixed(2)}ms</span>
                    </div>
                )}

                <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" onClick={() => fetchUsers()} disabled={refreshing}>
                        Refresh (Use Cache)
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => fetchUsers(true)} disabled={refreshing}>
                        Refresh (Skip Cache)
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading
                    ? // Skeleton loading state
                    Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </CardContent>
                        </Card>
                    ))
                    : // Actual user cards
                    users.map((user) => <UserCard key={user.id} user={user} />)}
            </div>
        </div>
    )
}

function UserCard({ user }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>@{user.username}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm">
                    <p>
                        <span className="font-medium">Email:</span> {user.email}
                    </p>
                    <p>
                        <span className="font-medium">Phone:</span> {user.phone}
                    </p>
                    <p>
                        <span className="font-medium">Website:</span> {user.website}
                    </p>
                    <p>
                        <span className="font-medium">Company:</span> {user.company.name}
                    </p>
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild variant="outline" size="sm">
                    <Link href={`/users/${user.id}`}>View Profile</Link>
                </Button>
            </CardFooter>
        </Card>
    )
} 