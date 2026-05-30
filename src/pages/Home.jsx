import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Cpu, Layers, Sparkles } from 'lucide-react'
import { useApiStore } from '@/store/apiStore'
import { useHistory } from '@/hooks/useHistory'
import FeatureCard from '@/components/shared/FeatureCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

// Daftar 7 kategori utama
const CATEGORIES = [
  'Manipulasi Teks',
  'Riset & Struktur',
  'Penulisan Ilmiah',
  'Belajar & Studi',
  'Produktivitas',
  'Kesejahteraan',
  'Manajemen Akademik'
]

// 20 fitur akademik lengkap
const FEATURES = [
  // Manipulasi Teks
  {
    title: 'Smart Summarizer',
    description: 'Ringkas jurnal ilmiah panjang dan dokumen akademik secara cerdas dalam hitungan detik.',
    category: 'Manipulasi Teks',
    path: 'smart-summarizer'
  },
  {
    title: 'Academic Paraphraser',
    description: 'Ubah tulisan Anda menjadi versi akademik yang orisinal, formal, dan bebas plagiarisme.',
    category: 'Manipulasi Teks',
    path: 'academic-paraphraser'
  },
  {
    title: 'Grammar & PUEBI Fixer',
    description: 'Perbaiki tata bahasa dan ejaan sesuai standar PUEBI dan tata bahasa Indonesia.',
    category: 'Manipulasi Teks',
    path: 'grammar-fixer'
  },
  {
    title: 'Tone Transformer',
    description: 'Ubah nada dan gaya tulisan Anda sesuai dengan target register akademik yang diinginkan.',
    category: 'Manipulasi Teks',
    path: 'tone-transformer'
  },
  // Riset & Struktur
  {
    title: 'Research Idea Generator',
    description: 'Temukan ide penelitian segar, orisinal, dan relevan berdasarkan topik ketertarikan Anda.',
    category: 'Riset & Struktur',
    path: 'research-idea-generator'
  },
  {
    title: 'Automatic Outline',
    description: 'Buatkan kerangka (outline) terstruktur bab demi bab untuk skripsi, tesis, atau jurnal ilmiah.',
    category: 'Riset & Struktur',
    path: 'automatic-outline'
  },
  {
    title: 'Literature Review Helper',
    description: 'Bantu menganalisis, menyintesis, dan merangkum berbagai sumber pustaka atau jurnal ilmiah.',
    category: 'Riset & Struktur',
    path: 'literature-review-helper'
  },
  {
    title: 'Argument Builder',
    description: 'Bangun argumen ilmiah yang kuat, logis, dan terstruktur menggunakan metode Toulmin.',
    category: 'Riset & Struktur',
    path: 'argument-builder'
  },
  // Penulisan Ilmiah
  {
    title: 'Abstract Translator',
    description: 'Terjemahkan abstrak akademik (Indonesia-Inggris) dengan terminologi ilmiah yang tepat.',
    category: 'Penulisan Ilmiah',
    path: 'abstract-translator'
  },
  {
    title: 'Citation Formatter',
    description: 'Format sitasi dan daftar pustaka secara otomatis ke gaya APA 7th, IEEE, Harvard, dll.',
    category: 'Penulisan Ilmiah',
    path: 'citation-formatter'
  },
  {
    title: 'Data Explainer',
    description: 'Interpretasikan data, tabel, grafik, atau hasil analisis statistik ke dalam narasi ilmiah.',
    category: 'Penulisan Ilmiah',
    path: 'data-explainer'
  },
  {
    title: 'Reference Keywords',
    description: 'Dapatkan kombinasi kata kunci dan strategi pencarian literatur di database jurnal ilmiah.',
    category: 'Penulisan Ilmiah',
    path: 'reference-keywords'
  },
  // Belajar & Studi
  {
    title: 'Concept Simplifier',
    description: 'Jelaskan konsep akademik yang rumit dengan analogi sederhana dan contoh nyata.',
    category: 'Belajar & Studi',
    path: 'concept-simplifier'
  },
  {
    title: 'Exam Prep Questioner',
    description: 'Buat soal latihan mandiri beserta kunci jawaban dan pembahasan untuk persiapan ujian.',
    category: 'Belajar & Studi',
    path: 'exam-prep-questioner'
  },
  // Produktivitas
  {
    title: 'Dosen Email Drafter',
    description: 'Draft email formal kepada dosen dengan bahasa yang sopan, santun, dan profesional.',
    category: 'Produktivitas',
    path: 'dosen-email-drafter'
  },
  {
    title: 'Action Item Extractor',
    description: 'Ekstrak poin-poin tindakan penting dan tugas dari catatan kuliah atau notulensi rapat.',
    category: 'Produktivitas',
    path: 'action-item-extractor'
  },
  {
    title: 'Presentation Script',
    description: 'Buat naskah presentasi dan poin visual per slide untuk seminar atau sidang.',
    category: 'Produktivitas',
    path: 'presentation-script'
  },
  // Kesejahteraan
  {
    title: 'Motivation & Wellness',
    description: 'Dapatkan saran kesejahteraan, dukungan motivasi, dan tips menjaga kesehatan mental akademis.',
    category: 'Kesejahteraan',
    path: 'motivation-wellness'
  },
  // Manajemen Akademik
  {
    title: 'Thesis Progress Tracker',
    description: 'Rencanakan, lacak, dan kelola target mingguan skripsi atau tesis Anda agar selesai tepat waktu.',
    category: 'Manajemen Akademik',
    path: 'thesis-progress-tracker'
  },
  {
    title: 'Study Schedule Generator',
    description: 'Buat jadwal belajar mingguan yang personal menggunakan teknik Pomodoro dan Spaced Repetition.',
    category: 'Manajemen Akademik',
    path: 'study-schedule-generator'
  }
]

function Home() {
  const { apiKey } = useApiStore()
  const { items, totalUsed } = useHistory()
  const [searchQuery, setSearchQuery] = useState('')

  // Menentukan ucapan salam berdasarkan waktu lokal mahasiswa
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 4 && hour < 11) return 'Selamat Pagi'
    if (hour >= 11 && hour < 15) return 'Selamat Siang'
    if (hour >= 15 && hour < 18.5) return 'Selamat Sore'
    return 'Selamat Malam'
  }

  // Filter pencarian interaktif
  const filteredFeatures = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return FEATURES
    return FEATURES.filter((f) => 
      f.title.toLowerCase().includes(query) ||
      f.description.toLowerCase().includes(query) ||
      f.category.toLowerCase().includes(query)
    )
  }, [searchQuery])

  // Cek apakah sedang mencari
  const isSearching = searchQuery.trim() !== ''

  return (
    <div className="space-y-6">
      
      {/* Premium Glassmorphic Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-primary/5 via-card/50 to-muted/20 p-6 md:p-8 shadow-xs transition-all duration-300">
        {/* Soft colorful glowing backgrounds */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider select-none border border-primary/20">
            <Cpu className="h-3 w-3 animate-spin" style={{ animationDuration: '6s' }} />
            CampusMate AI Workspace
          </div>

          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
            {getGreeting()}, <span className="bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">Pejuang Akademik!</span> ✨
          </h1>
          
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-xl">
            Selamat datang di hub produktivitas kuliah Anda. Cari dan buka 20 alat AI khusus untuk mempercepat penulisan skripsi, meriset referensi, atau merapikan draf tugas secara instan.
          </p>

          {/* Search bar & statistics */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Cari alat AI (misal: 'skripsi', 'penerjemah', 'email')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 rounded-xl border border-border/40 bg-muted/10 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background/80 placeholder:text-muted-foreground/40 transition-all text-foreground"
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground/50">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.636z" />
              </svg>
            </div>
            
            <div className="flex items-center justify-between sm:justify-start gap-4 px-4 h-9 rounded-xl border border-border/30 bg-card/60 text-xs shadow-2xs">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-primary tabular-nums">{totalUsed}</span>
                <span className="text-muted-foreground text-[9px] uppercase font-bold tracking-wider">Aksi</span>
              </div>
              <div className="h-3 w-px bg-border/40" />
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-foreground tabular-nums">{items.length}</span>
                <span className="text-muted-foreground text-[9px] uppercase font-bold tracking-wider">Riwayat</span>
              </div>
              <div className="h-3 w-px bg-border/40" />
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-foreground tabular-nums">{items.filter(i => i.favorite).length}</span>
                <span className="text-muted-foreground text-[9px] uppercase font-bold tracking-wider">Favorit</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Warning API Key belum diset */}
      {!apiKey && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-amber-500/10 border border-amber-500/25 rounded-xl text-amber-800 dark:text-amber-300 text-sm gap-4 animate-pulse">
          <div className="flex items-start sm:items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <span className="font-semibold block sm:inline">Konfigurasi Diperlukan:</span>{' '}
              API Key OpenRouter belum diset. Beberapa fitur AI mungkin tidak akan bekerja.
            </div>
          </div>
          <Link 
            to="/settings" 
            className="flex items-center gap-1 font-semibold hover:underline text-amber-600 dark:text-amber-400 flex-shrink-0 self-end sm:self-auto"
          >
            Atur API Key
            <span>&rarr;</span>
          </Link>
        </div>
      )}

      {/* RENDER FEATURE GRID */}
      {isSearching ? (
        /* Skenario A: Mode Pencarian Aktif */
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-border/40 pb-2">
            <h2 className="text-xs font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Hasil Pencarian Untuk "{searchQuery}"
            </h2>
            <span className="text-[10px] text-muted-foreground font-bold bg-muted px-2 py-0.5 rounded-md">
              {filteredFeatures.length} Ditemukan
            </span>
          </div>

          {filteredFeatures.length === 0 ? (
            <Card className="border border-dashed border-border/40 bg-muted/5 text-center p-12 rounded-2xl">
              <CardContent className="p-4 flex flex-col items-center justify-center space-y-3">
                <div className="p-3 bg-muted rounded-full text-muted-foreground">
                  <Layers className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-foreground">Tidak Ada Alat yang Cocok</h3>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                    Kami tidak menemukan alat AI dengan nama atau kategori pencarian "{searchQuery}". Coba kata kunci lainnya.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="h-8 text-xs font-bold rounded-lg border-border/40"
                >
                  Bersihkan Pencarian
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFeatures.map((feature) => (
                <FeatureCard
                  key={feature.path}
                  title={feature.title}
                  description={feature.description}
                  category={feature.category}
                  path={feature.path}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Skenario B: Mode Default Grouped Kategori */
        <div className="space-y-10 pt-2">
          {CATEGORIES.map((category) => {
            const categoryFeatures = FEATURES.filter((f) => f.category === category)
            if (categoryFeatures.length === 0) return null

            return (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-2 border-b border-border/60 pb-2">
                  <h2 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    {category}
                  </h2>
                  <span className="text-[9px] text-muted-foreground font-bold bg-muted px-2 py-0.5 rounded-md">
                    {categoryFeatures.length} Alat
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryFeatures.map((feature) => (
                    <FeatureCard
                      key={feature.path}
                      title={feature.title}
                      description={feature.description}
                      category={feature.category}
                      path={feature.path}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Home
