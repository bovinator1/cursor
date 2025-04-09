import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'
import { UserService } from '@/services/user.service'
import type { PostStatus } from '@prisma/client'

export async function GET(
  request: Request,
  context: { params: Promise<{ postId: string }> | { postId: string } }
) {
  try {
    const { postId } = await Promise.resolve(context.params)
    const session = await auth()
    const user = await currentUser()
    
    if (!session?.userId || !user) {
      console.error('Unauthorized access attempt:', { postId })
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Get or create database user
    let dbUser = await UserService.getUserByClerkId(session.userId)
    if (!dbUser) {
      console.log('[GET] Creating new user for clerkId:', session.userId)
      const email = user.emailAddresses[0]?.emailAddress
      
      if (!email) {
        return NextResponse.json({ message: 'User email not found' }, { status: 400 })
      }

      dbUser = await UserService.createUser(
        session.userId,
        email,
        user.firstName || undefined,
        user.lastName || undefined
      )
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        authorId: dbUser.id // Use database user ID instead of Clerk ID
      }
    })

    if (!post) {
      console.error('Post not found:', { 
        postId, 
        userId: session.userId,
        dbUserId: dbUser.id,
        requestUrl: request.url 
      })
      return NextResponse.json({ 
        message: 'Post not found',
        debug: {
          postId,
          clerkUserId: session.userId,
          dbUserId: dbUser.id
        }
      }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', { 
      postId: await Promise.resolve(context.params).then(p => p.postId), 
      error: error instanceof Error ? error.message : error 
    })
    return NextResponse.json(
      { message: 'Error fetching post', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ postId: string }> | { postId: string } }
) {
  try {
    const { postId } = await Promise.resolve(context.params)
    const session = await auth()
    const user = await currentUser()
    
    if (!session?.userId || !user) {
      console.error('Unauthorized update attempt:', { postId })
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Get or create database user
    let dbUser = await UserService.getUserByClerkId(session.userId)
    if (!dbUser) {
      console.log('[PATCH] Creating new user for clerkId:', session.userId)
      const email = user.emailAddresses[0]?.emailAddress
      
      if (!email) {
        return NextResponse.json({ message: 'User email not found' }, { status: 400 })
      }

      dbUser = await UserService.createUser(
        session.userId,
        email,
        user.firstName || undefined,
        user.lastName || undefined
      )
    }

    const data = await request.json()
    
    // First check if the post exists and belongs to the user
    const existingPost = await prisma.post.findUnique({
      where: {
        id: postId,
        authorId: dbUser.id
      }
    })

    if (!existingPost) {
      console.error('Post not found for update:', { 
        postId, 
        userId: session.userId,
        dbUserId: dbUser.id
      })
      return NextResponse.json({ 
        message: 'Post not found',
        debug: {
          postId,
          clerkUserId: session.userId,
          dbUserId: dbUser.id
        }
      }, { status: 404 })
    }

    const post = await prisma.post.update({
      where: {
        id: postId,
        authorId: dbUser.id
      },
      data: {
        title: data.title,
        content: data.content,
        rawContent: data.rawContent,
        status: data.status as PostStatus,
        platforms: data.platforms,
        ...(data.publishedAt && { publishedAt: data.publishedAt })
      }
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error updating post:', { 
      postId: await Promise.resolve(context.params).then(p => p.postId), 
      error: error instanceof Error ? error.message : error 
    })
    return NextResponse.json(
      { message: 'Error updating post', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ postId: string }> | { postId: string } }
) {
  try {
    const { postId } = await Promise.resolve(context.params)
    const session = await auth()
    const user = await currentUser()
    
    if (!session?.userId || !user) {
      console.error('Unauthorized delete attempt:', { postId })
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Get or create database user
    let dbUser = await UserService.getUserByClerkId(session.userId)
    if (!dbUser) {
      console.log('[DELETE] Creating new user for clerkId:', session.userId)
      const email = user.emailAddresses[0]?.emailAddress
      
      if (!email) {
        return NextResponse.json({ message: 'User email not found' }, { status: 400 })
      }

      dbUser = await UserService.createUser(
        session.userId,
        email,
        user.firstName || undefined,
        user.lastName || undefined
      )
    }

    // First check if the post exists and belongs to the user
    const existingPost = await prisma.post.findUnique({
      where: {
        id: postId,
        authorId: dbUser.id
      }
    })

    if (!existingPost) {
      console.error('Post not found for deletion:', { 
        postId, 
        userId: session.userId,
        dbUserId: dbUser.id
      })
      return NextResponse.json({ 
        message: 'Post not found',
        debug: {
          postId,
          clerkUserId: session.userId,
          dbUserId: dbUser.id
        }
      }, { status: 404 })
    }

    const post = await prisma.post.delete({
      where: {
        id: postId,
        authorId: dbUser.id
      }
    })

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', { 
      postId: await Promise.resolve(context.params).then(p => p.postId), 
      error: error instanceof Error ? error.message : error 
    })
    return NextResponse.json(
      { message: 'Error deleting post', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 