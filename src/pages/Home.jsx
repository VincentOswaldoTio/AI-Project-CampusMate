import { Link } from 'react-router-dom'
import { AlertTriangle, Cpu, Layers } from 'lucide-react'
import { useApiStore } from '@/store/apiStore'
import { useHistory } from '@/hooks/useHistory'
import FeatureCard from '@/components/shared/FeatureCard'

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

  return (
    <div className="space-y-8">
      {/* Header Halaman Singkat */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Layers className="h-6 w-6 text-primary" />
            Alat Kerja Akademik
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Asisten akademik berbasis AI untuk mempermudah perkuliahan dan riset ilmiah Anda.
          </p>
        </div>

        {/* Stats Bar Tipis */}
        <div className="grid grid-cols-3 gap-2 border border-border bg-card p-3 rounded-xl text-center md:w-80 shadow-xs">
          <div>
            <div className="text-base font-bold text-primary">{totalUsed}</div>
            <div className="text-[10px] text-muted-foreground">Total Aksi</div>
          </div>
          <div className="border-x border-border">
            <div className="text-base font-bold text-foreground">{items.length}</div>
            <div className="text-[10px] text-muted-foreground">Riwayat</div>
          </div>
          <div>
            <div className="text-base font-bold text-foreground">{items.filter(i => i.favorite).length}</div>
            <div className="text-[10px] text-muted-foreground">Favorit</div>
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

      {/* Grid Fitur Dikelompokkan per Kategori */}
      <div className="space-y-10">
        {CATEGORIES.map((category) => {
          // Filter fitur untuk kategori ini
          const categoryFeatures = FEATURES.filter((f) => f.category === category)
          
          if (categoryFeatures.length === 0) return null

          return (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border/60 pb-2">
                <h2 className="text-base font-bold tracking-tight text-foreground/90 uppercase">
                  {category}
                </h2>
                <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-md">
                  {categoryFeatures.length} Alat
                </span>
              </div>

              {/* Grid 2-3 Kolom Responsif */}
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
    </div>
  )
}

export default Home
