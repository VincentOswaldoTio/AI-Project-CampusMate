import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
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

export default function ArgumentBuilder() {
  const { callAPI, isLoading } = useOpenRouter()
  const { saveToHistory } = useHistory()

  // 1. State Kriteria Misi
  const [inputText, setInputText] = useState('')
  const [output, setOutput] = useState(null)
  const [stance, setStance] = useState('pro') // 'pro' | 'kontra' | 'keduanya'
  const [numArguments, setNumArguments] = useState('3') // '3' | '5' | '7'

  // Map label sikap untuk sistem prompt
  const stanceLabels = {
    pro: 'PRO (Mendukung)',
    kontra: 'KONTRA (Menentang/Menolak)',
    keduanya: 'Keduanya (Sintesis Pro & Kontra)'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 2. Validasi: Minimal 50 Karakter
    if (inputText.trim().length < 50) {
      toast.error('Validasi Gagal', {
        description: 'Input topik debat/esai minimal harus 50 karakter agar AI dapat menyusun argumentasi ilmiah yang mendalam.'
      })
      return
    }

    // 3. Flow: Ambil Prompt & Jalankan API
    const systemPrompt = PROMPTS.argumentBuilder
    const formattedUserMessage = `[TOPIK DEBAT/ESAI: ${inputText.trim()}] [PERSPEKTIF ARTIKEL: ${stanceLabels[stance]}] [JUMLAH ARGUMEN DIINGINKAN: ${numArguments}]`

    const result = await callAPI({
      systemPrompt,
      userMessage: formattedUserMessage
    })

    // 4. Flow: Simpan Ke Riwayat & Set Output
    if (result) {
      setOutput(result)
      saveToHistory({
        feature: 'argument-builder',
        featureName: 'Argument Builder',
        category: 'Riset & Struktur',
        input: `Topik: ${inputText.trim().substring(0, 100)}... (Perspektif: ${stance.toUpperCase()}, Jumlah: ${numArguments})`,
        output: result
      })
      toast.success('Argumen Berhasil Disusun!', {
        description: 'Daftar argumen Toulmin terstruktur telah disimpan ke riwayat.'
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
            Argument Builder
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
                <Scale className="h-3.5 w-3.5 text-primary" />
                Penyusun Argumen Ilmiah
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                Bangun argumen akademik yang kuat, logis, terstruktur (metode Toulmin) untuk mendukung atau membantah suatu tesis/klaim penelitian.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Topik Debat / Esai */}
                <div className="space-y-1.5">
                  <Label htmlFor="argument-topic" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Topik Debat / Esai
                  </Label>
                  <Input 
                    id="argument-topic"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Contoh: Penggunaan kecerdasan buatan dalam penilaian ujian esai mahasiswa di perguruan tinggi negeri..."
                    className="rounded-lg border-border/40 bg-muted/10 text-xs h-9 focus-visible:ring-1 focus-visible:ring-primary"
                  />
                  <div className="flex justify-between items-center text-[9px] text-muted-foreground/80 font-medium px-0.5 mt-1">
                    <span>Minimal 50 karakter</span>
                    <span>{inputText.length} Karakter</span>
                  </div>
                </div>

                {/* Perspektif/Sikap (RadioGroup) */}
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Perspektif / Sikap Argumen
                  </Label>
                  <RadioGroup 
                    value={stance} 
                    onValueChange={setStance} 
                    className="grid grid-cols-3 gap-2"
                  >
                    <div className="flex items-center gap-2 p-2 bg-muted/5 border border-border/40 rounded-lg hover:bg-muted/10 cursor-pointer justify-center">
                      <RadioGroupItem value="pro" id="stance-pro" />
                      <Label htmlFor="stance-pro" className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 cursor-pointer flex-1 py-1 text-center select-none">
                        PRO
                      </Label>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-muted/5 border border-border/40 rounded-lg hover:bg-muted/10 cursor-pointer justify-center">
                      <RadioGroupItem value="kontra" id="stance-kontra" />
                      <Label htmlFor="stance-kontra" className="text-[11px] font-bold text-rose-600 dark:text-rose-400 cursor-pointer flex-1 py-1 text-center select-none">
                        KONTRA
                      </Label>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-muted/5 border border-border/40 rounded-lg hover:bg-muted/10 cursor-pointer justify-center">
                      <RadioGroupItem value="keduanya" id="stance-keduanya" />
                      <Label htmlFor="stance-keduanya" className="text-[11px] font-bold text-amber-600 dark:text-amber-400 cursor-pointer flex-1 py-1 text-center select-none">
                        KEDUANYA
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Jumlah Argumen */}
                <div className="space-y-1.5">
                  <Label htmlFor="num-arguments" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Jumlah Argumen Utama
                  </Label>
                  <Select value={numArguments} onValueChange={setNumArguments}>
                    <SelectTrigger id="num-arguments" className="rounded-lg border-border/40 bg-muted/10 text-xs h-9">
                      <SelectValue placeholder="Pilih..." />
                    </SelectTrigger>
                    <SelectContent className="border-border/40">
                      <SelectItem value="3">3 Argumen Utama</SelectItem>
                      <SelectItem value="5">5 Argumen Utama</SelectItem>
                      <SelectItem value="7">7 Argumen Utama</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tombol Submit (Susun Argumen) */}
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
                      <span>Susun Argumen</span>
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
            featureName="Argument Builder"
            featureSlug="argument-builder"
            isLoading={isLoading}
            emptyTitle="Hasil Konstruksi Argumen Ilmiah"
            emptyDescription="Ketik topik perdebatan, posisi esai, atau klaim hipotesis Anda di panel sebelah kiri, lalu klik 'Susun Argumen' untuk memformulasikan argumen dengan struktur Toulmin yang kokoh, kredibel, dan berlandaskan penalaran logis akademik."
          />
        </div>

      </div>

    </div>
  )
}
