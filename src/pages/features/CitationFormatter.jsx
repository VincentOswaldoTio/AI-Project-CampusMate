import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useOpenRouter } from '@/hooks/useOpenRouter'
import { useHistory } from '@/hooks/useHistory'
import { PROMPTS } from '@/lib/prompts'
import OutputBox from '@/components/shared/OutputBox'
import { toast } from 'sonner'

export default function CitationFormatter() {
  const { callAPI, isLoading } = useOpenRouter()
  const { saveToHistory } = useHistory()

  // 1. State Kriteria Misi
  const [inputText, setInputText] = useState('')
  const [output, setOutput] = useState(null)
  const [style, setStyle] = useState('APA 7th') // APA 7th | MLA 9th | Harvard | Chicago | Vancouver | IEEE

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 2. Validasi: Minimal 50 Karakter
    if (inputText.trim().length < 50) {
      toast.error('Validasi Gagal', {
        description: 'Input informasi referensi minimal harus 50 karakter agar AI dapat mengidentifikasi data sumber tulisan secara detail.'
      })
      return
    }

    // 3. Flow: Ambil Prompt & Jalankan API
    const systemPrompt = PROMPTS.citationFormatter
    const formattedUserMessage = `[GAYA SITASI TARGET: ${style}]\n\n[SUMBER DATA REFERENSI UNTUK DIFORMAT]:\n${inputText.trim()}`

    const result = await callAPI({
      systemPrompt,
      userMessage: formattedUserMessage
    })

    // 4. Flow: Simpan Ke Riwayat & Set Output
    if (result) {
      setOutput(result)
      saveToHistory({
        feature: 'citation-formatter',
        featureName: 'Citation Formatter',
        category: 'Penulisan Ilmiah',
        input: `Format Sitasi (${style}): ${inputText.trim().substring(0, 100)}...`,
        output: result
      })
      toast.success('Sitasi Berhasil Diformat!', {
        description: `Referensi ilmiah Anda berhasil disusun ulang ke format ${style}.`
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
            Citation Formatter
          </h1>
          <Badge className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-none rounded-full">
            Penulisan Ilmiah
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
                <BookOpen className="h-3.5 w-3.5 text-primary" />
                Format Kutipan &amp; Sitasi
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                Ubah URL, DOI, abstrak kasar, atau nama penulis mentah menjadi daftar pustaka (bibliography) dan in-text citation yang presisi sesuai standar akademis dunia.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Gaya Sitasi (Select) */}
                <div className="space-y-1.5">
                  <Label htmlFor="citation-style" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Gaya Sitasi Target
                  </Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger id="citation-style" className="rounded-lg border-border/40 bg-muted/10 text-xs h-9">
                      <SelectValue placeholder="Pilih gaya sitasi..." />
                    </SelectTrigger>
                    <SelectContent className="border-border/40">
                      <SelectItem value="APA 7th">APA 7th Edition</SelectItem>
                      <SelectItem value="MLA 9th">MLA 9th Edition</SelectItem>
                      <SelectItem value="Harvard">Harvard Style</SelectItem>
                      <SelectItem value="Chicago">Chicago Manual</SelectItem>
                      <SelectItem value="Vancouver">Vancouver Style</SelectItem>
                      <SelectItem value="IEEE">IEEE Style</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Textarea Referensi Mentah */}
                <div className="space-y-1.5">
                  <Label htmlFor="citation-input" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Data Referensi Mentah
                  </Label>
                  <Textarea
                    id="citation-input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Satu sumber per baris. Bisa URL, DOI, atau info manual..."
                    className="min-h-[180px] rounded-lg border-border/40 bg-muted/5 text-[12px] leading-relaxed p-3 focus-visible:ring-primary focus-visible:ring-1"
                  />
                  <div className="flex justify-between items-center text-[9px] text-muted-foreground/80 font-medium px-0.5 mt-1">
                    <span>Minimal 50 karakter</span>
                    <span>{inputText.length} Karakter</span>
                  </div>
                </div>

                {/* Tombol Format Sitasi */}
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
                      <span>Format Sitasi</span>
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
            featureName="Citation Formatter"
            featureSlug="citation-formatter"
            isLoading={isLoading}
            emptyTitle="Hasil Sitasi &amp; Daftar Pustaka"
            emptyDescription="Paste data/informasi referensi mentah Anda di kolom sebelah kiri, pilih gaya sitasi yang ditargetkan, lalu klik 'Format Sitasi' untuk menyusun daftar pustaka serta gaya kutipan dalam kalimat otomatis."
          />
        </div>

      </div>

    </div>
  )
}
