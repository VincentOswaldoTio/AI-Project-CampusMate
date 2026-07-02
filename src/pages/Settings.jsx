import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Settings as SettingsIcon, 
  Key, 
  Cpu, 
  Paintbrush, 
  CheckCircle, 
  AlertCircle,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Database,
  HelpCircle,
  Save,
  Wifi
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useApiStore } from '@/store/apiStore'
import { useHistory } from '@/hooks/useHistory'
import { testConnection } from '@/lib/openrouter'
import { toast } from 'sonner'

function Settings() {
  const { apiKey, model, isConnected, theme, setApiKey, setModel, setConnected, toggleTheme } = useApiStore()
  const { items, clearAll } = useHistory()

  // State lokal untuk form API Key
  const [localApiKey, setLocalApiKey] = useState(apiKey)
  const [showKey, setShowKey] = useState(false)
  const [testLoading, setTestLoading] = useState(false)
  
  // State untuk menyimpan hasil uji koneksi
  const [testResult, setTestResult] = useState(null) // { success: boolean, model?: string, latency?: number, error?: string }

  const handleApiKeyChange = (e) => {
    setLocalApiKey(e.target.value)
  }

  const handleSaveApiKey = () => {
    setApiKey(localApiKey)
    toast.success("API Key berhasil disimpan!", {
      description: "Pengaturan API Key baru telah diterapkan secara global."
    })
  }

  const handleModelChange = (val) => {
    setModel(val)
    toast.success("Model AI berhasil diperbarui!", {
      description: `Target model aktif: ${val}`
    })
  }

  const handleTestConnection = async () => {
    if (!localApiKey) {
      toast.error("Gagal melakukan tes: API key kosong!", {
        description: "Masukkan OpenRouter API key Anda terlebih dahulu."
      })
      setTestResult({
        success: false,
        error: "API key kosong. Silakan ketik API key Anda sebelum menguji."
      })
      setConnected(false)
      return
    }

    setTestLoading(true)
    setTestResult(null)
    toast.info("Menguji koneksi ke OpenRouter API...")

    const result = await testConnection(localApiKey)
    setTestLoading(false)

    if (result.success) {
      setConnected(true)
      setTestResult({
        success: true,
        model: result.model,
        latency: result.latency
      })
      toast.success("Koneksi ke OpenRouter Berhasil!")
    } else {
      setConnected(false)
      setTestResult({
        success: false,
        error: result.error || "Gagal melakukan verifikasi API Key. Periksa kembali jaringan internet atau validitas API Key."
      })
      toast.error("Koneksi ke OpenRouter Gagal!")
    }
  }

  const handleThemeToggle = () => {
    toggleTheme()
    toast.success(`Tema diubah ke mode: ${theme === 'light' ? 'Gelap' : 'Terang'}`)
  }

  const handleClearHistory = () => {
    clearAll()
    toast.success("Semua riwayat berhasil dihapus!", {
      description: "Data lokal Anda telah bersih."
    })
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Header Halaman */}
      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-border/40 hover:bg-muted transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-extrabold tracking-tight text-foreground">Pengaturan</h1>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Konfigurasi API, model AI, preferensi tampilan, dan pengelolaan data lokal Anda.
          </p>
        </div>
      </div>

      <Separator className="border-border/30" />

      <div className="space-y-5">
        
        {/* SECTION 1: API Key OpenRouter */}
        <Card className="bg-gradient-to-br from-card to-muted/5 border-border/40 rounded-xl shadow-xs overflow-hidden">
          <CardHeader className="p-4 border-b border-border/20 bg-muted/5">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Key className="h-4 w-4" />
              <span>API Key OpenRouter</span>
            </div>
            <CardDescription className="text-[11px] text-muted-foreground leading-normal mt-0.5">
              Masukkan kunci API OpenRouter Anda. Kunci ini hanya disimpan secara lokal di browser Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="api-key" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                Kunci API
              </Label>
              <div className="relative flex items-center">
                <Input 
                  id="api-key"
                  type={showKey ? "text" : "password"} 
                  value={localApiKey} 
                  onChange={handleApiKeyChange}
                  placeholder="sk-or-v1-..." 
                  className="pr-10 rounded-lg border-border/40 bg-muted/10 font-mono text-xs h-9 focus-visible:ring-1 focus-visible:ring-primary"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-1 text-muted-foreground hover:text-foreground h-7 w-7 rounded-md"
                >
                  {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>

            {/* Tombol Aksi API Key (Height 36px / h-9) */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Button 
                onClick={handleTestConnection} 
                disabled={testLoading}
                variant="outline"
                className="h-9 rounded-lg border-border/40 hover:bg-muted text-xs font-semibold px-4"
              >
                <Wifi className="h-3.5 w-3.5 mr-1" />
                {testLoading ? 'Menguji...' : 'Test Koneksi'}
              </Button>
              <Button 
                onClick={handleSaveApiKey}
                className="h-9 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm shadow-blue-500/10 rounded-lg text-xs font-bold uppercase tracking-wider px-4 transition-all duration-150 active:scale-[0.98]"
              >
                <Save className="h-3.5 w-3.5 mr-1" />
                Simpan
              </Button>
            </div>

            {/* Card Hasil Tes Koneksi */}
            {testResult && (
              <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition-all ${
                testResult.success 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300' 
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-300'
              }`}>
                <div className="font-bold flex items-center gap-1.5 text-[11px]">
                  {testResult.success ? (
                    <>
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Berhasil Terhubung</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
                      <span>Koneksi Gagal</span>
                    </>
                  )}
                </div>
                {testResult.success ? (
                  <div className="space-y-0.5 font-medium leading-relaxed">
                    <div><span className="opacity-75">Model Digunakan:</span> {testResult.model}</div>
                    <div><span className="opacity-75">Latensi:</span> {testResult.latency} ms</div>
                  </div>
                ) : (
                  <div className="font-medium leading-relaxed">
                    <span className="opacity-75">Kesalahan:</span> {testResult.error}
                  </div>
                )}
              </div>
            )}

            {/* Link Bantuan Mendapatkan API Key */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-0.5">
              <HelpCircle className="h-3.5 w-3.5 text-primary" />
              <a 
                href="https://openrouter.ai/keys" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:underline font-semibold text-primary"
              >
                Cara mendapatkan API key gratis &rarr;
              </a>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: Preferensi */}
        <Card className="bg-gradient-to-br from-card to-muted/5 border-border/40 rounded-xl shadow-xs overflow-hidden">
          <CardHeader className="p-4 border-b border-border/20 bg-muted/5">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Paintbrush className="h-4 w-4" />
              <span>Preferensi</span>
            </div>
            <CardDescription className="text-[11px] text-muted-foreground leading-normal mt-0.5">
              Sesuaikan tampilan antarmuka dan preferensi model kecerdasan buatan Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {/* Mode Gelap */}
            <div className="flex items-center justify-between p-3.5 bg-muted/10 rounded-xl border border-border/30 gap-4">
              <div>
                <span className="font-bold text-xs block text-foreground">Mode Tampilan</span>
                <span className="text-[11px] text-muted-foreground leading-normal mt-0.5">
                  Ganti tema antarmuka antara mode terang dan mode gelap.
                </span>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleThemeToggle}
                className="h-8 rounded-lg border-border/40 hover:bg-muted text-[11px] font-semibold transition-all px-3 py-1 flex items-center gap-1.5"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-amber-600 dark:text-amber-400">Mode Terang</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-indigo-600">Mode Gelap</span>
                  </>
                )}
              </Button>
            </div>

            {/* Pemilihan Model AI */}
            <div className="space-y-1.5">
              <Label htmlFor="model-select" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                Pilih Model AI
              </Label>
              <Select value={model} onValueChange={handleModelChange}>
                <SelectTrigger id="model-select" className="rounded-lg border-border/40 bg-muted/10 text-xs h-9">
                  <SelectValue placeholder="Pilih model AI..." />
                </SelectTrigger>
                <SelectContent className="border-border/40">
                  <SelectItem value="openrouter/auto">Auto (Otomatis memilih model optimal)</SelectItem>
                  <SelectItem value="google/gemini-2.5-flash:free">Gemini 2.5 Flash Free (Gratis, 1M Context - Sangat Direkomendasikan)</SelectItem>
                  <SelectItem value="deepseek/deepseek-r1:free">DeepSeek R1 Reasoning Free (Gratis, Penalaran Logis Terpopuler)</SelectItem>
                  <SelectItem value="meta-llama/llama-3.3-70b-instruct:free">Llama 3.3 70B Free (Gratis, Model Besar &amp; Akurat)</SelectItem>
                  <SelectItem value="qwen/qwen-2.5-coder-32b-instruct:free">Qwen 2.5 Coder 32B Free (Gratis, Handal untuk Logika &amp; Kode)</SelectItem>
                  <SelectItem value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet (Berbayar, Kualitas Terbaik untuk Karya Ilmiah)</SelectItem>
                  <SelectItem value="anthropic/claude-3.5-haiku">Claude 3.5 Haiku (Berbayar, Sangat Cepat &amp; Responsif)</SelectItem>
                  <SelectItem value="deepseek/deepseek-chat">DeepSeek V3 / Chat (Berbayar Sangat Murah &amp; Cepat)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground leading-relaxed pl-0.5">
                Rekomendasi menggunakan <strong>Gemini 2.5 Flash Free</strong> untuk ringkasan jurnal panjang karena memiliki konteks 1 juta token, atau <strong>Auto</strong> agar sistem mencocokkan secara otomatis.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 3: Data */}
        <Card className="bg-gradient-to-br from-card to-muted/5 border-border/40 rounded-xl shadow-xs overflow-hidden">
          <CardHeader className="p-4 border-b border-border/20 bg-muted/5">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Database className="h-4 w-4" />
              <span>Data Lokal</span>
            </div>
            <CardDescription className="text-[11px] text-muted-foreground leading-normal mt-0.5">
              Kelola data riwayat hasil pengerjaan akademis Anda yang tersimpan di memori lokal.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-muted/10 rounded-xl border border-border/30 gap-4">
              <div>
                <span className="font-bold text-xs block text-foreground">Riwayat Pengerjaan</span>
                <span className="text-[11px] text-muted-foreground leading-normal mt-0.5">
                  Saat ini terdapat <strong>{items.length} riwayat</strong> tersimpan di database lokal.
                </span>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="h-9 rounded-lg text-xs font-semibold px-4 hover:bg-rose-600"
                    disabled={items.length === 0}
                  >
                    Hapus Semua Riwayat
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-xl border-border bg-card">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground">Apakah Anda yakin?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground text-xs leading-relaxed">
                      Tindakan ini tidak dapat dibatalkan. Seluruh riwayat hasil pengerjaan fitur akademis Anda akan dihapus secara permanen dari penyimpanan lokal perangkat ini.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-lg border-border hover:bg-muted text-xs">
                      Batal
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleClearHistory} 
                      className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs"
                    >
                      Hapus Permanen
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default Settings
