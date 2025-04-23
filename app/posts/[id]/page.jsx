import { fetchPost, fetchUser } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const revalidate = 3600 // Revalidate this page every hour

export default async function PostPage({ params }) {
    const postId = Number.parseInt(params.id)

    // Fetch post with caching
    const { data: post, source: postSource, duration: postDuration } = await fetchPost(postId)

    // Fetch user with caching
    const { data: user, source: userSource, duration: userDuration } = await fetchUser(post.userId)

    return (
        <div className="space-y-6">
            <Button asChild variant="outline" size="sm">
                <Link href="/posts">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Posts
                </Link>
            </Button>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant={postSource === "cache" ? "secondary" : "outline"}>
                            {postSource === "cache" ? "Post from cache" : "Post from API"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{postDuration.toFixed(2)}ms</span>
                    </div>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>
                        By {user.name} ({user.username})
                        <span className="ml-2">
                            <Badge variant={userSource === "cache" ? "secondary" : "outline"} className="text-xs">
                                {userSource === "cache" ? "User from cache" : "User from API"}
                            </Badge>
                            <span className="text-xs text-muted-foreground ml-1">{userDuration.toFixed(2)}ms</span>
                        </span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-line">{post.body}</p>

                    <div className="mt-6 pt-6 border-t">
                        <h3 className="text-lg font-semibold mb-2">About the Author</h3>
                        <div className="grid gap-1 text-sm">
                            <p>
                                <span className="font-medium">Email:</span> {user.email}
                            </p>
                            <p>
                                <span className="font-medium">Website:</span> {user.website}
                            </p>
                            <p>
                                <span className="font-medium">Company:</span> {user.company.name}
                            </p>
                            <p>
                                <span className="font-medium">Location:</span> {user.address.city}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 