import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Send, BookMarked } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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

export default function AutomaticOutline() {
  const { callAPI, isLoading } = useOpenRouter()
  const { saveToHistory } = useHistory()

  // 1. State Kriteria Misi
  const [inputText, setInputText] = useState('') // Judul Penelitian
  const [backgroundText, setBackgroundText] = useState('') // Latar Belakang (Opsional)
  const [output, setOutput] = useState(null)
  const [selectedOption, setSelectedOption] = useState('skripsi') // 'skripsi' | 'makalah' | 'proposal' | 'tesis'

  // Map label dokumen untuk sistem prompt
  const docLabels = {
    skripsi: 'Skripsi S1 (Standar 5 Bab Akademik)',
    makalah: 'Makalah / Essay Ilmiah Pendek',
    proposal: 'Proposal Penelitian (Bab I - III)',
    tesis: 'Tesis S2 (Analisis Komprehensif Mendalam)'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 2. Validasi: Minimal 50 Karakter pada Judul Penelitian
    if (inputText.trim().length < 50) {
      toast.error('Validasi Gagal', {
        description: 'Usulan judul penelitian minimal harus 50 karakter agar kerangka riset terarah.'
      })
      return
    }

    // 3. Flow: Ambil Prompt & Jalankan API
    const systemPrompt = PROMPTS.automaticOutline
    const formattedUserMessage = `[USULAN JUDUL PENELITIAN: ${inputText.trim()}] [JENIS DOKUMEN: ${docLabels[selectedOption]}] [KONTEKS/LATAR BELAKANG OPSIONAL: ${backgroundText.trim() || 'Tidak disediakan'}]`

    const result = await callAPI({
      systemPrompt,
      userMessage: formattedUserMessage
    })

    // 4. Flow: Simpan Ke Riwayat & Set Output
    if (result) {
      setOutput(result)
      saveToHistory({
        feature: 'automatic-outline',
        featureName: 'Automatic Outline',
        category: 'Riset & Struktur',
        input: `Judul: ${inputText.trim().substring(0, 100)}... (Jenis: ${selectedOption})`,
        output: result
      })
      toast.success('Kerangka Riset Selesai!', {
        description: 'Kerangka bab dan sub-bab akademik berhasil dibuat dan disimpan.'
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
            Automatic Outline
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
                Penyusun Kerangka Riset
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                Buatkan struktur bab dan sub-bab karya ilmiah Anda secara komprehensif berdasarkan usulan judul riset.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Judul Penelitian */}
                <div className="space-y-1.5">
                  <Label htmlFor="outline-title" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Judul Penelitian Akademik
                  </Label>
                  <Input 
                    id="outline-title"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Contoh: Pengaruh e-commerce terhadap pertumbuhan UMKM sektor kuliner di Jakarta Timur..."
                    className="rounded-lg border-border/40 bg-muted/10 text-xs h-9 focus-visible:ring-1 focus-visible:ring-primary"
                  />
                  <div className="flex justify-between items-center text-[9px] text-muted-foreground/80 font-medium px-0.5 mt-1">
                    <span>Minimal 50 karakter</span>
                    <span>{inputText.length} Karakter</span>
                  </div>
                </div>

                {/* Jenis Dokumen */}
                <div className="space-y-1.5">
                  <Label htmlFor="doc-type" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Jenis Karya Ilmiah
                  </Label>
                  <Select value={selectedOption} onValueChange={setSelectedOption}>
                    <SelectTrigger id="doc-type" className="rounded-lg border-border/40 bg-muted/10 text-xs h-9">
                      <SelectValue placeholder="Pilih jenis dokumen..." />
                    </SelectTrigger>
                    <SelectContent className="border-border/40">
                      <SelectItem value="skripsi">Skripsi S1</SelectItem>
                      <SelectItem value="makalah">Makalah / Esai Ilmiah</SelectItem>
                      <SelectItem value="proposal">Proposal Penelitian</SelectItem>
                      <SelectItem value="tesis">Tesis S2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Latar Belakang (Opsional) */}
                <div className="space-y-1.5">
                  <Label htmlFor="outline-bg" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Latar Belakang / Rumusan Masalah (Opsional)
                  </Label>
                  <Textarea
                    id="outline-bg"
                    value={backgroundText}
                    onChange={(e) => setBackgroundText(e.target.value)}
                    placeholder="Masukkan beberapa poin penting atau draf latar belakang jika ada untuk memperkaya kedalaman outline..."
                    className="min-h-[100px] rounded-lg border-border/40 bg-muted/5 text-[12px] leading-relaxed p-3 focus-visible:ring-primary focus-visible:ring-1"
                  />
                </div>

                {/* Tombol Buat Kerangka */}
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
                      <span>Buat Kerangka</span>
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
            featureName="Automatic Outline"
            featureSlug="automatic-outline"
            isLoading={isLoading}
            emptyTitle="Hasil Outline Karya Ilmiah"
            emptyDescription="Ketikkan usulan judul penelitian Anda di panel kiri, kemudian klik tombol 'Buat Kerangka' untuk melihat struktur bab demi bab dan pokok bahasan rinci hasil susunan AI."
          />
        </div>

      </div>

    </div>
  )
}
