'use client'

import { cn } from '@/lib/utils'

interface PostPreviewProps {
  title: string
  content: string
  className?: string
}

export function PostPreview({ title, content, className }: PostPreviewProps) {
  return (
    <div className={cn('prose prose-sm dark:prose-invert max-w-none', className)}>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
} 