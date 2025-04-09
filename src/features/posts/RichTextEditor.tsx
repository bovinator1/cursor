'use client'

import { useRef, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Strike from '@tiptap/extension-strike'
import CharacterCount from '@tiptap/extension-character-count'
import TurndownService from 'turndown'
import { cn } from "@/lib/utils"
import { MenuBar } from './MenuBar'
import { getTurndownService } from './turndown.config'

interface RichTextEditorProps {
  content: string
  onChange: (value: { html: string; markdown: string }) => void
  placeholder?: string
  maxLength?: number
}

export function RichTextEditor({ content, onChange, placeholder, maxLength }: RichTextEditorProps) {
  const turndownServiceRef = useRef<TurndownService | null>(null)
  
  // Initialize turndown service on client side only
  if (typeof window !== 'undefined' && !turndownServiceRef.current) {
    turndownServiceRef.current = getTurndownService()
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2]
        }
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Write your post content... (Markdown supported)',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-4 hover:text-primary/80',
        },
      }),
      Strike,
      CharacterCount.configure({
        limit: maxLength,
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert focus:outline-none'
      }
    },
    content: content || '',
    onUpdate: ({ editor }) => {
      if (!editor) return
      const html = editor.getHTML()
      const markdown = turndownServiceRef.current ? turndownServiceRef.current.turndown(html) : html
      onChange({ html, markdown })
    },
  })

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [editor, content])

  const characterCount = editor?.storage.characterCount.characters() ?? 0
  const isOverLimit = maxLength ? characterCount > maxLength : false

  return (
    <div className="border rounded-md bg-background">
      <MenuBar editor={editor} />
      <div className="relative">
        <EditorContent 
          editor={editor} 
          className={cn(
            "prose prose-sm dark:prose-invert max-w-none min-h-[200px] focus-within:outline-none p-4",
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            isOverLimit && "border-destructive"
          )}
        />
      </div>
      {maxLength && (
        <div className="flex justify-end p-2 border-t">
          <span className={cn(
            "text-sm",
            isOverLimit ? "text-destructive" : "text-muted-foreground"
          )}>
            {characterCount}/{maxLength} characters
            {isOverLimit && " (over limit)"}
          </span>
        </div>
      )}
    </div>
  )
} 