export type Platform = 'LINKEDIN' | 'TWITTER';
export type PostStatus = 'DRAFT' | 'PUBLISHED';

export interface Post {
  id: string;
  title: string;
  content: string;
  rawContent: string;
  processedContent?: {
    [key: string]: string | undefined;
    html?: string;
    markdown?: string;
  };
  platforms: Platform[];
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  authorId?: string;
} 