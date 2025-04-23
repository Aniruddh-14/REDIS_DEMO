import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"

export default function Navigation() {
    return (
        <header className="border-b">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <Link href="/" className="text-xl font-bold">
                        Redis Demo
                    </Link>
                    <nav className="hidden md:flex gap-6">
                        <Link href="/posts" className="text-sm font-medium transition-colors hover:text-primary">
                            Posts (SSR)
                        </Link>
                        <Link href="/users" className="text-sm font-medium transition-colors hover:text-primary">
                            Users (CSR)
                        </Link>
                        <Link href="/performance" className="text-sm font-medium transition-colors hover:text-primary">
                            Performance
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                            <Github className="mr-2 h-4 w-4" />
                            GitHub
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    )
} 