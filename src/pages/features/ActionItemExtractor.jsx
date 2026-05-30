import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, CheckSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useOpenRouter } from '@/hooks/useOpenRouter'
import { useHistory } from '@/hooks/useHistory'
import { PROMPTS } from '@/lib/prompts'
import OutputBox from '@/components/shared/OutputBox'
import { toast } from 'sonner'

export default function ActionItemExtractor() {
  const { callAPI, isLoading } = useOpenRouter()
  const { saveToHistory } = useHistory()

  // 1. State Kriteria Misi
  const [inputText, setInputText] = useState('') // Notulensi rapat
  const [meetingName, setMeetingName] = useState('') // Nama rapat (opsional)
  const [output, setOutput] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 2. Validasi: Minimal 50 Karakter untuk notulensi
    if (inputText.trim().length < 50) {
      toast.error('Validasi Gagal', {
        description: 'Input teks notulensi/catatan rapat minimal harus 50 karakter agar AI dapat mengidentifikasi butir tindakan tugas secara mendalam.'
      })
      return
    }

    // 3. Flow: Ambil Prompt & Jalankan API
    const systemPrompt = PROMPTS.actionItemExtractor
    const formattedUserMessage = (meetingName.trim() ? `[NAMA RAPAT/DISKUSI: ${meetingName.trim()}]\n\n` : '') + 
      `[TEKS NOTULENSI & CATATAN RAPAT]:\n${inputText.trim()}`

    const result = await callAPI({
      systemPrompt,
      userMessage: formattedUserMessage
    })

    // 4. Flow: Simpan Ke Riwayat & Set Output
    if (result) {
      setOutput(result)
      saveToHistory({
        feature: 'action-item-extractor',
        featureName: 'Action Item Extractor',
        category: 'Produktivitas',
        input: `Ekstraksi Rapat (${meetingName.trim() || 'Rapat Umum'}): ${inputText.trim().substring(0, 80)}...`,
        output: result
      })
      toast.success('Action Items Berhasil Diekstrak!', {
        description: 'Butir penugasan checklist dan timeline penugasan telah disimpan ke riwayat.'
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
            Action Item Extractor
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
                <CheckSquare className="h-3.5 w-3.5 text-primary" />
                Ekstraksi Tugas Kelompok
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                Konversikan notulensi rapat panitia BEM, transkrip diskusi kelompok, atau rangkuman mata kuliah menjadi daftar tugas konkret beserta prioritas dan estimasi tenggat waktu.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Input Nama Rapat (Opsional) */}
                <div className="space-y-1.5">
                  <Label htmlFor="meeting-title" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Nama Rapat / Diskusi Kelompok <span className="text-muted-foreground/60">(Opsional)</span>
                  </Label>
                  <Input 
                    id="meeting-title"
                    value={meetingName}
                    onChange={(e) => setMeetingName(e.target.value)}
                    placeholder="Contoh: Rapat Koordinasi Seminar Nasional BEM..."
                    className="rounded-lg border-border/40 bg-muted/10 text-xs h-9 focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>

                {/* Textarea Notulensi Rapat */}
                <div className="space-y-1.5">
                  <Label htmlFor="meeting-notes" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Catatan Rapat / Notulensi Kasar
                  </Label>
                  <Textarea
                    id="meeting-notes"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Tempel catatan singkat hasil rapat kelompok, butir percakapan kasar, atau notulensi pleno panitia di sini..."
                    className="min-h-[160px] rounded-lg border-border/40 bg-muted/5 text-[12px] leading-relaxed p-3 focus-visible:ring-primary focus-visible:ring-1"
                  />
                  <div className="flex justify-between items-center text-[9px] text-muted-foreground/80 font-medium px-0.5 mt-1">
                    <span>Minimal 50 karakter</span>
                    <span>{inputText.length} Karakter</span>
                  </div>
                </div>

                {/* Tombol Ekstrak Action Items */}
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
                      <span>Ekstrak Action Items</span>
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
            featureName="Action Item Extractor"
            featureSlug="action-item-extractor"
            isLoading={isLoading}
            emptyTitle="Hasil Ekstraksi Daftar Tugas"
            emptyDescription="Paste teks pembicaraan kasar, catatan koordinasi, atau notulensi hasil diskusi kepanitiaan di form sebelah kiri, lalu klik 'Ekstrak Action Items' untuk mengidentifikasi checklist tugas beserta prioritas kerja."
          />
        </div>

      </div>

    </div>
  )
}
