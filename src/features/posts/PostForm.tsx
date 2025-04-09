'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { RichTextEditor } from './RichTextEditor'
import { PostPreview } from './PostPreview'
import { PlatformPreview } from './PlatformPreview'
import { Platform } from '@/types/post'

interface PostFormProps {
  postId?: string
  onSubmit?: (data: FormData) => Promise<void>
  loading?: boolean
}

interface PostData {
  title: string
  content: string
  rawContent: string
  processedContent?: {
    html: string
    markdown: string
  }
  platforms: Platform[]
}

const AUTO_SAVE_DELAY = 3000 // 3 seconds
const TWITTER_CHAR_LIMIT = 280
const LINKEDIN_CHAR_LIMIT = 3000

export function PostForm({ postId, loading }: PostFormProps) {
  const router = useRouter()
  const [publishing, setPublishing] = useState(false)
  const [postData, setPostData] = useState<PostData>({
    title: '',
    content: '',
    rawContent: '',
    processedContent: {
      html: '',
      markdown: ''
    },
    platforms: []
  })
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')

  const fetchPost = useCallback(async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch post')
      }

      // Use processedContent if available, fallback to content/rawContent
      const processedContent = data.processedContent || {
        html: data.content || '',
        markdown: data.rawContent || ''
      }

      setPostData({
        title: data.title || '',
        content: processedContent.html || data.content || '',
        rawContent: processedContent.markdown || data.rawContent || '',
        processedContent,
        platforms: data.platforms || []
      })

      console.log('Loaded post data:', {
        title: data.title,
        contentLength: processedContent.html?.length,
        hasFormatting: processedContent.html?.includes('<') || false
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error fetching post'
      toast.error(message)
      console.error('Fetch error:', error)
    }
  }, [postId])

  // Fetch existing post data if editing
  useEffect(() => {
    if (postId) {
      fetchPost()
    }
  }, [postId, fetchPost])

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

        const responseData = await response.json()

        if (!response.ok) throw new Error('Failed to auto-save')
        
        // Update state with the response data to ensure consistency
        setPostData(prev => ({
          ...prev,
          content: responseData.content || prev.content,
          rawContent: responseData.rawContent || prev.rawContent,
          processedContent: responseData.processedContent || prev.processedContent
        }))
        
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

  const handleEditorChange = (content: { html: string; markdown: string }) => {
    setPostData(prev => ({
      ...prev,
      content: content.html,
      rawContent: content.markdown,
      processedContent: {
        html: content.html,
        markdown: content.markdown
      }
    }))
  }

  const saveDraft = async () => {
    if (!postData.platforms.length) {
      toast.error('Please select at least one platform')
      return
    }

    try {
      const url = postId ? `/api/posts/${postId}` : '/api/posts'
      const method = postId ? 'PATCH' : 'POST'

      // Ensure we're sending both HTML and Markdown content
      const payload = {
        ...postData,
        status: 'DRAFT',
        content: postData.content || '',
        rawContent: postData.rawContent || '',
        processedContent: {
          html: postData.content || '',
          markdown: postData.rawContent || ''
        }
      }

      console.log('Saving draft with payload:', payload)

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      let data
      try {
        data = await response.json()
        console.log('Save response:', data)
      } catch (e) {
        throw new Error(`Failed to parse response: ${response.status} ${response.statusText}`)
      }
      
      if (!response.ok) {
        throw new Error(data?.message || `Failed to save draft: ${response.status}`)
      }
      
      toast.success('Draft saved successfully')
      
      // Always redirect to dashboard after saving
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error saving draft'
      toast.error(message)
      console.error('Save draft error:', error)
    }
  }

  const publishPost = async () => {
    if (!postId) return
    if (!postData.platforms.length) {
      toast.error('Please select at least one platform')
      return
    }

    try {
      setPublishing(true)
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...postData,
          status: 'PUBLISHED',
          publishedAt: new Date().toISOString()
        })
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.message || `Failed to publish post: ${response.status}`)
      }

      toast.success('Post published successfully')
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error publishing post'
      toast.error(message)
      console.error('Publish error:', error)
    } finally {
      setPublishing(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { name: string; value: string }
  ) => {
    const name = 'target' in e ? e.target.name : e.name
    const value = 'target' in e ? e.target.value : e.value

    setPostData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'content' && { rawContent: value })
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
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="space-x-2">
          <Button
            onClick={saveDraft}
            disabled={loading || publishing}
          >
            {loading ? 'Saving...' : 'Save Draft'}
          </Button>
          {postId && (
            <Button
              onClick={publishPost}
              disabled={loading || publishing}
              variant="default"
            >
              {publishing ? (
                'Publishing...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Publish
                </>
              )}
            </Button>
          )}
        </div>
      </div>

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
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <Input
                  name="title"
                  placeholder="Post title"
                  value={postData.title}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <RichTextEditor
                  key={postId}
                  content={postData.content}
                  onChange={handleEditorChange}
                  placeholder="Write your post content... (Markdown supported)"
                  maxLength={postData.platforms.includes('TWITTER') ? TWITTER_CHAR_LIMIT : 
                           postData.platforms.includes('LINKEDIN') ? LINKEDIN_CHAR_LIMIT : 
                           undefined}
                />
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="preview">
            <PostPreview
              title={postData.title}
              content={postData.content}
            />
          </TabsContent>

          {postData.platforms.map(platform => (
            <TabsContent key={platform} value={platform.toLowerCase()}>
              <PlatformPreview
                platform={platform}
                title={postData.title}
                content={postData.rawContent}
              />
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  )
} 