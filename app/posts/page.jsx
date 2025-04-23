import { fetchPosts } from "@/lib/api"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const revalidate = 3600 // Revalidate this page every hour

export default async function PostsPage() {
    // Fetch posts with caching
    const { data: posts, source, duration } = await fetchPosts()

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Posts (Server-Side Rendering)</h1>
                <p className="text-muted-foreground">This page demonstrates server-side rendering with Redis caching.</p>
                <div className="flex items-center gap-2 text-sm">
                    <Badge variant={source === "cache" ? "secondary" : "outline"}>
                        {source === "cache" ? "Served from Redis cache" : "Fetched from API"}
                    </Badge>
                    <span className="text-muted-foreground">Fetched in {duration.toFixed(2)}ms</span>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {posts.slice(0, 9).map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    )
}

function PostCard({ post }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <CardDescription>Post ID: {post.id}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">{post.body}</p>
            </CardContent>
            <CardFooter>
                <Button asChild variant="outline" size="sm">
                    <Link href={`/posts/${post.id}`}>Read More</Link>
                </Button>
            </CardFooter>
        </Card>
    )
} 