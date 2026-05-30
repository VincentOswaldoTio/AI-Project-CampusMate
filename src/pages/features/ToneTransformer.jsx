import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Send } from 'lucide-react'
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

export default function ToneTransformer() {
  const { callAPI, isLoading } = useOpenRouter()
  const { saveToHistory } = useHistory()

  // 1. State Kriteria Misi
  const [inputText, setInputText] = useState('')
  const [output, setOutput] = useState(null)
  const [selectedOption, setSelectedOption] = useState('formal') // 'formal' | 'journal' | 'report'

  // Map label nada untuk sistem prompt
  const toneLabels = {
    formal: 'Formal Akademik',
    journal: 'Jurnal Ilmiah',
    report: 'Laporan Resmi'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 2. Validasi: Minimal 50 Karakter
    if (inputText.trim().length < 50) {
      toast.error('Validasi Gagal', {
        description: 'Input minimal harus 50 karakter agar AI dapat mentransformasikan nada secara terperinci.'
      })
      return
    }

    // 3. Flow: Ambil Prompt & Jalankan API
    const systemPrompt = PROMPTS.toneTransformer
    const formattedUserMessage = `[NADA TARGET TARGET: ${toneLabels[selectedOption]}]\n\n${inputText.trim()}`

    const result = await callAPI({
      systemPrompt,
      userMessage: formattedUserMessage
    })

    // 4. Flow: Simpan Ke Riwayat & Set Output
    if (result) {
      setOutput(result)
      saveToHistory({
        feature: 'tone-transformer',
        featureName: 'Tone Transformer',
        category: 'Manipulasi Teks',
        input: inputText.trim().length > 150 ? inputText.trim().substring(0, 150) + '...' : inputText.trim(),
        output: result
      })
      toast.success('Transformasi Nada Selesai!', {
        description: 'Nada tulisan Anda berhasil ditransformasikan dan disimpan ke riwayat.'
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
            Tone Transformer
          </h1>
          <Badge className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-none rounded-full">
            Manipulasi Teks
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
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Transformasi Nada
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                Ubah nada tulisan santai, draf kasar, atau kalimat Anda menjadi register akademik formal, gaya jurnal, atau laporan resmi.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Opsi Target Nada (Select / Dropdown) */}
                <div className="space-y-1.5">
                  <Label htmlFor="tone-select" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Pilih Target Nada Tulisan
                  </Label>
                  <Select value={selectedOption} onValueChange={setSelectedOption}>
                    <SelectTrigger id="tone-select" className="rounded-lg border-border/40 bg-muted/10 text-xs h-9">
                      <SelectValue placeholder="Pilih target nada..." />
                    </SelectTrigger>
                    <SelectContent className="border-border/40">
                      <SelectItem value="formal">Formal Akademik (Baku)</SelectItem>
                      <SelectItem value="journal">Jurnal Ilmiah Terakreditasi</SelectItem>
                      <SelectItem value="report">Laporan Resmi Profesional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Textarea Input Utama */}
                <div className="space-y-1.5">
                  <Label htmlFor="user-input" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Teks Asli (Santai / Draf Kasar)
                  </Label>
                  <Textarea
                    id="user-input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste teks santai yang ingin diubah nadanya..."
                    className="min-h-[160px] rounded-lg border-border/40 bg-muted/5 text-[12px] leading-relaxed p-3 focus-visible:ring-primary focus-visible:ring-1"
                  />
                  <div className="flex justify-between items-center text-[9px] text-muted-foreground/80 font-medium px-0.5">
                    <span>Minimal 50 karakter</span>
                    <span>{inputText.length} Karakter</span>
                  </div>
                </div>

                {/* Tombol Submit (Ubah Nada) */}
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
                      <span>Ubah Nada</span>
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
            featureName="Tone Transformer"
            featureSlug="tone-transformer"
            isLoading={isLoading}
            emptyTitle="Hasil Transformasi Nada"
            emptyDescription="Ketik atau paste tulisan Anda yang terkesan santai atau draf tugas awal Anda di panel formulir sebelah kiri, kemudian klik tombol 'Ubah Nada' untuk melihat versi formal ilmiah di sini."
          />
        </div>

      </div>

    </div>
  )
}
