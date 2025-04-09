import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { PostService } from '@/services/post.service'
import { UserService } from '@/services/user.service'

export async function GET(
  req: Request,
  context: { params: { postId: string } }
) {
  try {
    const postId = await Promise.resolve(context.params.postId)
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
    const post = await PostService.getPostById(postId)
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
  context: { params: { postId: string } }
) {
  try {
    const postId = await Promise.resolve(context.params.postId)
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
    const existingPost = await PostService.getPostById(postId)
    if (!existingPost) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 })
    }
    if (existingPost.authorId !== dbUser.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Update post
    const post = await PostService.updatePost(postId, {
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
  context: { params: { postId: string } }
) {
  try {
    const postId = await Promise.resolve(context.params.postId)
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
    const existingPost = await PostService.getPostById(postId)
    if (!existingPost) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 })
    }
    if (existingPost.authorId !== dbUser.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await PostService.deletePost(postId)

    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('[POST_DELETE]', error)
    return NextResponse.json({ message: 'Failed to delete post' }, { status: 500 })
  }
} 