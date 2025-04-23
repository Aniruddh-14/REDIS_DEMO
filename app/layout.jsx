import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navigation from "@/components/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: "Next.js with Redis Demo",
    description: "A demo application showcasing Redis caching with Next.js",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <div className="min-h-screen bg-background">
                        <Navigation />
                        <main className="container mx-auto py-6 px-4">{children}</main>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    )
} 