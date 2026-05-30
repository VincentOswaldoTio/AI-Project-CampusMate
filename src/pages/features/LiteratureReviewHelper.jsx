import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Send, BookMarked } from 'lucide-react'
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

export default function LiteratureReviewHelper() {
  const { callAPI, isLoading } = useOpenRouter()
  const { saveToHistory } = useHistory()

  // 1. State Kriteria Misi (inputText diakumulasikan saat submit)
  const [jurnal1, setJurnal1] = useState('')
  const [jurnal2, setJurnal2] = useState('')
  const [output, setOutput] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 2. Validasi: Keduanya harus diisi minimal 100 karakter
    if (jurnal1.trim().length < 100 || jurnal2.trim().length < 100) {
      toast.error('Validasi Gagal', {
        description: 'Kedua dokumen jurnal harus diisi minimal 100 karakter untuk mendapatkan analisis komparatif tinjauan pustaka.'
      })
      return
    }

    // 3. Flow: Ambil Prompt & Jalankan API
    const systemPrompt = PROMPTS.literatureReviewHelper
    const formattedUserMessage = `=== JURNAL 1 ===\n${jurnal1.trim()}\n\n=== JURNAL 2 ===\n${jurnal2.trim()}`

    const result = await callAPI({
      systemPrompt,
      userMessage: formattedUserMessage
    })

    // 4. Flow: Simpan Ke Riwayat & Set Output
    if (result) {
      setOutput(result)
      saveToHistory({
        feature: 'literature-review-helper',
        featureName: 'Literature Review Helper',
        category: 'Riset & Struktur',
        input: `Sintesis: Jurnal 1 (${jurnal1.trim().substring(0, 50)}...) vs Jurnal 2 (${jurnal2.trim().substring(0, 50)}...)`,
        output: result
      })
      toast.success('Analisis Literatur Selesai!', {
        description: 'Tinjauan pustaka komparatif berhasil digenerasi dan disimpan ke riwayat.'
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
            Literature Review Helper
          </h1>
          <Badge className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-none rounded-full">
            Riset &amp; Struktur
          </Badge>
        </div>
      </div>

      <Separator className="border-border/30" />

      {/* Grid Desktop Split-Pane (Kiri 40%, Kanan 60%) / Mobile Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 items-start">
        
        {/* PANEL FORM (Kiri) - Lebar disesuaikan agar 2 textarea side-by-side nyaman */}
        <div className="lg:col-span-4 lg:sticky lg:top-4 space-y-4">
          <Card className="bg-gradient-to-br from-card to-muted/5 border-border/40 rounded-xl shadow-xs overflow-hidden">
            <CardHeader className="p-4 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-widest">
                <BookMarked className="h-3.5 w-3.5 text-primary" />
                Komparasi Pustaka
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                Bandingkan abstrak, teori, temuan, atau kelemahan dari 2 jurnal untuk menyusun analisis literature review komparatif.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* 2 Textarea Side-by-Side di Desktop / Stack di Mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  
                  {/* Jurnal 1 */}
                  <div className="space-y-1.5">
                    <Label htmlFor="jurnal-1" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                      Jurnal 1 (Judul + Abstrak + Temuan)
                    </Label>
                    <Textarea
                      id="jurnal-1"
                      value={jurnal1}
                      onChange={(e) => setJurnal1(e.target.value)}
                      placeholder="Jurnal 1: Paste judul, abstrak, dan temuan utama jurnal pertama..."
                      className="min-h-[160px] rounded-lg border-border/40 bg-muted/5 text-[11px] leading-relaxed p-3 focus-visible:ring-primary focus-visible:ring-1"
                    />
                    <div className="text-[9px] text-muted-foreground font-medium text-right px-0.5">
                      {jurnal1.length} Karakter
                    </div>
                  </div>

                  {/* Jurnal 2 */}
                  <div className="space-y-1.5">
                    <Label htmlFor="jurnal-2" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                      Jurnal 2 (Judul + Abstrak + Temuan)
                    </Label>
                    <Textarea
                      id="jurnal-2"
                      value={jurnal2}
                      onChange={(e) => setJurnal2(e.target.value)}
                      placeholder="Jurnal 2: Paste judul, abstrak, dan temuan utama jurnal kedua..."
                      className="min-h-[160px] rounded-lg border-border/40 bg-muted/5 text-[11px] leading-relaxed p-3 focus-visible:ring-primary focus-visible:ring-1"
                    />
                    <div className="text-[9px] text-muted-foreground font-medium text-right px-0.5">
                      {jurnal2.length} Karakter
                    </div>
                  </div>

                </div>

                <div className="text-[9px] text-muted-foreground/80 font-medium px-0.5 text-center block">
                  Keduanya wajib diisi minimal 100 karakter.
                </div>

                {/* Tombol Bandingkan Jurnal */}
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
                      <span>Bandingkan Jurnal</span>
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
            featureName="Literature Review Helper"
            featureSlug="literature-review-helper"
            isLoading={isLoading}
            emptyTitle="Hasil Komparasi & Sintesis Jurnal"
            emptyDescription="Paste isi data Jurnal 1 dan Jurnal 2 pada kolom formulir di sebelah kiri, kemudian klik tombol 'Bandingkan Jurnal' untuk menganalisis kesamaan, perbedaan, kontradiksi, serta gap riset di antara keduanya."
          />
        </div>

      </div>

    </div>
  )
}
