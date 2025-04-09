import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="flex-1">
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Create engaging social media content with AI
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Optimize your posts for each platform. Save time and increase engagement.
          </p>
          <div className="space-x-4">
            <Link href="/sign-in">
              <Button size="lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
