import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { Platform } from '@prisma/client'

// Helper function to create JSON response with proper headers
function jsonResponse(data: any, status = 200) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

// Helper function to make OpenAI API calls
async function callOpenAI(messages: any[], maxTokens: number) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OpenAI API key not configured')
  }

  // Extract the key portion for project keys
  const actualKey = apiKey.startsWith('sk-proj-') 
    ? apiKey.split('_').slice(-1)[0] // Get the last segment after underscores
    : apiKey

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${actualKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.7,
        max_tokens: maxTokens
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.error('OpenAI API Error:', {
        status: response.status,
        data,
        keyType: apiKey.startsWith('sk-proj-') ? 'project' : 'standard',
        keyLength: actualKey.length
      })
      throw new Error(data.error?.message || 'Failed to generate content')
    }

    return data
  } catch (error) {
    console.error('Error calling OpenAI:', error)
    throw error
  }
}

export async function POST(req: Request) {
  // Add CORS headers for preflight
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 'no-store',
      },
    })
  }

  try {
    console.log('Starting optimization request...')

    // Check authentication
    const session = await auth()
    if (!session?.userId) {
      console.error('Unauthorized access attempt')
      return jsonResponse({ message: 'Unauthorized' }, 401)
    }
    console.log('Authentication successful for user:', session.userId)

    // Parse request body
    let body
    try {
      body = await req.json()
    } catch (e) {
      console.error('Failed to parse request body:', e)
      return jsonResponse({ message: 'Invalid request body' }, 400)
    }

    const { title, content, platform } = body

    // Validate required fields
    if (!title || !content || !platform) {
      console.error('Missing required fields:', { title: !!title, content: !!content, platform })
      return jsonResponse({ message: 'Missing required fields' }, 400)
    }

    // Validate platform
    if (platform !== 'TWITTER' && platform !== 'LINKEDIN') {
      console.error('Unsupported platform:', platform)
      return jsonResponse({ message: 'Platform not supported for optimization' }, 400)
    }

    const isTwitter = platform === 'TWITTER'
    
    console.log('Processing optimization request:', {
      titleLength: title.length,
      contentLength: content.length,
      platform
    })

    const prompt = isTwitter
      ? `Convert this content into an engaging tweet thread format. Keep each tweet under 280 characters and maintain the key message. Title: "${title}" Content: "${content}"`
      : `Optimize this content for LinkedIn, making it more professional and engaging while maintaining the key message. Add relevant line breaks and formatting. Title: "${title}" Content: "${content}"`

    const messages = [
      {
        role: "system",
        content: isTwitter
          ? "You are an expert at creating viral Twitter threads. Convert the given content into an engaging tweet thread format. Use emojis appropriately and create a compelling narrative flow."
          : "You are a LinkedIn content expert. Optimize content for maximum professional engagement while maintaining authenticity. Use appropriate formatting and professional tone."
      },
      {
        role: "user",
        content: prompt
      }
    ]

    const data = await callOpenAI(messages, isTwitter ? 500 : 1500)
    const optimizedContent = data.choices?.[0]?.message?.content

    if (!optimizedContent) {
      console.error('No content generated from OpenAI')
      return jsonResponse({ message: 'Failed to generate optimized content' }, 500)
    }

    console.log('Successfully generated content:', {
      platform,
      charCount: optimizedContent.length
    })

    return jsonResponse({ 
      content: optimizedContent,
      platform,
      charCount: optimizedContent.length
    })
  } catch (error) {
    console.error('Error in AI optimization:', error)
    return jsonResponse(
      { message: error instanceof Error ? error.message : 'Failed to optimize content' },
      500
    )
  }
} 