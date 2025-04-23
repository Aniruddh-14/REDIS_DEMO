import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Home() {
    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">Next.js with Redis Demo</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    A demonstration of using Redis for caching API responses in a Next.js application, showing both server-side
                    and client-side rendering approaches.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Server-Side Rendering</CardTitle>
                        <CardDescription>Posts are fetched and cached on the server using Redis</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>
                            This demo uses Next.js Server Components to fetch data from the JSONPlaceholder API. The data is cached in
                            Redis to improve performance on subsequent requests.
                        </p>
                        <Button asChild>
                            <Link href="/posts">
                                View Posts <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Client-Side Rendering</CardTitle>
                        <CardDescription>Users are fetched client-side with API routes using Redis caching</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>
                            This demo uses React client components to fetch data from a Next.js API route. The API route uses Redis to
                            cache responses from the JSONPlaceholder API.
                        </p>
                        <Button asChild>
                            <Link href="/users">
                                View Users <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Performance Benchmarking</CardTitle>
                    <CardDescription>Compare the performance with and without Redis caching</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">
                        Visit the performance page to see real-time metrics comparing API response times with and without Redis
                        caching. The page demonstrates the significant performance improvements that can be achieved with proper
                        caching strategies.
                    </p>
                    <Button asChild>
                        <Link href="/performance">
                            View Performance Metrics <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
} 