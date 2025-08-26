import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, company, notes, source } = await request.json()

    if (!name || !email || !company) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // For now, just log the data - we'll connect to Airtable via MCP in server actions instead
    console.log('Lead submission received:', { name, email, company, notes, source })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Lead submitted successfully'
    })

  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}