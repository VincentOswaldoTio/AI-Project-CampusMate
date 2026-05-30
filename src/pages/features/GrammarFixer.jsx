import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useOpenRouter } from '@/hooks/useOpenRouter'
import { useHistory } from '@/hooks/useHistory'
import { PROMPTS } from '@/lib/prompts'
import OutputBox from '@/components/shared/OutputBox'
import { toast } from 'sonner'

export default function GrammarFixer() {
  const { callAPI, isLoading } = useOpenRouter()
  const { saveToHistory } = useHistory()

  // 1. State Kriteria Misi
  const [inputText, setInputText] = useState('')
  const [output, setOutput] = useState(null)
  const [selectedOption, setSelectedOption] = useState('both') // 'both' | 'fix-only' | 'errors-list'

  // Map label mode koreksi untuk sistem prompt
  const modeLabels = {
    both: 'Koreksi Lengkap + Penjelasan Kaidah Terperinci',
    'fix-only': 'Koreksi Hasil Bersih Saja (Tanpa Penjelasan)',
    'errors-list': 'Daftar Kesalahan & Kaidah Saja (Tanpa Teks Utuh)'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 2. Validasi: Minimal 50 Karakter
    if (inputText.trim().length < 50) {
      toast.error('Validasi Gagal', {
        description: 'Input minimal harus 50 karakter agar pemeriksaan tata bahasa optimal.'
      })
      return
    }

    // 3. Flow: Ambil Prompt & Jalankan API
    const systemPrompt = PROMPTS.grammarFixer
    const formattedUserMessage = `[MODE KOREKSI TARGET: ${modeLabels[selectedOption]}]\n\n${inputText.trim()}`

    const result = await callAPI({
      systemPrompt,
      userMessage: formattedUserMessage
    })

    // 4. Flow: Simpan Ke Riwayat & Set Output
    if (result) {
      setOutput(result)
      saveToHistory({
        feature: 'grammar-fixer',
        featureName: 'Grammar & PUEBI Fixer',
        category: 'Manipulasi Teks',
        input: inputText.trim().length > 150 ? inputText.trim().substring(0, 150) + '...' : inputText.trim(),
        output: result
      })
      toast.success('Koreksi PUEBI Selesai!', {
        description: 'Teks Anda berhasil diperiksa dan disimpan ke riwayat.'
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
            Grammar &amp; PUEBI Fixer
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
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                Editor Ejaan &amp; PUEBI
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                Perbaiki tata bahasa, ejaan, tanda baca, huruf kapital, dan kesesuaian kaidah PUEBI pada tulisan ilmiah Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Opsi Mode Koreksi (RadioGroup) */}
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Pilih Mode Koreksi
                  </Label>
                  <RadioGroup 
                    value={selectedOption} 
                    onValueChange={setSelectedOption} 
                    className="grid grid-cols-1 gap-2"
                  >
                    <div className="flex items-center gap-2.5 p-2 bg-muted/5 border border-border/40 rounded-lg hover:bg-muted/10 cursor-pointer">
                      <RadioGroupItem value="both" id="mode-both" />
                      <Label htmlFor="mode-both" className="text-xs font-medium text-foreground cursor-pointer flex-1 py-1">
                        Koreksi + Penjelasan Kaidah
                      </Label>
                    </div>

                    <div className="flex items-center gap-2.5 p-2 bg-muted/5 border border-border/40 rounded-lg hover:bg-muted/10 cursor-pointer">
                      <RadioGroupItem value="fix-only" id="mode-fix-only" />
                      <Label htmlFor="mode-fix-only" className="text-xs font-medium text-foreground cursor-pointer flex-1 py-1">
                        Koreksi Hasil Bersih Saja
                      </Label>
                    </div>

                    <div className="flex items-center gap-2.5 p-2 bg-muted/5 border border-border/40 rounded-lg hover:bg-muted/10 cursor-pointer">
                      <RadioGroupItem value="errors-list" id="mode-errors-list" />
                      <Label htmlFor="mode-errors-list" className="text-xs font-medium text-foreground cursor-pointer flex-1 py-1">
                        Daftar Kesalahan &amp; Aturan
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Textarea Input Utama */}
                <div className="space-y-1.5">
                  <Label htmlFor="user-input" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Teks yang Ingin Diperiksa
                  </Label>
                  <Textarea
                    id="user-input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste teks yang ingin dikoreksi..."
                    className="min-h-[160px] rounded-lg border-border/40 bg-muted/5 text-[12px] leading-relaxed p-3 focus-visible:ring-primary focus-visible:ring-1"
                  />
                  <div className="flex justify-between items-center text-[9px] text-muted-foreground/80 font-medium px-0.5">
                    <span>Minimal 50 karakter</span>
                    <span>{inputText.length} Karakter</span>
                  </div>
                </div>

                {/* Tombol Submit (Koreksi) */}
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
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Koreksi</span>
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
            featureName="Grammar & PUEBI Fixer"
            featureSlug="grammar-fixer"
            isLoading={isLoading}
            emptyTitle="Hasil Pemeriksaan PUEBI"
            emptyDescription="Tempelkan tulisan ilmiah Anda yang ingin diteliti tanda baca dan kesesuaian bahasanya di panel formulir kiri, klik tombol 'Koreksi' untuk melihat hasil editor AI kami."
          />
        </div>

      </div>

    </div>
  )
}
