'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Platform } from '.prisma/client'
import { toast } from 'sonner'
import { PostPreview } from './PostPreview'
import { PlatformPreview } from './PlatformPreview'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Badge } from "@/components/ui/badge"

interface PostFormProps {
  postId?: string
}

interface PostData {
  title: string
  content: string
  rawContent: string
  platforms: Platform[]
}

const AUTO_SAVE_DELAY = 3000 // 3 seconds

export function PostForm({ postId }: PostFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [postData, setPostData] = useState<PostData>({
    title: '',
    content: '',
    rawContent: '',
    platforms: []
  })
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')

  // Fetch existing post data if editing
  useEffect(() => {
    if (postId) {
      fetchPost()
    }
  }, [postId])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`)
      if (!response.ok) throw new Error('Failed to fetch post')
      const data = await response.json()
      setPostData({
        title: data.title,
        content: data.content,
        rawContent: data.rawContent,
        platforms: data.platforms
      })
    } catch (error) {
      toast.error('Error fetching post')
      console.error(error)
    }
  }

  // Auto-save functionality
  const debouncedSave = useCallback(
    async (data: PostData) => {
      if (!postId || !data.title || !data.content) return

      try {
        setAutoSaveStatus('saving')
        const response = await fetch(`/api/posts/${postId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            status: 'DRAFT'
          })
        })

        if (!response.ok) throw new Error('Failed to auto-save')
        setAutoSaveStatus('saved')
      } catch (error) {
        console.error('Auto-save error:', error)
        setAutoSaveStatus('error')
      }
    },
    [postId]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      if (postId && (postData.title || postData.content)) {
        debouncedSave(postData)
      }
    }, AUTO_SAVE_DELAY)

    return () => clearTimeout(timer)
  }, [postData, postId, debouncedSave])

  const saveDraft = async () => {
    if (!postData.platforms.length) {
      toast.error('Please select at least one platform')
      return
    }

    try {
      setLoading(true)
      const url = postId ? `/api/posts/${postId}` : '/api/posts'
      const method = postId ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...postData,
          status: 'DRAFT'
        })
      })

      let data
      try {
        data = await response.json()
      } catch (e) {
        throw new Error(`Failed to parse response: ${response.status} ${response.statusText}`)
      }
      
      if (!response.ok) {
        throw new Error(data?.message || `Failed to save draft: ${response.status}`)
      }
      
      toast.success('Draft saved successfully')
      
      // Redirect to the edit page if this is a new post
      if (!postId && data?.id) {
        router.push(`/posts/${data.id}`)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error saving draft'
      toast.error(message)
      console.error('Save draft error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setPostData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'content' && { rawContent: value }) // Update rawContent when content changes
    }))
  }

  const togglePlatform = (platform: Platform) => {
    setPostData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }))
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Target Platforms</h3>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="linkedin"
                  checked={postData.platforms.includes('LINKEDIN')}
                  onCheckedChange={() => togglePlatform('LINKEDIN')}
                />
                <Label htmlFor="linkedin">LinkedIn</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="twitter"
                  checked={postData.platforms.includes('TWITTER')}
                  onCheckedChange={() => togglePlatform('TWITTER')}
                />
                <Label htmlFor="twitter">Twitter</Label>
              </div>
            </div>
          </div>
          
          {postId && (
            <Badge variant={
              autoSaveStatus === 'saved' ? 'secondary' :
              autoSaveStatus === 'saving' ? 'outline' : 'destructive'
            }>
              {autoSaveStatus === 'saved' ? 'All changes saved' :
               autoSaveStatus === 'saving' ? 'Saving...' : 'Save failed'}
            </Badge>
          )}
        </div>

        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            {postData.platforms.map(platform => (
              <TabsTrigger key={platform} value={platform.toLowerCase()}>
                {platform} Preview
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="edit">
            <form className="space-y-6">
              <div className="space-y-2">
                <Input
                  name="title"
                  placeholder="Post title"
                  value={postData.title}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Textarea
                  name="content"
                  placeholder="Write your post content... (Markdown supported)"
                  value={postData.content}
                  onChange={handleInputChange}
                  rows={12}
                />
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="preview">
            <PostPreview
              title={postData.title}
              content={
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {postData.content}
                </ReactMarkdown>
              }
            />
          </TabsContent>

          {postData.platforms.map(platform => (
            <TabsContent key={platform} value={platform.toLowerCase()}>
              <PlatformPreview
                platform={platform}
                title={postData.title}
                content={postData.content}
              />
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex items-center gap-4 mt-6">
          <Button
            type="button"
            onClick={saveDraft}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Draft'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  )
} 