import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Instagram Content Curator</h1>
      <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
        Curate, organize, and schedule your Instagram posts with ease.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg">
          <Link href="/dashboard">
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/settings">Connect Instagram</Link>
        </Button>
      </div>
    </div>
  )
}
