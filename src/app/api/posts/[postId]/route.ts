import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { PostService } from '@/services/post.service'
import { UserService } from '@/services/user.service'

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await auth()
    if (!session?.userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Get the database user id from clerk id
    const dbUser = await UserService.getUserByClerkId(session.userId)
    if (!dbUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Get post
    const post = await PostService.getPostById(params.postId)
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 })
    }

    // Verify post belongs to user
    if (post.authorId !== dbUser.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('[POST_GET]', error)
    return NextResponse.json({ message: 'Internal error' }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await auth()
    if (!session?.userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, content, rawContent, processedContent, platforms, status } = body

    // Get the database user id from clerk id
    const dbUser = await UserService.getUserByClerkId(session.userId)
    if (!dbUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Verify post exists and belongs to user
    const existingPost = await PostService.getPostById(params.postId)
    if (!existingPost) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 })
    }
    if (existingPost.authorId !== dbUser.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Update post
    const post = await PostService.updatePost(params.postId, {
      title,
      content,
      rawContent,
      processedContent,
      platforms,
      status
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('[POST_PATCH]', error)
    return NextResponse.json({ message: 'Internal error' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await auth()
    if (!session?.userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Get the database user id from clerk id
    const dbUser = await UserService.getUserByClerkId(session.userId)
    if (!dbUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Verify post exists and belongs to user
    const existingPost = await PostService.getPostById(params.postId)
    if (!existingPost) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 })
    }
    if (existingPost.authorId !== dbUser.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await PostService.deletePost(params.postId)

    return NextResponse.json(null, { status: 204 })
  } catch (error) {
    console.error('[POST_DELETE]', error)
    return NextResponse.json({ message: 'Internal error' }, { status: 500 })
  }
} 