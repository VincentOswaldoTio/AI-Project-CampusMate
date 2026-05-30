import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Mail } from 'lucide-react'
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

export default function DosenEmailDrafter() {
  const { callAPI, isLoading } = useOpenRouter()
  const { saveToHistory } = useHistory()

  // 1. State Kriteria Misi
  const [inputText, setInputText] = useState('') // Konteks dan tujuan pesan
  const [dosenName, setDosenName] = useState('') // Nama dan gelar dosen
  const [type, setType] = useState('Email') // Email | Pesan WhatsApp | Surat Resmi
  const [output, setOutput] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 2. Validasi: Nama dosen wajib diisi
    if (dosenName.trim().length < 3) {
      toast.error('Validasi Gagal', {
        description: 'Nama dan gelar dosen minimal harus 3 karakter untuk menyusun sapaan hormat yang tepat.'
      })
      return
    }

    // 3. Validasi: Konteks/Tujuan minimal 30 Karakter
    if (inputText.trim().length < 30) {
      toast.error('Validasi Gagal', {
        description: 'Konteks dan tujuan pesan minimal harus 30 karakter agar draf pesan sopan, etis, dan memuat urgensi Anda.'
      })
      return
    }

    // 4. Flow: Ambil Prompt & Jalankan API
    const systemPrompt = PROMPTS.dosenEmailDrafter
    const formattedUserMessage = `[JENIS PESAN: ${type}] [NAMA & GELAR DOSEN: ${dosenName.trim()}]\n\n[KONTEKS & TUJUAN KEPERLUAN MAHASISWA]:\n${inputText.trim()}`

    const result = await callAPI({
      systemPrompt,
      userMessage: formattedUserMessage
    })

    // 5. Flow: Simpan Ke Riwayat & Set Output
    if (result) {
      setOutput(result)
      saveToHistory({
        feature: 'dosen-email-drafter',
        featureName: 'Dosen Email Drafter',
        category: 'Produktivitas',
        input: `Email Dosen (${type} - ${dosenName.trim().substring(0, 30)}...): ${inputText.trim().substring(0, 50)}...`,
        output: result
      })
      toast.success('Pesan Dosen Berhasil Dibuat!', {
        description: `Draf pesan akademik untuk ${dosenName.trim().substring(0, 20)}... telah disimpan.`
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
            Dosen Email Drafter
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
                <Mail className="h-3.5 w-3.5 text-primary" />
                Korespondensi Etis Dosen
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                Susun draf surel, surat resmi birokrasi kampus, atau pesan WhatsApp instan kepada dosen pembimbing/wali dengan nada yang sopan, etis, dan profesional.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Select Jenis Pesan */}
                <div className="space-y-1.5">
                  <Label htmlFor="message-type" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Format Pesan / Media
                  </Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger id="message-type" className="rounded-lg border-border/40 bg-muted/10 text-xs h-9">
                      <SelectValue placeholder="Pilih media..." />
                    </SelectTrigger>
                    <SelectContent className="border-border/40">
                      <SelectItem value="Email">Email Resmi Akademik</SelectItem>
                      <SelectItem value="Pesan WhatsApp">Pesan Singkat (WhatsApp)</SelectItem>
                      <SelectItem value="Surat Resmi">Surat Resmi Kampus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Input Nama & Gelar Dosen */}
                <div className="space-y-1.5">
                  <Label htmlFor="lecturer-name" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Nama &amp; Gelar Lengkap Dosen
                  </Label>
                  <Input 
                    id="lecturer-name"
                    value={dosenName}
                    onChange={(e) => setDosenName(e.target.value)}
                    placeholder="Contoh: Prof. Dr. Ir. Budi Santoso, M.T."
                    className="rounded-lg border-border/40 bg-muted/10 text-xs h-9 focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>

                {/* Textarea Konteks Pesan */}
                <div className="space-y-1.5">
                  <Label htmlFor="message-context" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Konteks &amp; Keperluan Hubungi Dosen
                  </Label>
                  <Textarea
                    id="message-context"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Contoh: Ingin memohon bimbingan bab 3 skripsi minggu depan karena ada data kuisioner baru yang sudah diolah..."
                    className="min-h-[140px] rounded-lg border-border/40 bg-muted/5 text-[12px] leading-relaxed p-3 focus-visible:ring-primary focus-visible:ring-1"
                  />
                  <div className="flex justify-between items-center text-[9px] text-muted-foreground/80 font-medium px-0.5 mt-1">
                    <span>Minimal 30 karakter</span>
                    <span>{inputText.length} Karakter</span>
                  </div>
                </div>

                {/* Tombol Buat Pesan */}
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
                      <span>Buat Pesan</span>
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
            featureName="Dosen Email Drafter"
            featureSlug="dosen-email-drafter"
            isLoading={isLoading}
            emptyTitle="Hasil Draf Surat / Email Dosen"
            emptyDescription="Ketik nama dosen wali/pembimbing Anda di sebelah kiri, jelaskan apa kebutuhan atau keperluan akademik Anda secara ringkas, lalu klik 'Buat Pesan' untuk menyusun draft email dwibahasa orisinal etis secara instan."
          />
        </div>

      </div>

    </div>
  )
}
