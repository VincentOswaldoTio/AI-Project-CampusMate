import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Brain } from 'lucide-react'
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

export default function ConceptSimplifier() {
  const { callAPI, isLoading } = useOpenRouter()
  const { saveToHistory } = useHistory()

  // 1. State Kriteria Misi
  const [inputText, setInputText] = useState('')
  const [field, setField] = useState('Sains & Teknologi') // Sains & Teknologi | Sosial & Humaniora | Ekonomi | Hukum | Kesehatan | Lainnya
  const [level, setLevel] = useState(2) // 1 - 4
  const [output, setOutput] = useState(null)

  const levels = [
    { value: 1, label: 'Sangat Sederhana (Pilar Analogi Balita)', desc: 'Menggunakan perumpamaan super dasar dan analogi kehidupan sehari-hari tanpa jargon teknis.' },
    { value: 2, label: 'Sederhana (Tingkat Menengah / SMA)', desc: 'Penjelasan santai tingkat menengah dengan contoh aplikatif di kehidupan nyata.' },
    { value: 3, label: 'Menengah (Pemahaman Mahasiswa)', desc: 'Bahasa terstruktur dengan menyertakan dasar konseptual teoretis serta diagram logis.' },
    { value: 4, label: 'Akademik (Diksi Pakar & Teoretis)', desc: 'Diksi formal akademik, kerangka analitis lengkap, glosarium ilmiah, dan rujukan lanjut.' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 2. Validasi: Minimal 5 Karakter untuk konsep
    if (inputText.trim().length < 5) {
      toast.error('Validasi Gagal', {
        description: 'Nama konsep atau teori harus diisi minimal 5 karakter agar AI dapat mengidentifikasi teori akademik yang Anda tuju.'
      })
      return
    }

    // 3. Flow: Ambil Prompt & Jalankan API
    const systemPrompt = PROMPTS.conceptSimplifier
    const formattedUserMessage = `[NAMA KONSEP/TEORI: ${inputText.trim()}] [BIDANG ILMU: ${field}] [TINGKAT PENJELASAN TARGET: ${levels[level - 1].label}]`

    const result = await callAPI({
      systemPrompt,
      userMessage: formattedUserMessage
    })

    // 4. Flow: Simpan Ke Riwayat & Set Output
    if (result) {
      setOutput(result)
      saveToHistory({
        feature: 'concept-simplifier',
        featureName: 'Concept Simplifier',
        category: 'Belajar & Studi',
        input: `Konsep: ${inputText.trim().substring(0, 100)}... (Bidang: ${field}, Level: ${level})`,
        output: result
      })
      toast.success('Konsep Berhasil Disederhanakan!', {
        description: `Penjelasan konsep ilmiah ${inputText.trim().substring(0, 30)}... telah disimpan.`
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
            Concept Simplifier
          </h1>
          <Badge className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none rounded-full">
            Belajar &amp; Studi
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
                <Brain className="h-3.5 w-3.5 text-primary" />
                Penyederhana Konsep Sulit
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                Ubah konsep, teori matematika, hukum sains, atau jargon sosiologi yang rumit menjadi penjelasan mudah dicerna sesuai level pemahaman target.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Input Nama Konsep */}
                <div className="space-y-1.5">
                  <Label htmlFor="concept-name" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Nama Konsep / Teori Akademik
                  </Label>
                  <Input 
                    id="concept-name"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Contoh: Hukum Termodinamika Kedua, Teori Relativitas Khusus..."
                    className="rounded-lg border-border/40 bg-muted/10 text-xs h-9 focus-visible:ring-1 focus-visible:ring-primary"
                  />
                  <div className="flex justify-between items-center text-[9px] text-muted-foreground/80 font-medium px-0.5 mt-1">
                    <span>Minimal 5 karakter</span>
                    <span>{inputText.length} Karakter</span>
                  </div>
                </div>

                {/* Bidang Ilmu (Select) */}
                <div className="space-y-1.5">
                  <Label htmlFor="field-study" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Bidang Keilmuan
                  </Label>
                  <Select value={field} onValueChange={setField}>
                    <SelectTrigger id="field-study" className="rounded-lg border-border/40 bg-muted/10 text-xs h-9">
                      <SelectValue placeholder="Pilih bidang..." />
                    </SelectTrigger>
                    <SelectContent className="border-border/40">
                      <SelectItem value="Sains &amp; Teknologi">Sains &amp; Teknologi</SelectItem>
                      <SelectItem value="Sosial &amp; Humaniora">Sosial &amp; Humaniora</SelectItem>
                      <SelectItem value="Ekonomi">Ekonomi &amp; Bisnis</SelectItem>
                      <SelectItem value="Hukum">Hukum &amp; Politik</SelectItem>
                      <SelectItem value="Kesehatan">Kesehatan &amp; Kedokteran</SelectItem>
                      <SelectItem value="Lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Slider Tingkat Penjelasan (4 Level) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    <span>Tingkat Penjelasan</span>
                    <span className="text-primary font-bold lowercase first-letter:uppercase">{levels[level - 1].label.split(' ')[0]}</span>
                  </div>
                  <div className="relative pt-1 px-0.5">
                    <input
                      type="range"
                      min="1"
                      max="4"
                      value={level}
                      onChange={(e) => setLevel(Number(e.target.value))}
                      className="w-full h-1.5 bg-muted/30 border border-border/40 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
                    />
                    <div className="flex justify-between text-[9px] text-muted-foreground/80 font-medium px-0.5 mt-1.5 select-none">
                      <span>Balita</span>
                      <span>SMA</span>
                      <span>Kuliah</span>
                      <span>Akademik</span>
                    </div>
                  </div>
                  <div className="p-2.5 bg-primary/5 border border-primary/20 rounded-lg text-[10px] text-muted-foreground leading-relaxed">
                    <strong className="text-foreground block mb-0.5">{levels[level - 1].label}</strong>
                    {levels[level - 1].desc}
                  </div>
                </div>

                {/* Tombol Jelaskan */}
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
                      <span>Jelaskan</span>
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
            featureName="Concept Simplifier"
            featureSlug="concept-simplifier"
            isLoading={isLoading}
            emptyTitle="Hasil Penjelasan Konsep"
            emptyDescription="Ketik nama teori atau hukum sains yang ingin Anda pelajari di sebelah kiri, tentukan target bidang ilmu dan level pemahaman yang diinginkan, kemudian klik 'Jelaskan' untuk menyederhanakan materi sulit menjadi analogi menarik."
          />
        </div>

      </div>

    </div>
  )
}
