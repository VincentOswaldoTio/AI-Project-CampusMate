import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Send, BookMarked } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useOpenRouter } from '@/hooks/useOpenRouter'
import { useHistory } from '@/hooks/useHistory'
import { PROMPTS } from '@/lib/prompts'
import OutputBox from '@/components/shared/OutputBox'
import { toast } from 'sonner'

export default function ResearchIdeaGenerator() {
  const { callAPI, isLoading } = useOpenRouter()
  const { saveToHistory } = useHistory()

  // 1. State Kriteria Misi
  const [inputText, setInputText] = useState('')
  const [output, setOutput] = useState(null)
  const [numIdeas, setNumIdeas] = useState('5') // '5' | '10' | '15'
  const [level, setLevel] = useState('S1') // 'S1' | 'S2' | 'S3'

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 2. Validasi: Minimal 50 Karakter
    if (inputText.trim().length < 50) {
      toast.error('Validasi Gagal', {
        description: 'Input topik/bidang penelitian minimal harus 50 karakter agar AI dapat memahami bidang ketertarikan Anda.'
      })
      return
    }

    // 3. Flow: Ambil Prompt & Jalankan API
    const systemPrompt = PROMPTS.researchIdeaGenerator
    const formattedUserMessage = `[TOPIK KETERTARIKAN PENELITIAN: ${inputText.trim()}] [JUMLAH IDE DIINGINKAN: ${numIdeas}] [JENJANG AKADEMIS TARGET: ${level}]`

    const result = await callAPI({
      systemPrompt,
      userMessage: formattedUserMessage
    })

    // 4. Flow: Simpan Ke Riwayat & Set Output
    if (result) {
      setOutput(result)
      saveToHistory({
        feature: 'research-idea-generator',
        featureName: 'Research Idea Generator',
        category: 'Riset & Struktur',
        input: `Topik: ${inputText.trim().substring(0, 100)}... (Jenjang: ${level}, Ide: ${numIdeas})`,
        output: result
      })
      toast.success('Ide Penelitian Berhasil Dibuat!', {
        description: 'Daftar usulan topik riset baru telah disimpan ke riwayat.'
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
            Research Idea Generator
          </h1>
          <Badge className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-none rounded-full">
            Riset &amp; Struktur
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
                <BookMarked className="h-3.5 w-3.5 text-primary" />
                Pembangkit Ide Penelitian
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                Temukan ide penelitian segar, relevan, orisinal, dan layak dikerjakan berdasarkan topik akademik minat Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Topik / Bidang Penelitian */}
                <div className="space-y-1.5">
                  <Label htmlFor="research-topic" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Topik / Bidang Penelitian
                  </Label>
                  <Input 
                    id="research-topic"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Contoh: Implementasi Artificial Intelligence pada rekam medis elektronik di puskesmas..."
                    className="rounded-lg border-border/40 bg-muted/10 text-xs h-9 focus-visible:ring-1 focus-visible:ring-primary"
                  />
                  <div className="flex justify-between items-center text-[9px] text-muted-foreground/80 font-medium px-0.5 mt-1">
                    <span>Minimal 50 karakter</span>
                    <span>{inputText.length} Karakter</span>
                  </div>
                </div>

                {/* Dropdowns row (2 Column Grid) */}
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Jumlah Ide */}
                  <div className="space-y-1.5">
                    <Label htmlFor="num-ideas" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                      Jumlah Ide
                    </Label>
                    <Select value={numIdeas} onValueChange={setNumIdeas}>
                      <SelectTrigger id="num-ideas" className="rounded-lg border-border/40 bg-muted/10 text-xs h-9">
                        <SelectValue placeholder="Pilih..." />
                      </SelectTrigger>
                      <SelectContent className="border-border/40">
                        <SelectItem value="5">5 Ide Riset</SelectItem>
                        <SelectItem value="10">10 Ide Riset</SelectItem>
                        <SelectItem value="15">15 Ide Riset</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Jenjang Studi */}
                  <div className="space-y-1.5">
                    <Label htmlFor="study-level" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                      Jenjang Studi S1-S3
                    </Label>
                    <Select value={level} onValueChange={setLevel}>
                      <SelectTrigger id="study-level" className="rounded-lg border-border/40 bg-muted/10 text-xs h-9">
                        <SelectValue placeholder="Pilih..." />
                      </SelectTrigger>
                      <SelectContent className="border-border/40">
                        <SelectItem value="S1">S1 (Skripsi)</SelectItem>
                        <SelectItem value="S2">S2 (Tesis)</SelectItem>
                        <SelectItem value="S3">S3 (Disertasi)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                </div>

                {/* Tombol Submit (Generate Ide Penelitian) */}
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
                      <span>Generate Ide Penelitian</span>
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
            featureName="Research Idea Generator"
            featureSlug="research-idea-generator"
            isLoading={isLoading}
            emptyTitle="Hasil Usulan Ide Riset S1-S3"
            emptyDescription="Ketik bidang ilmu yang ingin Anda teliti (misal: Hukum Siber, Sistem Rekam Medis) di form sebelah kiri, klik 'Generate Ide Penelitian' untuk merumuskan usulan topik skripsi/tesis lengkap beserta pertanyaaan riset dan metodologinya."
          />
        </div>

      </div>

    </div>
  )
}
