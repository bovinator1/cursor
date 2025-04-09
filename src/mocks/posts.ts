import type { Post } from '@/types/post'

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Exciting Product Launch',
    content: 'We are thrilled to announce our latest product launch...',
    rawContent: 'We are thrilled to announce our latest product launch...',
    processedContent: {
      html: '<p>We are thrilled to announce our latest product launch...</p>',
      markdown: 'We are thrilled to announce our latest product launch...'
    },
    platforms: ['LINKEDIN', 'TWITTER'],
    status: 'DRAFT',
    createdAt: '2023-05-01T10:00:00Z',
    updatedAt: '2023-05-01T10:00:00Z'
  },
  {
    id: '2',
    title: 'Industry Insights',
    content: 'Here are some key trends we are seeing in the industry...',
    rawContent: 'Here are some key trends we are seeing in the industry...',
    processedContent: {
      html: '<p>Here are some key trends we are seeing in the industry...</p>',
      markdown: 'Here are some key trends we are seeing in the industry...'
    },
    platforms: ['LINKEDIN'],
    status: 'PUBLISHED',
    createdAt: '2023-05-02T14:30:00Z',
    updatedAt: '2023-05-02T15:45:00Z',
    publishedAt: '2023-05-02T15:45:00Z'
  },
  {
    id: '3',
    title: 'Quick Update',
    content: 'Just hit a major milestone in our project...',
    rawContent: 'Just hit a major milestone in our project...',
    processedContent: {
      html: '<p>Just hit a major milestone in our project...</p>',
      markdown: 'Just hit a major milestone in our project...'
    },
    platforms: ['TWITTER'],
    status: 'DRAFT',
    createdAt: '2023-05-05T09:15:00Z',
    updatedAt: '2023-05-05T09:15:00Z'
  }
]

// Helper function to get drafts
export const getDrafts = () => mockPosts.filter(post => post.status === 'DRAFT')

// Helper function to get published posts
export const getPublishedPosts = () => mockPosts.filter(post => post.status === 'PUBLISHED') 