import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Send, RotateCcw, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useApiStore } from '@/store/apiStore'
import { useHistory } from '@/hooks/useHistory'
import { PROMPTS } from '@/lib/prompts'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: 'Hai, aku di sini untuk menemanimu. Ceritakan apa yang sedang kamu rasakan atau pikirkan... 💛'
}

export default function MotivationWellness() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { saveToHistory } = useHistory()
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  // Auto-focus input saat mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const { apiKey, model } = useApiStore.getState()

    if (!apiKey || apiKey.trim() === '') {
      toast.error('API key belum diatur.', {
        description: 'Masukkan OpenRouter API key di halaman Pengaturan terlebih dahulu.'
      })
      return
    }

    // Tambah pesan pengguna
    const userMessage = { role: 'user', content: trimmed }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    try {
      // Bangun conversation history lengkap untuk multi-turn
      const apiMessages = [
        { role: 'system', content: PROMPTS.motivationWellness },
        ...updatedMessages.map(m => ({ role: m.role, content: m.content }))
      ]

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'CampusMate AI'
        },
        body: JSON.stringify({
          model: model || 'openrouter/auto',
          max_tokens: 1500,
          messages: apiMessages
        })
      })

      if (!response.ok) {
        const status = response.status
        if (status === 401) throw new Error('API key tidak valid.')
        if (status === 429) throw new Error('Terlalu banyak request. Tunggu sebentar.')
        throw new Error(`Terjadi kesalahan server (${status}).`)
      }

      const data = await response.json()
      const assistantText = data?.choices?.[0]?.message?.content?.trim()

      if (assistantText) {
        setMessages(prev => [...prev, { role: 'assistant', content: assistantText }])
        saveToHistory({
          feature: 'motivation-wellness',
          featureName: 'Motivation & Wellness',
          category: 'Kesejahteraan',
          input: trimmed.length > 150 ? trimmed.substring(0, 150) + '...' : trimmed,
          output: assistantText
        })
      } else {
        toast.error('Respons kosong dari AI.')
      }
    } catch (err) {
      toast.error(err.message || 'Gagal menghubungi AI.')
      // Tambah pesan error ke chat agar konteks tidak hilang
      setMessages(prev => [...prev, { role: 'assistant', content: 'Maaf, aku mengalami gangguan saat merespons. Coba kirim pesanmu lagi ya... 🙏' }])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleReset = () => {
    setMessages([WELCOME_MESSAGE])
    setInput('')
    toast.success('Obrolan baru dimulai.', { description: 'Ceritakan kembali apa yang kamu rasakan.' })
    inputRef.current?.focus()
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto">

      {/* Header Halaman */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-border/40 hover:bg-muted transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-foreground leading-none">
              Motivation &amp; Wellness
            </h1>
            <Badge className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-pink-500/10 text-pink-600 dark:text-pink-400 border-none rounded-full">
              Kesejahteraan
            </Badge>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="h-8 text-[10px] uppercase font-bold tracking-wider gap-1.5 cursor-pointer rounded-lg border-border/40"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Obrolan Baru</span>
        </Button>
      </div>

      <Separator className="border-border/30" />

      {/* Chat Container */}
      <div className="flex flex-col rounded-xl border border-border/40 bg-gradient-to-b from-card to-muted/5 overflow-hidden" style={{ height: 'calc(100vh - 220px)', minHeight: '400px' }}>

        {/* Scrollable Chat Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-5 space-y-5"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] sm:max-w-[70%] ${msg.role === 'user' ? 'order-1' : 'order-0'}`}>
                {/* Avatar & Role Label */}
                <div className={`flex items-center gap-1.5 mb-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <Heart className="h-3 w-3 text-pink-500" />
                  )}
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    {msg.role === 'user' ? 'Kamu' : 'CampusMate'}
                  </span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl px-4 py-3 text-[13px] leading-relaxed break-words ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md whitespace-pre-wrap'
                      : 'bg-muted/20 border border-border/30 text-foreground rounded-bl-md'
                  }`}
                >
                  {msg.role === 'user' ? (
                    msg.content
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p({ children }) {
                          return <p className="mb-2.5 last:mb-0 leading-relaxed text-[13px] text-foreground/90">{children}</p>
                        },
                        ul({ children }) {
                          return <ul className="list-disc pl-4 space-y-1 my-2 text-[13px] text-foreground/90 marker:text-pink-500/60">{children}</ul>
                        },
                        ol({ children }) {
                          return <ol className="list-decimal pl-4 space-y-1 my-2 text-[13px] text-foreground/90 marker:text-pink-500/60 marker:font-semibold">{children}</ol>
                        },
                        li({ children }) {
                          return <li className="pl-0.5">{children}</li>
                        },
                        strong({ children }) {
                          return <strong className="font-bold text-foreground">{children}</strong>
                        },
                        em({ children }) {
                          return <em className="italic text-foreground/80">{children}</em>
                        },
                        h1({ children }) {
                          return <h1 className="text-[14px] font-bold text-pink-600 dark:text-pink-400 mt-3 mb-1.5 first:mt-0">{children}</h1>
                        },
                        h2({ children }) {
                          return <h2 className="text-[13px] font-bold text-pink-600 dark:text-pink-400 mt-2.5 mb-1.5 first:mt-0">{children}</h2>
                        },
                        h3({ children }) {
                          return <h3 className="text-[12.5px] font-bold text-foreground mt-2 mb-1 first:mt-0">{children}</h3>
                        },
                        blockquote({ children }) {
                          return (
                            <blockquote className="border-l-2 border-pink-500/60 bg-pink-500/5 dark:bg-pink-500/10 px-3 py-1.5 my-2.5 rounded-r-md italic text-[12px] leading-relaxed text-foreground/80">
                              {children}
                            </blockquote>
                          )
                        }
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] sm:max-w-[70%]">
                <div className="flex items-center gap-1.5 mb-1">
                  <Heart className="h-3 w-3 text-pink-500" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    CampusMate
                  </span>
                </div>
                <div className="bg-muted/20 border border-border/30 rounded-2xl rounded-bl-md px-4 py-3 inline-flex gap-1.5 items-center">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area (Fixed Bottom) */}
        <div className="border-t border-border/40 bg-background/80 backdrop-blur-md p-3">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ceritakan apa yang kamu rasakan..."
              rows={1}
              className="flex-1 resize-none rounded-xl border border-border/40 bg-muted/10 px-4 py-2.5 text-[13px] leading-relaxed placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
              style={{ maxHeight: '120px' }}
              onInput={(e) => {
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
              }}
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-sm transition-all duration-150 active:scale-[0.95] disabled:opacity-40"
            >
              {isLoading ? (
                <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Disclaimer */}
          <p className="text-[9px] text-muted-foreground/50 text-center mt-2 leading-tight select-none">
            CampusMate bukan pengganti psikolog profesional. Untuk masalah serius, hubungi konselor kampusmu.
          </p>
        </div>
      </div>
    </div>
  )
}
