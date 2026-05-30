import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useOpenRouter } from '@/hooks/useOpenRouter'
import { useHistory } from '@/hooks/useHistory'
import { PROMPTS } from '@/lib/prompts'
import OutputBox from '@/components/shared/OutputBox'
import { toast } from 'sonner'

/**
 * FeatureLayout Component - Kontainer Master Split-Pane Premium untuk 20 Fitur AI.
 * 
 * @param {Object} props
 * @param {string} props.title - Judul fitur
 * @param {string} props.category - Kategori fitur
 * @param {string} props.featureSlug - Slug rute fitur (misal: 'smart-summarizer')
 * @param {string} props.promptKey - Kunci system prompt di prompts.js
 * @param {string} props.labelInput - Label input utama
 * @param {string} props.placeholder - Teks placeholder input
 * @param {string} props.description - Deskripsi singkat fitur
 */
export default function FeatureLayout({
  title,
  category,
  featureSlug,
  promptKey,
  labelInput = 'Teks Input Akademik',
  placeholder = 'Tempelkan teks Anda di sini untuk diproses...',
  description
}) {
  const { callAPI, isLoading } = useOpenRouter()
  const { saveToHistory } = useHistory()

  // State Input Utama
  const [userInput, setUserInput] = useState('')
  const [aiOutput, setAiOutput] = useState(null)

  // State Khusus Fitur Tertentu
  const [citationStyle, setCitationStyle] = useState('APA 7th')
  const [targetTone, setTargetTone] = useState('Formal Akademik')
  const [translationDirection, setTranslationDirection] = useState('Indonesia ke Inggris')

  // Handler Kirim ke AI
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!userInput || userInput.trim() === '') {
      toast.error('Input tidak boleh kosong.', {
        description: 'Masukkan teks akademik Anda terlebih dahulu.'
      })
      return
    }

    // Ambil system prompt yang sesuai dari prompts.js
    const systemPrompt = PROMPTS[promptKey]
    if (!systemPrompt) {
      toast.error('System prompt tidak ditemukan!', {
        description: `Kunci ${promptKey} tidak terdaftar di sistem prompts.`
      })
      return
    }

    // Modifikasi user message berdasarkan form opsi khusus
    let modifiedUserMessage = userInput.trim()
    if (featureSlug === 'citation-formatter') {
      modifiedUserMessage = `[GAYA SITASI TARGET: ${citationStyle}]\n\n${userInput}`
    } else if (featureSlug === 'tone-transformer') {
      modifiedUserMessage = `[NADA TARGET: ${targetTone}]\n\n${userInput}`
    } else if (featureSlug === 'abstract-translator') {
      modifiedUserMessage = `[ARAH TERJEMAHAN: ${translationDirection}]\n\n${userInput}`
    }

    // Panggil API
    const response = await callAPI({
      systemPrompt,
      userMessage: modifiedUserMessage
    })

    if (response) {
      setAiOutput(response)
      
      // Simpan ke riwayat secara otomatis
      saveToHistory({
        feature: featureSlug,
        featureName: title,
        category,
        input: userInput.length > 150 ? userInput.substring(0, 150) + '...' : userInput,
        output: response
      })

      toast.success('Analisis AI Selesai!', {
        description: `Hasil ${title} berhasil digenerasi dan disimpan ke riwayat.`
      })
    }
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      
      {/* Back Button & Header Tipis */}
      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-border/40 hover:bg-muted transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-lg font-bold tracking-tight text-foreground leading-none">
            {title}
          </h1>
          <Badge className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-primary/10 text-primary border-none rounded-full">
            {category}
          </Badge>
        </div>
      </div>

      <Separator className="border-border/30" />

      {/* Grid Split-Pane Layout - Desktop: Kiri 40% (Form), Kanan 60% (OutputBox) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 items-start">
        
        {/* PANEL KIRI (Form Input) - 40% Desktop */}
        <div className="lg:col-span-4 lg:sticky lg:top-4 space-y-4">
          <Card className="bg-gradient-to-br from-card to-muted/5 border-border/40 rounded-xl shadow-xs overflow-hidden">
            <CardHeader className="p-4 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                KONFIGURASI INPUT
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                {description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* 1. OPSI KHUSUS FITUR SPESIFIK */}
                
                {/* Opsi Citation Formatter */}
                {featureSlug === 'citation-formatter' && (
                  <div className="space-y-1.5">
                    <Label htmlFor="citation-style" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Gaya Sitasi
                    </Label>
                    <Select value={citationStyle} onValueChange={setCitationStyle}>
                      <SelectTrigger id="citation-style" className="rounded-lg border-border/40 bg-muted/10 h-8 text-[11px]">
                        <SelectValue placeholder="Pilih gaya sitasi..." />
                      </SelectTrigger>
                      <SelectContent className="border-border/40">
                        <SelectItem value="APA 7th">APA 7th Edition</SelectItem>
                        <SelectItem value="IEEE">IEEE Style</SelectItem>
                        <SelectItem value="Harvard">Harvard Style</SelectItem>
                        <SelectItem value="Chicago">Chicago Manual of Style</SelectItem>
                        <SelectItem value="Vancouver">Vancouver Style</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Opsi Tone Transformer */}
                {featureSlug === 'tone-transformer' && (
                  <div className="space-y-1.5">
                    <Label htmlFor="target-tone" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Nada Target Tulisan
                    </Label>
                    <Select value={targetTone} onValueChange={setTargetTone}>
                      <SelectTrigger id="target-tone" className="rounded-lg border-border/40 bg-muted/10 h-8 text-[11px]">
                        <SelectValue placeholder="Pilih nada..." />
                      </SelectTrigger>
                      <SelectContent className="border-border/40">
                        <SelectItem value="Formal Akademik">Formal &amp; Akademik Baku</SelectItem>
                        <SelectItem value="Persuasif">Persuasif Ilmiah</SelectItem>
                        <SelectItem value="Deskriptif Analitis">Deskriptif &amp; Analitis</SelectItem>
                        <SelectItem value="Sederhana &amp; Populer">Sederhana &amp; Sains Populer</SelectItem>
                        <SelectItem value="Kritis Evaluatif">Kritis &amp; Evaluatif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Opsi Abstract Translator */}
                {featureSlug === 'abstract-translator' && (
                  <div className="space-y-1.5">
                    <Label htmlFor="translation-dir" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Arah Bahasa Terjemahan
                    </Label>
                    <Select value={translationDirection} onValueChange={setTranslationDirection}>
                      <SelectTrigger id="translation-dir" className="rounded-lg border-border/40 bg-muted/10 h-8 text-[11px]">
                        <SelectValue placeholder="Pilih arah terjemahan..." />
                      </SelectTrigger>
                      <SelectContent className="border-border/40">
                        <SelectItem value="Indonesia ke Inggris">Bahasa Indonesia &rarr; English (Academic)</SelectItem>
                        <SelectItem value="Inggris ke Indonesia">English &rarr; Bahasa Indonesia (Akademik)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* 2. INPUT TEXTAREA UTAMA */}
                <div className="space-y-1.5">
                  <Label htmlFor="user-input" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {labelInput}
                  </Label>
                  <Textarea
                    id="user-input"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={placeholder}
                    className="min-h-[160px] rounded-lg border-border/40 bg-muted/5 text-[12px] leading-relaxed p-3 focus-visible:ring-primary focus-visible:ring-1"
                  />
                  <div className="flex justify-between items-center text-[9px] text-muted-foreground/80 font-medium px-0.5">
                    <span>Gunakan bahasa akademik</span>
                    <span>{userInput.length} Karakter</span>
                  </div>
                </div>

                {/* 3. TOMBOL SUBMIT (Gradient Button, Max height 36px) */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-9 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider gap-1.5 shadow-sm transition-all duration-150 active:scale-[0.98]"
                >
                  <Send className="h-3.5 w-3.5" />
                  {isLoading ? 'Sedang Memproses...' : 'Proses dengan AI'}
                </Button>

              </form>
            </CardContent>
          </Card>
        </div>

        {/* PANEL KANAN (Output Box AI) - 60% Desktop */}
        <div className="lg:col-span-6 w-full">
          <OutputBox
            content={aiOutput}
            featureName={title}
            featureSlug={featureSlug}
            isLoading={isLoading}
            emptyTitle={`Hasil Analisis ${title}`}
            emptyDescription={`Silakan ketik teks Anda pada panel input di sebelah kiri, kemudian klik tombol "PROSES DENGAN AI" untuk melihat hasil analisis di sini.`}
          />
        </div>

      </div>

    </div>
  )
}
