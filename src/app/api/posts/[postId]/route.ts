import { auth } from '@clerk/nextjs/server'
import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { userService } from '@/services/userService'
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
      console.log('[POST_GET] No session or userId')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Get the database user id from clerk id
    let dbUser = await userService.getUserByClerkId(session.userId)
    
    // If user doesn't exist in our database, create them
    if (!dbUser) {
      console.log('[POST_GET] Creating new user for clerkId:', session.userId)
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

    console.log('[POST_GET] Using user:', dbUser.id)

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        authorId: dbUser.id
      }
    })

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error getting post:', { 
      postId: await Promise.resolve(context.params).then(p => p.postId), 
      error: error instanceof Error ? error.message : error 
    })
    return NextResponse.json(
      { message: 'Error getting post', error: error instanceof Error ? error.message : 'Unknown error' },
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
      console.log('[POST_PATCH] No session or userId')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Get the database user id from clerk id
    let dbUser = await userService.getUserByClerkId(session.userId)
    
    // If user doesn't exist in our database, create them
    if (!dbUser) {
      console.log('[POST_PATCH] Creating new user for clerkId:', session.userId)
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

    console.log('[POST_PATCH] Using user:', dbUser.id)

    const body = await request.json()

    const post = await prisma.post.update({
      where: {
        id: postId,
        authorId: dbUser.id
      },
      data: body
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
      console.log('[POST_DELETE] No session or userId')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Get the database user id from clerk id
    let dbUser = await userService.getUserByClerkId(session.userId)
    
    // If user doesn't exist in our database, create them
    if (!dbUser) {
      console.log('[POST_DELETE] Creating new user for clerkId:', session.userId)
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

    console.log('[POST_DELETE] Using user:', dbUser.id)

    await prisma.post.delete({
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