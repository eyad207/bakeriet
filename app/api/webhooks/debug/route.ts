import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    console.log('📋 Webhook debug endpoint called')
    console.log(
      'Headers:',
      JSON.stringify(Object.fromEntries(req.headers.entries()), null, 2)
    )

    const body = await req.text()
    console.log('Body length:', body.length)
    console.log('Body preview:', body.substring(0, 200) + '...')

    return NextResponse.json({
      message: 'Debug webhook received',
      timestamp: new Date().toISOString(),
      bodyLength: body.length,
    })
  } catch (error) {
    console.error('Debug webhook error:', error)
    return NextResponse.json({ error: 'Debug webhook error' }, { status: 500 })
  }
}
