import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, HelpCircle, Eye, EyeOff } from 'lucide-react'
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

export default function ExamPrepQuestioner() {
  const { callAPI, isLoading } = useOpenRouter()
  const { saveToHistory } = useHistory()

  // 1. State Kriteria Misi
  const [inputText, setInputText] = useState('') // Materi kuliah
  const [subject, setSubject] = useState('') // Nama mata kuliah
  const [type, setType] = useState('Pilihan Ganda') // Pilihan Ganda | Esai | Benar/Salah | Campuran
  const [count, setCount] = useState('5') // 5 | 10 | 15 | 20
  const [output, setOutput] = useState(null)
  const [showAnswers, setShowAnswers] = useState(false) // Toggle kunci jawaban

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 2. Validasi: Nama mata kuliah harus diisi
    if (subject.trim().length < 3) {
      toast.error('Validasi Gagal', {
        description: 'Nama mata kuliah minimal harus 3 karakter.'
      })
      return
    }

    // 3. Validasi: Minimal 50 Karakter untuk materi kuliah
    if (inputText.trim().length < 50) {
      toast.error('Validasi Gagal', {
        description: 'Input materi/catatan kuliah minimal harus 50 karakter agar AI dapat merumuskan butir soal latihan yang relevan.'
      })
      return
    }

    // 4. Flow: Ambil Prompt & Jalankan API
    const basePrompt = PROMPTS.examPrepQuestioner
    const systemPrompt = `${basePrompt}\n\nPENTING:\nAnda wajib memisahkan bagian soal latihan dengan bagian kunci jawaban & pembahasan menggunakan pembatas baris berikut secara presisi:\n--- KUNCI JAWABAN & PEMBAHASAN ---\nSemua kunci jawaban dan penjelasan rasional wajib diletakkan di bawah pembatas tersebut.`
    
    const formattedUserMessage = `[MATA KULIAH: ${subject.trim()}] [JENIS SOAL: ${type}] [JUMLAH SOAL: ${count}]\n\n[DRAFT MATERI KULIAH]:\n${inputText.trim()}`

    const result = await callAPI({
      systemPrompt,
      userMessage: formattedUserMessage
    })

    // 5. Flow: Simpan Ke Riwayat & Set Output
    if (result) {
      setOutput(result)
      setShowAnswers(false) // Reset toggle ke sembunyikan jawaban baru
      saveToHistory({
        feature: 'exam-prep-questioner',
        featureName: 'Exam Prep Questioner',
        category: 'Belajar & Studi',
        input: `Soal Latihan (${subject}): ${type} - ${count} Soal`,
        output: result
      })
      toast.success('Soal Latihan Berhasil Dibuat!', {
        description: `Daftar latihan soal ${subject} telah disimpan ke riwayat.`
      })
    }
  }

  // Logika memisah output berdasarkan pembatas kunci jawaban
  const getDisplayedContent = () => {
    if (!output) return null
    if (showAnswers) return output

    const parts = output.split('--- KUNCI JAWABAN & PEMBAHASAN ---')
    return parts[0] + '\n\n*(Kunci jawaban dan pembahasan disembunyikan)*'
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
            Exam Prep Questioner
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
                <HelpCircle className="h-3.5 w-3.5 text-primary" />
                Pembuat Soal Latihan Mandiri
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                Konversikan silabus, rangkuman, atau catatan kuliah Anda menjadi kumpulan bank soal latihan interaktif untuk mempersiapkan ujian UTS/UAS.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Input Nama Mata Kuliah */}
                <div className="space-y-1.5">
                  <Label htmlFor="subject-name" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Nama Mata Kuliah
                  </Label>
                  <Input 
                    id="subject-name"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Contoh: Metodologi Penelitian, Aljabar Linear..."
                    className="rounded-lg border-border/40 bg-muted/10 text-xs h-9 focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>

                {/* Grid Dropdown Tipe & Jumlah Soal */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Jenis Soal (Select) */}
                  <div className="space-y-1.5">
                    <Label htmlFor="question-type" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                      Jenis Soal
                    </Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger id="question-type" className="rounded-lg border-border/40 bg-muted/10 text-xs h-9">
                        <SelectValue placeholder="Pilih..." />
                      </SelectTrigger>
                      <SelectContent className="border-border/40">
                        <SelectItem value="Pilihan Ganda">Pilihan Ganda</SelectItem>
                        <SelectItem value="Esai">Esai / Analisis</SelectItem>
                        <SelectItem value="Benar/Salah">Benar / Salah</SelectItem>
                        <SelectItem value="Campuran">Campuran</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Jumlah Soal (Select) */}
                  <div className="space-y-1.5">
                    <Label htmlFor="question-count" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                      Jumlah Soal
                    </Label>
                    <Select value={count} onValueChange={setCount}>
                      <SelectTrigger id="question-count" className="rounded-lg border-border/40 bg-muted/10 text-xs h-9">
                        <SelectValue placeholder="Pilih..." />
                      </SelectTrigger>
                      <SelectContent className="border-border/40">
                        <SelectItem value="5">5 Soal</SelectItem>
                        <SelectItem value="10">10 Soal</SelectItem>
                        <SelectItem value="15">15 Soal</SelectItem>
                        <SelectItem value="20">20 Soal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Textarea Materi Kuliah */}
                <div className="space-y-1.5">
                  <Label htmlFor="study-material" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Materi / Ringkasan Kuliah
                  </Label>
                  <Textarea
                    id="study-material"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Tempel catatan kuliah, draf bab presentasi, atau ringkasan silabus materi ujian di sini..."
                    className="min-h-[140px] rounded-lg border-border/40 bg-muted/5 text-[12px] leading-relaxed p-3 focus-visible:ring-primary focus-visible:ring-1"
                  />
                  <div className="flex justify-between items-center text-[9px] text-muted-foreground/80 font-medium px-0.5 mt-1">
                    <span>Minimal 50 karakter</span>
                    <span>{inputText.length} Karakter</span>
                  </div>
                </div>

                {/* Tombol Buat Soal Latihan */}
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
                      <span>Buat Soal Latihan</span>
                    </>
                  )}
                </Button>

              </form>
            </CardContent>
          </Card>
        </div>

        {/* PANEL OUTPUT */}
        <div className="lg:col-span-6 w-full space-y-4">
          
          {/* Header Toolbar Khusus Show/Hide Kunci Jawaban */}
          {output && (
            <div className="flex items-center justify-between p-3 bg-muted/15 border border-border/40 rounded-xl">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Kunci Jawaban &amp; Pembahasan</h4>
                <p className="text-[10px] text-muted-foreground">Tampilkan kunci beserta alasan logis jawaban soal ujian.</p>
              </div>
              <Button
                variant={showAnswers ? "destructive" : "outline"}
                size="sm"
                onClick={() => setShowAnswers(!showAnswers)}
                className="h-8 text-[10px] uppercase font-bold tracking-wider gap-1.5 cursor-pointer rounded-lg"
              >
                {showAnswers ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" />
                    <span>Sembunyikan Kunci</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" />
                    <span>Tampilkan Kunci</span>
                  </>
                )}
              </Button>
            </div>
          )}

          <OutputBox
            content={getDisplayedContent()}
            featureName="Exam Prep Questioner"
            featureSlug="exam-prep-questioner"
            isLoading={isLoading}
            emptyTitle="Hasil Kumpulan Soal UTS/UAS"
            emptyDescription="Paste ringkasan catatan kuliah Anda pada panel sebelah kiri, pilih tipe serta jumlah soal latihan yang diinginkan, kemudian klik 'Buat Soal Latihan' untuk melihat bank soal yang siap Anda kerjakan."
          />
        </div>

      </div>

    </div>
  )
}
