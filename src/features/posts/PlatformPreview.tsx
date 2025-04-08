'use client'

import { Platform } from '@prisma/client'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PlatformPreviewProps {
  platform: Platform
  title: string
  content: string
}

const TWITTER_CHAR_LIMIT = 280
const LINKEDIN_CHAR_LIMIT = 3000

export function PlatformPreview({ platform, title, content }: PlatformPreviewProps) {
  const isTwitter = platform === 'TWITTER'
  const charLimit = isTwitter ? TWITTER_CHAR_LIMIT : LINKEDIN_CHAR_LIMIT
  const combinedContent = `${title}\n\n${content}`
  const charCount = combinedContent.length
  const isOverLimit = charCount > charLimit

  return (
    <Card className={cn(
      "p-6",
      isTwitter ? "max-w-[598px]" : "max-w-[700px]"
    )}>
      <div className="flex justify-between items-start mb-4">
        <Badge variant={platform === 'TWITTER' ? "default" : "secondary"}>
          {platform === 'TWITTER' ? 'Twitter Preview' : 'LinkedIn Preview'}
        </Badge>
        <span className={cn(
          "text-sm",
          isOverLimit ? "text-destructive" : "text-muted-foreground"
        )}>
          {charCount}/{charLimit} characters
        </span>
      </div>

      <div className="space-y-4">
        <h3 className={cn(
          "font-bold",
          isTwitter ? "text-xl" : "text-2xl"
        )}>{title}</h3>
        
        <div className={cn(
          "prose prose-sm max-w-none",
          isTwitter ? "prose-twitter" : "prose-linkedin"
        )}>
          {content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-2">
              {paragraph}
            </p>
          ))}
        </div>

        {isOverLimit && (
          <p className="text-sm text-destructive">
            Content exceeds {platform.toLowerCase()} character limit
          </p>
        )}
      </div>
    </Card>
  )
} 