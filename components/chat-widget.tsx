"use client"

import { useEffect, useRef, useState } from "react"
import { MessageCircle, Send, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ChatMsg = { role: "user" | "agent"; text: string }

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { role: "agent", text: "Hi — Ask a Tier 4 Strategist anything. We’ll reply ASAP." },
  ])
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [msgs, open])

  async function onSend() {
    const text = input.trim()
    if (!text) return
    
    const userMessage = { role: "user" as const, text }
    setMsgs((m) => [...m, userMessage])
    setInput("")
    
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          conversationHistory: msgs
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }
      
      const data = await response.json()
      
      const agentMessage = { role: "agent" as const, text: data.response }
      setMsgs((m) => [...m, agentMessage])
      
      // Save conversation to Airtable (if it contains meaningful interaction)
      if (msgs.length > 2) { // Only save after a few exchanges
        saveChatToAirtable(text, data.response)
      }
      
    } catch (error) {
      console.error('Chat error:', error)
      setMsgs((m) => [...m, { 
        role: "agent", 
        text: "I apologize, but I'm having trouble connecting right now. Please try scheduling a call directly or contact us via email." 
      }])
    }
  }
  
  async function saveChatToAirtable(userMessage: string, agentResponse: string) {
    try {
      await fetch('/api/airtable/create-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Chatbot User',
          email: 'chatbot@tier4intelligence.com',
          company: 'Unknown',
          notes: `User: ${userMessage}\n\nAgent: ${agentResponse}`,
          source: 'Chatbot'
        })
      })
    } catch (error) {
      console.error('Failed to save chat to Airtable:', error)
    }
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#00A878] px-4 py-3 text-white shadow-lg hover:bg-[#00936B]"
          aria-label="Open chat - Ask a Tier 4 Strategist"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="hidden md:inline">Ask a Strategist</span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-50 w-[90vw] max-w-sm overflow-hidden rounded-xl border border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-neutral-950">
          <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 px-3 py-2">
            <div className="text-sm font-semibold">Ask a Tier 4 Strategist</div>
            <button aria-label="Close chat" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="max-h-[50vh] overflow-y-auto p-3">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "mb-2 rounded-lg px-3 py-2 text-sm",
                  m.role === "user"
                    ? "ml-auto max-w-[80%] bg-emerald-100 text-black dark:bg-emerald-900/40 dark:text-white"
                    : "mr-auto max-w-[85%] bg-black/[0.04] text-black dark:bg-white/[0.06] dark:text-white"
                )}
              >
                {m.text}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="flex items-center gap-2 border-t border-black/10 dark:border-white/10 p-2">
            <input
              aria-label="Type your message"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-9 w-full rounded border border-black/10 px-3 text-sm outline-none focus:ring-2 focus:ring-[#00A878]/20 dark:border-white/10 dark:bg-neutral-900 dark:text-white"
            />
            <Button size="sm" className="bg-[#00A878] text-white hover:bg-[#00936B]" onClick={onSend}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
