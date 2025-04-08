'use client'

import { ReactNode } from 'react'
import { Card } from "@/components/ui/card"

interface PostPreviewProps {
  title: string
  content: ReactNode
}

export function PostPreview({ title, content }: PostPreviewProps) {
  return (
    <Card className="p-6 bg-muted/50">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="prose prose-sm max-w-none">
          {typeof content === 'string' 
            ? content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))
            : content
          }
        </div>
      </div>
    </Card>
  )
} 