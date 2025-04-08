import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { PostService } from '@/services/post.service'
import { UserService } from '@/services/user.service'
import { NextRequest } from 'next/server'
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { title, content, rawContent, processedContent, platforms } = body

    // Get the database user id from clerk id
    const dbUser = await UserService.getUserByClerkId(session.userId)
    if (!dbUser) {
      return new NextResponse('User not found', { status: 404 })
    }

    // Create post as draft
    const post = await PostService.createPost(dbUser.id, {
      title,
      content,
      rawContent,
      processedContent,
      platforms,
      status: 'DRAFT'
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('[POSTS]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const status = searchParams.get('status') || undefined
    const authorId = searchParams.get('authorId') || undefined

    // Calculate offset based on page number and limit
    const skip = (page - 1) * limit

    // Build the where condition
    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (authorId) {
      where.authorId = authorId
    }

    // Get posts with pagination
    const posts = await prisma.post.findMany({
      where,
      include: {
        author: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    // Get total count for pagination
    const total = await prisma.post.count({ where })

    // Format the response to include only necessary user fields
    const formattedPosts = posts.map(post => ({
      ...post,
      author: {
        id: post.author.id,
        firstName: post.author.firstName,
        lastName: post.author.lastName,
        // Include other safe fields as needed
      }
    }))

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    )
  }
} 