'use client'

import { Button } from "@/components/ui/button"
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Heading1,
  Heading2,
  Code,
  Link2,
  Strikethrough,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Editor } from '@tiptap/react'

interface MenuButtonProps {
  onClick: () => void
  icon: React.ReactNode
  label: string
  isActive?: boolean
  disabled?: boolean
  shortcut?: string
}

const MenuButton = ({ onClick, icon, label, isActive, disabled, shortcut }: MenuButtonProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.preventDefault()
          onClick()
        }}
        disabled={disabled}
        className={cn(
          "h-8 w-8 p-0",
          isActive && "bg-muted"
        )}
      >
        {icon}
        <span className="sr-only">{label}</span>
      </Button>
    </TooltipTrigger>
    <TooltipContent side="top">
      <p>{label}</p>
      {shortcut && (
        <p className="text-xs text-muted-foreground">
          {shortcut}
        </p>
      )}
    </TooltipContent>
  </Tooltip>
)

export const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b">
      <MenuButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        icon={<Bold className="h-4 w-4" />}
        label="Bold"
        isActive={editor.isActive('bold')}
        shortcut="⌘+B"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        icon={<Italic className="h-4 w-4" />}
        label="Italic"
        isActive={editor.isActive('italic')}
        shortcut="⌘+I"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        icon={<Strikethrough className="h-4 w-4" />}
        label="Strikethrough"
        isActive={editor.isActive('strike')}
        shortcut="⌘+Shift+X"
      />
      <Separator orientation="vertical" className="h-6" />
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        icon={<Heading1 className="h-4 w-4" />}
        label="Heading 1"
        isActive={editor.isActive('heading', { level: 1 })}
        shortcut="⌘+Alt+1"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        icon={<Heading2 className="h-4 w-4" />}
        label="Heading 2"
        isActive={editor.isActive('heading', { level: 2 })}
        shortcut="⌘+Alt+2"
      />
      <Separator orientation="vertical" className="h-6" />
      <MenuButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        icon={<List className="h-4 w-4" />}
        label="Bullet List"
        isActive={editor.isActive('bulletList')}
        shortcut="⌘+Shift+8"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        icon={<ListOrdered className="h-4 w-4" />}
        label="Numbered List"
        isActive={editor.isActive('orderedList')}
        shortcut="⌘+Shift+7"
      />
      <Separator orientation="vertical" className="h-6" />
      <MenuButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        icon={<Quote className="h-4 w-4" />}
        label="Quote"
        isActive={editor.isActive('blockquote')}
        shortcut="⌘+Shift+B"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        icon={<Code className="h-4 w-4" />}
        label="Code Block"
        isActive={editor.isActive('codeBlock')}
        shortcut="⌘+Alt+C"
      />
      <Separator orientation="vertical" className="h-6" />
      <MenuButton
        onClick={() => {
          const url = window.prompt('Enter URL')
          if (url) editor.chain().focus().setLink({ href: url }).run()
        }}
        icon={<Link2 className="h-4 w-4" />}
        label="Add Link"
        isActive={editor.isActive('link')}
        shortcut="⌘+K"
      />
      <Separator orientation="vertical" className="h-6" />
      <MenuButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        icon={<AlignLeft className="h-4 w-4" />}
        label="Align Left"
        isActive={editor.isActive({ textAlign: 'left' })}
      />
      <MenuButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        icon={<AlignCenter className="h-4 w-4" />}
        label="Align Center"
        isActive={editor.isActive({ textAlign: 'center' })}
      />
      <MenuButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        icon={<AlignRight className="h-4 w-4" />}
        label="Align Right"
        isActive={editor.isActive({ textAlign: 'right' })}
      />
      <div className="flex-1" />
      <MenuButton
        onClick={() => editor.chain().focus().undo().run()}
        icon={<Undo className="h-4 w-4" />}
        label="Undo"
        disabled={!editor.can().undo()}
        shortcut="⌘+Z"
      />
      <MenuButton
        onClick={() => editor.chain().focus().redo().run()}
        icon={<Redo className="h-4 w-4" />}
        label="Redo"
        disabled={!editor.can().redo()}
        shortcut="⌘+Shift+Z"
      />
    </div>
  )
} 