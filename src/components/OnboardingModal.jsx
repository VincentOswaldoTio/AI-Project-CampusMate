import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

const STORAGE_KEY = 'campusmate_onboarded'

const categories = [
  { icon: '📝', name: 'Manipulasi Teks', desc: 'Ringkas, parafrase, koreksi ejaan' },
  { icon: '🔬', name: 'Riset & Struktur', desc: 'Ide riset, outline, literature review' },
  { icon: '📄', name: 'Penulisan Ilmiah', desc: 'Terjemahan abstrak, sitasi, narasi data' },
  { icon: '📚', name: 'Belajar & Studi', desc: 'Penjelasan konsep, soal latihan' },
  { icon: '⚡', name: 'Produktivitas', desc: 'Email dosen, action items, naskah presentasi' },
  { icon: '💚', name: 'Kesejahteraan', desc: 'Dukungan motivasi & wellness' },
  { icon: '📊', name: 'Manajemen', desc: 'Tracker skripsi, jadwal belajar' },
]

const setupSteps = [
  { num: 1, text: 'Buka openrouter.ai/keys' },
  { num: 2, text: 'Buat akun atau login' },
  { num: 3, text: 'Buat API key baru (gratis)' },
  { num: 4, text: 'Paste di halaman Pengaturan CampusMate' },
]

function SlideWelcome() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 ring-1 ring-blue-500/20">
        <Sparkles className="h-6 w-6 text-blue-400" />
      </div>

      <h2 className="text-xl font-bold tracking-tight text-foreground">
        Selamat Datang di CampusMate AI
      </h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
        Asisten akademik berbasis AI untuk mahasiswa Indonesia.
      </p>

      <div className="mt-5 w-full space-y-1.5">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="flex items-start gap-2.5 rounded-lg px-3 py-1.5 text-left transition-colors hover:bg-muted/30"
          >
            <span className="mt-px text-sm leading-none">{cat.icon}</span>
            <div className="min-w-0">
              <span className="text-[13px] font-semibold text-foreground">{cat.name}</span>
              <span className="ml-1 text-[13px] text-muted-foreground">— {cat.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SlideSetup() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 ring-1 ring-amber-500/20">
        <span className="text-xl">🔑</span>
      </div>

      <h2 className="text-xl font-bold tracking-tight text-foreground">
        Langkah Cepat: Setup API Key
      </h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
        Ikuti langkah berikut untuk mengaktifkan fitur AI.
      </p>

      <div className="mt-5 w-full space-y-2">
        {setupSteps.map((step) => (
          <div
            key={step.num}
            className="flex items-center gap-3 rounded-lg border border-border/30 bg-muted/10 px-4 py-2.5 text-left"
          >
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-[11px] font-bold text-white">
              {step.num}
            </span>
            <span className="text-[13px] text-foreground">{step.text}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-2.5">
        <p className="text-[12px] leading-relaxed text-amber-700 dark:text-amber-200/80">
          Beberapa model tersedia gratis. Tanpa API key, fitur AI tidak akan bekerja.
        </p>
      </div>
    </div>
  )
}

function SlideReady({ onOpenSettings, onClose }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 ring-1 ring-emerald-500/20">
        <span className="text-xl">🚀</span>
      </div>

      <h2 className="text-xl font-bold tracking-tight text-foreground">
        Kamu Siap!
      </h2>
      <p className="mt-1.5 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
        20 fitur AI akademik menunggu. Mulai dengan mengatur API key di halaman Pengaturan.
      </p>

      <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
        <Button
          onClick={onOpenSettings}
          className="h-9 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/30"
        >
          Buka Pengaturan
        </Button>
        <Button
          variant="outline"
          onClick={onClose}
          className="h-9 rounded-lg border-border/40 px-5 text-xs font-semibold"
        >
          Mulai Jelajahi
        </Button>
      </div>
    </div>
  )
}

export default function OnboardingModal() {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isOpen, setIsOpen] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== 'true'
    } catch {
      return false
    }
  })

  const totalSlides = 3

  const handleClose = () => {
    setIsOpen(false)
    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      // silently fail
    }
  }

  const handleOpenSettings = () => {
    handleClose()
    navigate('/settings')
  }

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1)
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose() }}>
      <DialogContent className="max-w-lg gap-0 overflow-hidden border-border/40 bg-gradient-to-b from-card to-muted/5 p-0 shadow-2xl sm:rounded-2xl">
        <DialogTitle className="sr-only">Onboarding CampusMate AI</DialogTitle>

        {/* Slide content */}
        <div className="px-6 pb-2 pt-8">
          {currentSlide === 0 && <SlideWelcome />}
          {currentSlide === 1 && <SlideSetup />}
          {currentSlide === 2 && (
            <SlideReady onOpenSettings={handleOpenSettings} onClose={handleClose} />
          )}
        </div>

        {/* Bottom bar: dots + nav */}
        <div className="flex items-center justify-between border-t border-border/20 bg-muted/5 px-6 py-4">
          {/* Left: Skip button on slides 0–1 */}
          <div className="w-20">
            {currentSlide < 2 && (
              <button
                onClick={handleClose}
                className="text-[12px] font-medium text-muted-foreground/60 transition-colors hover:text-muted-foreground"
              >
                Lewati
              </button>
            )}
          </div>

          {/* Center: Dot indicators */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === currentSlide
                    ? 'w-5 bg-gradient-to-r from-blue-500 to-indigo-500'
                    : 'w-1.5 bg-muted-foreground/25 hover:bg-muted-foreground/40'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Right: Prev / Next */}
          <div className="flex w-20 items-center justify-end gap-2">
            {currentSlide > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrev}
                className="h-8 px-3 text-[12px] font-medium text-muted-foreground hover:text-foreground"
              >
                Sebelumnya
              </Button>
            )}
            {currentSlide < 2 && (
              <Button
                size="sm"
                onClick={handleNext}
                className="h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 text-[12px] font-semibold text-white shadow-sm shadow-blue-500/20"
              >
                Lanjut
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
