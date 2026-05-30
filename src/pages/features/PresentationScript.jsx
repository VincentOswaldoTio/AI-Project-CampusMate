import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Presentation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useOpenRouter } from '@/hooks/useOpenRouter'
import { useHistory } from '@/hooks/useHistory'
import { PROMPTS } from '@/lib/prompts'
import OutputBox from '@/components/shared/OutputBox'
import { toast } from 'sonner'

export default function PresentationScript() {
  const { callAPI, isLoading } = useOpenRouter()
  const { saveToHistory } = useHistory()

  // 1. State Kriteria Misi
  const [inputText, setInputText] = useState('') // Outline presentasi
  const [duration, setDuration] = useState('10') // 5 | 10 | 15 | 20 | 30 menit
  const [slides, setSlides] = useState('10') // Jumlah slide
  const [style, setStyle] = useState('Formal') // Formal | Semi-formal | Santai
  const [output, setOutput] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 2. Validasi: Jumlah slide harus wajar
    const slideNum = parseInt(slides)
    if (isNaN(slideNum) || slideNum <= 0 || slideNum > 100) {
      toast.error('Validasi Gagal', {
        description: 'Masukkan jumlah slide presentasi yang valid (antara 1 sampai 100).'
      })
      return
    }

    // 3. Validasi: Minimal 50 Karakter untuk outline
    if (inputText.trim().length < 50) {
      toast.error('Validasi Gagal', {
        description: 'Input outline presentasi minimal harus 50 karakter agar AI dapat memahami topik dan menyusun naskah pemaparan tiap slide.'
      })
      return
    }

    // 4. Flow: Ambil Prompt & Jalankan API
    const systemPrompt = PROMPTS.presentationScript
    const formattedUserMessage = `[DURASI PRESENTASI TARGET: ${duration} Menit] [JUMLAH SLIDE: ${slides} Slide] [GAYA/NADA BAHASA: ${style}]\n\n[DRAFT OUTLINE ATAU TOPIK SLIDE]:\n${inputText.trim()}`

    const result = await callAPI({
      systemPrompt,
      userMessage: formattedUserMessage
    })

    // 5. Flow: Simpan Ke Riwayat & Set Output
    if (result) {
      setOutput(result)
      saveToHistory({
        feature: 'presentation-script',
        featureName: 'Presentation Script',
        category: 'Produktivitas',
        input: `Naskah Slide (${duration}m, ${slides} slides): ${inputText.trim().substring(0, 80)}...`,
        output: result
      })
      toast.success('Naskah Presentasi Berhasil Dibuat!', {
        description: 'Draf skrip pembacaan per slide presentasi Anda telah disimpan ke riwayat.'
      })
    }
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      
      {/* Header Halaman */}
      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-border/40 hover:bg-muted transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-lg font-bold tracking-tight text-foreground leading-none">
            Presentation Script
          </h1>
          <Badge className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-none rounded-full">
            Produktivitas
          </Badge>
        </div>
      </div>

      <Separator className="border-border/30" />

      {/* Grid Desktop Split-Pane (Kiri 40%, Kanan 60%) / Mobile Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 items-start">
        
        {/* PANEL FORM (Kiri) */}
        <div className="lg:col-span-4 lg:sticky lg:top-4 space-y-4">
          <Card className="bg-gradient-to-br from-card to-muted/5 border-border/40 rounded-xl shadow-xs overflow-hidden">
            <CardHeader className="p-4 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-widest">
                <Presentation className="h-3.5 w-3.5 text-primary" />
                Penyusun Skrip Presentasi
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                Susun naskah pembicaraan per slide yang mengalir (opening hook, transition, closing) serta visual layout pendukung berdasarkan silabus atau outline tugas Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Durasi & Jumlah Slide (Grid 2 Kolom) */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Select Durasi */}
                  <div className="space-y-1.5">
                    <Label htmlFor="script-duration" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                      Durasi (Menit)
                    </Label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger id="script-duration" className="rounded-lg border-border/40 bg-muted/10 text-xs h-9">
                        <SelectValue placeholder="Pilih..." />
                      </SelectTrigger>
                      <SelectContent className="border-border/40">
                        <SelectItem value="5">5 Menit</SelectItem>
                        <SelectItem value="10">10 Menit</SelectItem>
                        <SelectItem value="15">15 Menit</SelectItem>
                        <SelectItem value="20">20 Menit</SelectItem>
                        <SelectItem value="30">30 Menit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Input Jumlah Slide */}
                  <div className="space-y-1.5">
                    <Label htmlFor="script-slides" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                      Jumlah Slide
                    </Label>
                    <Input 
                      id="script-slides"
                      type="number"
                      min="1"
                      max="100"
                      value={slides}
                      onChange={(e) => setSlides(e.target.value)}
                      className="rounded-lg border-border/40 bg-muted/10 text-xs h-9 focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>
                </div>

                {/* Gaya Penyampaian (RadioGroup 3 Column Grid) */}
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Gaya Pembicaraan (Tone)
                  </Label>
                  <RadioGroup 
                    value={style} 
                    onValueChange={setStyle} 
                    className="grid grid-cols-3 gap-2"
                  >
                    <div className="flex items-center gap-2 p-2 bg-muted/5 border border-border/40 rounded-lg hover:bg-muted/10 cursor-pointer justify-center">
                      <RadioGroupItem value="Formal" id="style-formal" />
                      <Label htmlFor="style-formal" className="text-[11px] font-bold text-foreground cursor-pointer flex-1 py-1 text-center select-none">
                        Formal
                      </Label>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-muted/5 border border-border/40 rounded-lg hover:bg-muted/10 cursor-pointer justify-center">
                      <RadioGroupItem value="Semi-formal" id="style-semi" />
                      <Label htmlFor="style-semi" className="text-[11px] font-bold text-foreground cursor-pointer flex-1 py-1 text-center select-none">
                        Semi-F
                      </Label>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-muted/5 border border-border/40 rounded-lg hover:bg-muted/10 cursor-pointer justify-center">
                      <RadioGroupItem value="Santai" id="style-santai" />
                      <Label htmlFor="style-santai" className="text-[11px] font-bold text-foreground cursor-pointer flex-1 py-1 text-center select-none">
                        Santai
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Textarea Outline */}
                <div className="space-y-1.5">
                  <Label htmlFor="script-outline" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Outline / Kerangka Presentasi
                  </Label>
                  <Textarea
                    id="script-outline"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Tempel outline bab riset, kata kunci topik pembahasan, atau kerangka salinan poin slide di sini..."
                    className="min-h-[140px] rounded-lg border-border/40 bg-muted/5 text-[12px] leading-relaxed p-3 focus-visible:ring-primary focus-visible:ring-1"
                  />
                  <div className="flex justify-between items-center text-[9px] text-muted-foreground/80 font-medium px-0.5 mt-1">
                    <span>Minimal 50 karakter</span>
                    <span>{inputText.length} Karakter</span>
                  </div>
                </div>

                {/* Tombol Buat Naskah */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-9 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider gap-1.5 shadow-sm transition-all duration-150 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <div className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Buat Naskah</span>
                    </>
                  )}
                </Button>

              </form>
            </CardContent>
          </Card>
        </div>

        {/* PANEL OUTPUT */}
        <div className="lg:col-span-6 w-full">
          <OutputBox
            content={output}
            featureName="Presentation Script"
            featureSlug="presentation-script"
            isLoading={isLoading}
            emptyTitle="Hasil Naskah Presentasi Per Slide"
            emptyDescription="Paste outline atau garis besar materi slide presentasi Anda di form sebelah kiri, tentukan target durasi bicara, jumlah slide, dan gaya penyampaian, kemudian klik 'Buat Naskah' untuk melihat skrip pembacaan lengkap."
          />
        </div>

      </div>

    </div>
  )
}
