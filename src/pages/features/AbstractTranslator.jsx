import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useOpenRouter } from '@/hooks/useOpenRouter'
import { useHistory } from '@/hooks/useHistory'
import { PROMPTS } from '@/lib/prompts'
import OutputBox from '@/components/shared/OutputBox'
import { toast } from 'sonner'

export default function AbstractTranslator() {
  const { callAPI, isLoading } = useOpenRouter()
  const { saveToHistory } = useHistory()

  // 1. State Kriteria Misi
  const [inputText, setInputText] = useState('')
  const [output, setOutput] = useState(null)
  const [direction, setDirection] = useState('id-en') // 'id-en' | 'en-id'

  const directionLabels = {
    'id-en': 'Bahasa Indonesia ke English (Academic English)',
    'en-id': 'English to Bahasa Indonesia (Akademik Baku)'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 2. Validasi: Minimal 50 Karakter
    if (inputText.trim().length < 50) {
      toast.error('Validasi Gagal', {
        description: 'Input teks abstrak minimal harus 50 karakter agar terjemahan terminologi akademik akurat.'
      })
      return
    }

    // 3. Flow: Ambil Prompt & Jalankan API
    const systemPrompt = PROMPTS.abstractTranslator
    const formattedUserMessage = `[ARAH TERJEMAHAN: ${directionLabels[direction]}]\n\n[TEKS ABSTRAK UTAMA]:\n${inputText.trim()}`

    const result = await callAPI({
      systemPrompt,
      userMessage: formattedUserMessage
    })

    // 4. Flow: Simpan Ke Riwayat & Set Output
    if (result) {
      setOutput(result)
      saveToHistory({
        feature: 'abstract-translator',
        featureName: 'Abstract Translator',
        category: 'Penulisan Ilmiah',
        input: `Terjemahan (${direction === 'id-en' ? 'ID → EN' : 'EN → ID'}): ${inputText.trim().substring(0, 100)}...`,
        output: result
      })
      toast.success('Abstrak Berhasil Diterjemahkan!', {
        description: 'Hasil terjemahan terminologi ilmiah presisi telah disimpan ke riwayat.'
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
            Abstract Translator
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
                <Languages className="h-3.5 w-3.5 text-primary" />
                Penerjemah Abstrak Akademik
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                Terjemahkan abstrak karya ilmiah Anda dengan mempertahankan diksi formal, akurasi struktural, dan glosarium ilmiah internasional.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Toggle Arah Bahasa */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Arah Bahasa Terjemahan
                  </Label>
                  <div className="flex bg-muted/20 border border-border/40 p-0.5 rounded-lg w-full">
                    <button
                      type="button"
                      onClick={() => setDirection('id-en')}
                      className={`flex-1 text-center py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                        direction === 'id-en' 
                          ? 'bg-primary text-primary-foreground shadow-xs' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Indo Ke Inggris
                    </button>
                    <button
                      type="button"
                      onClick={() => setDirection('en-id')}
                      className={`flex-1 text-center py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                        direction === 'en-id' 
                          ? 'bg-primary text-primary-foreground shadow-xs' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Inggris Ke Indo
                    </button>
                  </div>
                </div>

                {/* Textarea Abstrak */}
                <div className="space-y-1.5">
                  <Label htmlFor="abstract-text" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Teks Abstrak Asli
                  </Label>
                  <Textarea
                    id="abstract-text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Masukkan draf abstrak lengkap Anda di sini..."
                    className="min-h-[200px] rounded-lg border-border/40 bg-muted/5 text-[12px] leading-relaxed p-3 focus-visible:ring-primary focus-visible:ring-1"
                  />
                  <div className="flex justify-between items-center text-[9px] text-muted-foreground/80 font-medium px-0.5 mt-1">
                    <span>Minimal 50 karakter</span>
                    <span>{inputText.length} Karakter</span>
                  </div>
                </div>

                {/* Tombol Terjemahkan */}
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
                      <span>Terjemahkan</span>
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
            featureName="Abstract Translator"
            featureSlug="abstract-translator"
            isLoading={isLoading}
            emptyTitle="Hasil Terjemahan Akademik"
            emptyDescription="Masukkan teks draf abstrak Anda di kolom formulir sebelah kiri, kemudian tentukan arah terjemahan dan klik 'Terjemahkan' untuk merumuskan abstrak dwibahasa yang presisi dan profesional."
          />
        </div>

      </div>

    </div>
  )
}
