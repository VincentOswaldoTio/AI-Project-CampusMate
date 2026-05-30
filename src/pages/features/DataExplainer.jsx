import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
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

export default function DataExplainer() {
  const { callAPI, isLoading } = useOpenRouter()
  const { saveToHistory } = useHistory()

  // 1. State Kriteria Misi
  const [inputText, setInputText] = useState('') // Data mentah (angka, tabel, statistik)
  const [context, setContext] = useState('') // Konteks variabel (opsional)
  const [section, setSection] = useState('hasil') // hasil | pembahasan | kesimpulan
  const [output, setOutput] = useState(null)

  const sectionLabels = {
    hasil: 'Bab Hasil Penelitian (Naratif Deskriptif Data)',
    pembahasan: 'Bab Pembahasan (Analisis Implikasi & Hubungan Teori)',
    kesimpulan: 'Bab Kesimpulan (Sintesis Hasil Akhir & Refleksi)'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 2. Validasi: Minimal 50 Karakter
    if (inputText.trim().length < 50) {
      toast.error('Validasi Gagal', {
        description: 'Input data mentah penelitian minimal harus 50 karakter agar AI memiliki data yang cukup untuk diinterpretasikan secara komprehensif.'
      })
      return
    }

    // 3. Flow: Ambil Prompt & Jalankan API
    const systemPrompt = PROMPTS.dataExplainer
    const formattedUserMessage = `[BAGIAN BAB TARGET: ${sectionLabels[section]}]` + 
      (context.trim() ? ` [KONTEKS VARIABEL PENELITIAN: ${context.trim()}]` : '') + 
      `\n\n[DATA MENTAH/HASIL STATISTIK]:\n${inputText.trim()}`

    const result = await callAPI({
      systemPrompt,
      userMessage: formattedUserMessage
    })

    // 4. Flow: Simpan Ke Riwayat & Set Output
    if (result) {
      setOutput(result)
      saveToHistory({
        feature: 'data-explainer',
        featureName: 'Data Explainer',
        category: 'Penulisan Ilmiah',
        input: `Interpretasi Data (${section}): ${inputText.trim().substring(0, 100)}...`,
        output: result
      })
      toast.success('Data Berhasil Dinarasikan!', {
        description: 'Deskripsi naratif hasil data riset Anda telah disimpan ke riwayat.'
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
            Data Explainer
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
                <BarChart3 className="h-3.5 w-3.5 text-primary" />
                Naratif Interpretasi Data
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                Konversikan angka, tabel mentah, persentase kuisioner, atau output olah data SPSS/R menjadi narasi akademik mengalir sesuai standar bab pelaporan karya ilmiah.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Select Bagian Bab */}
                <div className="space-y-1.5">
                  <Label htmlFor="target-section" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Target Bab / Bagian
                  </Label>
                  <Select value={section} onValueChange={setSection}>
                    <SelectTrigger id="target-section" className="rounded-lg border-border/40 bg-muted/10 text-xs h-9">
                      <SelectValue placeholder="Pilih target bab..." />
                    </SelectTrigger>
                    <SelectContent className="border-border/40">
                      <SelectItem value="hasil">Bab Hasil (Deskripsi &amp; Visual)</SelectItem>
                      <SelectItem value="pembahasan">Bab Pembahasan (Analisis &amp; Teori)</SelectItem>
                      <SelectItem value="kesimpulan">Bab Kesimpulan (Ringkasan Akhir)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Input Konteks Variabel (Opsional) */}
                <div className="space-y-1.5">
                  <Label htmlFor="variable-context" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Konteks Variabel Penelitian <span className="text-muted-foreground/60">(Opsional)</span>
                  </Label>
                  <Input 
                    id="variable-context"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Contoh: Variabel X = Kepuasan Kerja, Variabel Y = Produktivitas Karyawan..."
                    className="rounded-lg border-border/40 bg-muted/10 text-xs h-9 focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>

                {/* Textarea Data Mentah */}
                <div className="space-y-1.5">
                  <Label htmlFor="raw-data" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Data Mentah / Hasil Statistik
                  </Label>
                  <Textarea
                    id="raw-data"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Masukkan data angka, ringkasan persentase kuisioner, atau data SPSS/tabel mentah di sini..."
                    className="min-h-[160px] rounded-lg border-border/40 bg-muted/5 text-[12px] leading-relaxed p-3 focus-visible:ring-primary focus-visible:ring-1"
                  />
                  <div className="flex justify-between items-center text-[9px] text-muted-foreground/80 font-medium px-0.5 mt-1">
                    <span>Minimal 50 karakter</span>
                    <span>{inputText.length} Karakter</span>
                  </div>
                </div>

                {/* Tombol Narasikan Data */}
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
                      <span>Narasikan Data</span>
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
            featureName="Data Explainer"
            featureSlug="data-explainer"
            isLoading={isLoading}
            emptyTitle="Hasil Interpretasi &amp; Narasi Data"
            emptyDescription="Paste data statistik, tabel, atau hasil perhitungan numerik di form sebelah kiri, lengkapi konteks opsionalnya, lalu klik 'Narasikan Data' untuk melihat analisis teoretis dan narasi akademik ilmiah di panel ini."
          />
        </div>

      </div>

    </div>
  )
}
