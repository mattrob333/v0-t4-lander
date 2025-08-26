import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are a Tier 4 Intelligence AI strategist. Your role is to help enterprise prospects understand how Tier 4's 5-day AI POC process can solve their automation challenges.

Key points about Tier 4:
- 5-day Proof of Concept delivery
- 3-4x ROI validation with measurable results
- NDA-first, enterprise confidentiality focused
- Vendor-neutral AI guidance
- SOC 2-aligned security processes
- Focus on rapid validation, not endless analysis
- Fractional Chief Automation Officer services

Be conversational, helpful, and always guide towards scheduling a discovery call. Keep responses concise but informative. Ask qualifying questions about their automation needs.`

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Simulate AI response (in production, this would call Claude or another LLM)
    const aiResponse = generateAIResponse(message, conversationHistory)
    
    return NextResponse.json({ 
      response: aiResponse,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Chatbot API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateAIResponse(message: string, history: any[] = []): string {
  const lowerMessage = message.toLowerCase()
  
  // Simple keyword-based responses (in production, use Claude API)
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('budget')) {
    return "Our 5-day POC is designed to deliver measurable ROI before you make larger investments. Pricing depends on your specific automation opportunities - I'd love to connect you with one of our strategists to discuss your needs. Would you like to schedule a quick discovery call?"
  }
  
  if (lowerMessage.includes('timeline') || lowerMessage.includes('how long')) {
    return "We deliver a working Proof-of-Concept in just 5 days, with verified development quotes by the end of week 1. This is dramatically faster than the months most companies spend on analysis. What automation challenges are you facing that you'd like to validate quickly?"
  }
  
  if (lowerMessage.includes('security') || lowerMessage.includes('data')) {
    return "Security is paramount for us. We operate NDA-first and align to SOC 2 controls. We minimize data movement, use secure environments, and scope clear retention policies. What specific security requirements does your organization have?"
  }
  
  if (lowerMessage.includes('different') || lowerMessage.includes('better') || lowerMessage.includes('why')) {
    return "Unlike other AI consultants who spend months on analysis, we deliver tangible results in days. Our 5-day POC process gives you a working demo, verified quotes, and clear ROI projections - so you can make confident decisions quickly. What's your biggest automation opportunity right now?"
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hi! I'm here to help you understand how Tier 4's rapid AI validation process can solve your automation challenges. We deliver working Proof-of-Concepts in 5 days with 3-4x ROI validation. What automation opportunities are you exploring?"
  }
  
  // Default response
  return "Thanks for your question about AI automation. Tier 4 specializes in rapid validation - we deliver working Proof-of-Concepts in 5 days rather than months of analysis. I'd love to connect you with one of our strategists to discuss your specific needs. Would you like to schedule a discovery call?"
}