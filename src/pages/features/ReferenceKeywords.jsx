import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useOpenRouter } from '@/hooks/useOpenRouter'
import { useHistory } from '@/hooks/useHistory'
import { PROMPTS } from '@/lib/prompts'
import OutputBox from '@/components/shared/OutputBox'
import { toast } from 'sonner'

export default function ReferenceKeywords() {
  const { callAPI, isLoading } = useOpenRouter()
  const { saveToHistory } = useHistory()

  // 1. State Kriteria Misi
  const [inputText, setInputText] = useState('')
  const [selectedDbs, setSelectedDbs] = useState(['Google Scholar', 'Scopus']) // Default terpilih
  const [output, setOutput] = useState(null)

  const availableDbs = ['Google Scholar', 'Scopus', 'Web of Science', 'DOAJ']

  const toggleDb = (db) => {
    if (selectedDbs.includes(db)) {
      setSelectedDbs(selectedDbs.filter(item => item !== db))
    } else {
      setSelectedDbs([...selectedDbs, db])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 2. Validasi: Minimal 50 Karakter
    if (inputText.trim().length < 50) {
      toast.error('Validasi Gagal', {
        description: 'Input topik penelitian minimal harus 50 karakter agar AI dapat mengidentifikasi variabel inti dan sinonim istilah akademik yang tepat.'
      })
      return
    }

    // 3. Validasi database harus ada yang dipilih
    if (selectedDbs.length === 0) {
      toast.error('Validasi Gagal', {
        description: 'Pilih minimal satu database akademik untuk mengonfigurasikan strategi pencarian (search string).'
      })
      return
    }

    // 4. Flow: Ambil Prompt & Jalankan API
    const systemPrompt = PROMPTS.referenceKeywords
    const formattedUserMessage = `[TOPIK PENELITIAN UTAMA: ${inputText.trim()}] [DATABASE AKADEMIK TARGET: ${selectedDbs.join(', ')}]`

    const result = await callAPI({
      systemPrompt,
      userMessage: formattedUserMessage
    })

    // 5. Flow: Simpan Ke Riwayat & Set Output
    if (result) {
      setOutput(result)
      saveToHistory({
        feature: 'reference-keywords',
        featureName: 'Reference Keywords',
        category: 'Penulisan Ilmiah',
        input: `Kata Kunci: ${inputText.trim().substring(0, 100)}... (DB: ${selectedDbs.join(', ')})`,
        output: result
      })
      toast.success('Kata Kunci Berhasil Dibuat!', {
        description: 'Strategi pencarian pencarian literatur lengkap telah disimpan ke riwayat.'
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
            Reference Keywords
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
                <Search className="h-3.5 w-3.5 text-primary" />
                Riset Kata Kunci Jurnal
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                Temukan variasi istilah akademik, padanan kata (sinonim) dalam dwibahasa, serta kueri boolean logic siap pakai untuk memperluas cakupan temuan referensi.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Input Topik Penelitian */}
                <div className="space-y-1.5">
                  <Label htmlFor="research-topic" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Topik Penelitian Utama
                  </Label>
                  <Input 
                    id="research-topic"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Contoh: Dampak kebijakan fiskal terhadap pertumbuhan UMKM pasca pandemi..."
                    className="rounded-lg border-border/40 bg-muted/10 text-xs h-9 focus-visible:ring-1 focus-visible:ring-primary"
                  />
                  <div className="flex justify-between items-center text-[9px] text-muted-foreground/80 font-medium px-0.5 mt-1">
                    <span>Minimal 50 karakter</span>
                    <span>{inputText.length} Karakter</span>
                  </div>
                </div>

                {/* Sleek Checkboxes for Databases */}
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Target Database Jurnal
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableDbs.map((db) => {
                      const isChecked = selectedDbs.includes(db)
                      return (
                        <div 
                          key={db}
                          onClick={() => toggleDb(db)}
                          className={`flex items-center gap-2.5 p-2 bg-muted/5 border rounded-lg hover:bg-muted/10 cursor-pointer select-none transition-all duration-150 ${
                            isChecked 
                              ? 'border-primary/50 bg-primary/5' 
                              : 'border-border/40'
                          }`}
                        >
                          <div className={`h-4 w-4 rounded flex items-center justify-center border transition-all ${
                            isChecked 
                              ? 'bg-primary border-primary text-primary-foreground' 
                              : 'border-input bg-background/50'
                          }`}>
                            {isChecked && (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor" className="w-2.5 h-2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            )}
                          </div>
                          <span className="text-[11px] font-bold text-foreground">{db}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Tombol Generate Kata Kunci */}
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
                      <span>Generate Kata Kunci</span>
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
            featureName="Reference Keywords"
            featureSlug="reference-keywords"
            isLoading={isLoading}
            emptyTitle="Hasil Strategi Kata Kunci"
            emptyDescription="Ketik bidang ilmu atau tema riset utama Anda di sebelah kiri, centang target database akademik Anda, lalu klik 'Generate Kata Kunci' untuk merangkum daftar istilah pencarian kueri Boolean terpadu."
          />
        </div>

      </div>

    </div>
  )
}
