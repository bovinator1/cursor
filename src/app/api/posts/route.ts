import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { PostService } from '@/services/post.service'
import { userService } from '@/services/userService'
import { NextRequest } from 'next/server'
import { prisma } from "@/lib/db"
import type { Prisma } from '@prisma/client'

export async function POST(req: Request) {
  try {
    const session = await auth()
    const user = await currentUser()
    
    if (!session?.userId || !user) {
      console.log('[POST_CREATE] No session or userId')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    console.log('[POST_CREATE] Request body:', body)
    
    const { title, content, rawContent, processedContent, platforms } = body

    // Get the database user id from clerk id
    let dbUser = await userService.getUserByClerkId(session.userId)
    
    // If user doesn't exist in our database, create them
    if (!dbUser) {
      console.log('[POST_CREATE] Creating new user for clerkId:', session.userId)
      const email = user.emailAddresses[0]?.emailAddress
      
      if (!email) {
        return NextResponse.json({ message: 'User email not found' }, { status: 400 })
      }

      dbUser = await userService.createUser({
        clerkId: session.userId,
        email,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined
      })
    }

    console.log('[POST_CREATE] Using user:', dbUser.id)

    // Create post as draft
    const post = await PostService.createPost(dbUser.id, {
      title,
      content,
      rawContent,
      processedContent,
      platforms,
      status: 'DRAFT'
    })
    console.log('[POST_CREATE] Post created:', post.id)

    return NextResponse.json(post)
  } catch (error) {
    console.error('[POST_CREATE] Error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal error' }, 
      { status: 500 }
    )
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
    const formattedPosts = posts.map((post: Prisma.PostGetPayload<{ include: { author: true } }>) => ({
      ...post,
      author: {
        id: post.author.id,
        firstName: post.author.firstName,
        lastName: post.author.lastName,
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