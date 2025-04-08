import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { PostService } from '@/services/post.service'
import { UserService } from '@/services/user.service'

export async function PATCH(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await auth()
    if (!session?.userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { title, content, rawContent, processedContent, platforms, status } = body

    // Get the database user id from clerk id
    const dbUser = await UserService.getUserByClerkId(session.userId)
    if (!dbUser) {
      return new NextResponse('User not found', { status: 404 })
    }

    // Verify post exists and belongs to user
    const existingPost = await PostService.getPostById(params.postId)
    if (!existingPost) {
      return new NextResponse('Post not found', { status: 404 })
    }
    if (existingPost.authorId !== dbUser.id) {
      return new NextResponse('Unauthorized', { status: 401 })
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
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await auth()
    if (!session?.userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get the database user id from clerk id
    const dbUser = await UserService.getUserByClerkId(session.userId)
    if (!dbUser) {
      return new NextResponse('User not found', { status: 404 })
    }

    // Verify post exists and belongs to user
    const existingPost = await PostService.getPostById(params.postId)
    if (!existingPost) {
      return new NextResponse('Post not found', { status: 404 })
    }
    if (existingPost.authorId !== dbUser.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    await PostService.deletePost(params.postId)

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[POST_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 