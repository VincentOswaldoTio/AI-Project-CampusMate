import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useOpenRouter } from '@/hooks/useOpenRouter'
import { useHistory } from '@/hooks/useHistory'
import { PROMPTS } from '@/lib/prompts'
import OutputBox from '@/components/shared/OutputBox'
import { toast } from 'sonner'

// ── Constants ──────────────────────────────────────────────────────────────────

const THESIS_DATA_KEY = 'campusmate_thesis_data'
const THESIS_PROGRESS_KEY = 'campusmate_thesis_progress'

const SECTIONS = [
  { id: 'bab1', label: 'BAB I', title: 'Pendahuluan' },
  { id: 'bab2', label: 'BAB II', title: 'Tinjauan Pustaka' },
  { id: 'bab3', label: 'BAB III', title: 'Metodologi' },
  { id: 'bab4', label: 'BAB IV', title: 'Hasil & Pembahasan' },
  { id: 'bab5', label: 'BAB V', title: 'Penutup' },
  { id: 'proposal', label: 'PROPOSAL', title: 'Proposal' },
  { id: 'sidang', label: 'SIDANG', title: 'Sidang/Ujian' }
]

const STATUS_OPTIONS = [
  'Belum Mulai',
  'Sedang Dikerjakan',
  'Draft',
  'Revisi',
  'Selesai'
]

const STATUS_COLORS = {
  'Belum Mulai': 'bg-zinc-500/10 text-zinc-500',
  'Sedang Dikerjakan': 'bg-blue-500/10 text-blue-500',
  'Draft': 'bg-amber-500/10 text-amber-500',
  'Revisi': 'bg-orange-500/10 text-orange-500',
  'Selesai': 'bg-emerald-500/10 text-emerald-500'
}

const DEFAULT_SECTION_STATE = () =>
  Object.fromEntries(
    SECTIONS.map((s) => [
      s.id,
      { progress: 0, status: 'Belum Mulai', notes: '' }
    ])
  )

// ── Helpers ────────────────────────────────────────────────────────────────────

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function getProgressColor(value) {
  if (value >= 80) return 'text-emerald-500'
  if (value >= 50) return 'text-blue-500'
  if (value >= 25) return 'text-amber-500'
  return 'text-zinc-400'
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function ThesisProgressTracker() {
  const { callAPI, isLoading } = useOpenRouter()
  const { saveToHistory } = useHistory()

  // Thesis info (title + advisor)
  const [thesisData, setThesisData] = useState(() =>
    loadJSON(THESIS_DATA_KEY, { title: '', advisor: '' })
  )

  // Per-section progress data
  const [sections, setSections] = useState(() =>
    loadJSON(THESIS_PROGRESS_KEY, DEFAULT_SECTION_STATE())
  )

  // AI output
  const [aiOutput, setAiOutput] = useState(null)

  // Debounce timer refs
  const saveTimerData = useRef(null)
  const saveTimerProgress = useRef(null)

  // ── Auto-save thesis data (debounce 500ms) ───────────────────────────────
  useEffect(() => {
    if (saveTimerData.current) clearTimeout(saveTimerData.current)
    saveTimerData.current = setTimeout(() => {
      localStorage.setItem(THESIS_DATA_KEY, JSON.stringify(thesisData))
    }, 500)
    return () => clearTimeout(saveTimerData.current)
  }, [thesisData])

  // ── Auto-save progress data (debounce 500ms) ─────────────────────────────
  useEffect(() => {
    if (saveTimerProgress.current) clearTimeout(saveTimerProgress.current)
    saveTimerProgress.current = setTimeout(() => {
      localStorage.setItem(THESIS_PROGRESS_KEY, JSON.stringify(sections))
    }, 500)
    return () => clearTimeout(saveTimerProgress.current)
  }, [sections])

  // ── Thesis data handlers ─────────────────────────────────────────────────
  const handleThesisDataChange = useCallback((field, value) => {
    setThesisData((prev) => ({ ...prev, [field]: value }))
  }, [])

  // ── Section update handler ───────────────────────────────────────────────
  const updateSection = useCallback((sectionId, field, value) => {
    setSections((prev) => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], [field]: value }
    }))
  }, [])

  // ── Computed overall progress ────────────────────────────────────────────
  const overallProgress = Math.round(
    SECTIONS.reduce((sum, s) => sum + (sections[s.id]?.progress || 0), 0) /
      SECTIONS.length
  )

  // ── Build user message for AI ────────────────────────────────────────────
  const buildUserMessage = () => {
    let msg = ''
    if (thesisData.title) msg += `Judul Skripsi/Tesis: ${thesisData.title}\n`
    if (thesisData.advisor)
      msg += `Dosen Pembimbing: ${thesisData.advisor}\n`
    msg += `\nProgres Keseluruhan: ${overallProgress}%\n`
    msg += '\n--- Detail per Bagian ---\n'

    SECTIONS.forEach((s) => {
      const data = sections[s.id]
      msg += `\n${s.label} ${s.title}:\n`
      msg += `  Progres: ${data.progress}%\n`
      msg += `  Status: ${data.status}\n`
      if (data.notes.trim()) msg += `  Catatan: ${data.notes.trim()}\n`
    })

    return msg
  }

  // ── Submit to AI ─────────────────────────────────────────────────────────
  const handleAskAI = async () => {
    const systemPrompt = PROMPTS.thesisProgressTracker
    if (!systemPrompt) {
      toast.error('System prompt tidak ditemukan!')
      return
    }

    const userMessage = buildUserMessage()
    if (!userMessage || userMessage.trim().length < 10) {
      toast.error('Data progres masih kosong.', {
        description: 'Isi minimal judul skripsi dan progres beberapa bab terlebih dahulu.'
      })
      return
    }

    const response = await callAPI({ systemPrompt, userMessage })

    if (response) {
      setAiOutput(response)
      saveToHistory({
        feature: 'thesis-progress-tracker',
        featureName: 'Thesis Progress Tracker',
        category: 'Manajemen Akademik',
        input:
          userMessage.length > 150
            ? userMessage.substring(0, 150) + '...'
            : userMessage,
        output: response
      })
      toast.success('Saran AI Berhasil!', {
        description: 'Evaluasi dan rekomendasi progres skripsi Anda telah digenerasi.'
      })
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Link to="/">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg border-border/40 hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-lg font-bold tracking-tight text-foreground leading-none">
            Thesis Progress Tracker
          </h1>
          <Badge className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-none rounded-full">
            Manajemen Akademik
          </Badge>
        </div>
      </div>

      <Separator className="border-border/30" />

      {/* ─── Thesis Info + Overall Progress ──────────────────────────────── */}
      <Card className="bg-gradient-to-br from-card to-muted/5 border-border/40 rounded-xl shadow-xs overflow-hidden">
        <CardHeader className="p-4 pb-3 border-b border-border/40">
          <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-amber-500" />
            INFORMASI SKRIPSI / TESIS
          </CardTitle>
          <CardDescription className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
            Data ini akan disimpan otomatis dan digunakan sebagai konteks untuk saran AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {/* Thesis info inputs — 2-col grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="thesis-title"
                className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75"
              >
                Judul Skripsi / Tesis
              </Label>
              <Input
                id="thesis-title"
                value={thesisData.title}
                onChange={(e) =>
                  handleThesisDataChange('title', e.target.value)
                }
                placeholder="Masukkan judul skripsi atau tesis Anda..."
                className="rounded-lg border-border/40 bg-muted/10 text-xs h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="thesis-advisor"
                className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75"
              >
                Nama Dosen Pembimbing
              </Label>
              <Input
                id="thesis-advisor"
                value={thesisData.advisor}
                onChange={(e) =>
                  handleThesisDataChange('advisor', e.target.value)
                }
                placeholder="Nama dosen pembimbing utama..."
                className="rounded-lg border-border/40 bg-muted/10 text-xs h-9"
              />
            </div>
          </div>

          {/* Overall progress bar */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                Progres Keseluruhan
              </Label>
              <span
                className={`text-sm font-bold tabular-nums ${getProgressColor(overallProgress)}`}
              >
                {overallProgress}%
              </span>
            </div>
            <Progress value={overallProgress} className="h-2.5 rounded-full" />
          </div>
        </CardContent>
      </Card>

      {/* ─── 7 Section Cards — Responsive Grid ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {SECTIONS.map((section) => {
          const data = sections[section.id]
          return (
            <SectionCard
              key={section.id}
              section={section}
              data={data}
              onUpdate={updateSection}
            />
          )
        })}
      </div>

      {/* ─── AI Advisor Button ───────────────────────────────────────────── */}
      <div className="flex justify-center pt-2">
        <Button
          onClick={handleAskAI}
          disabled={isLoading}
          className="h-9 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider gap-1.5 shadow-sm transition-all duration-150 active:scale-[0.98]"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {isLoading ? 'Sedang Menganalisis...' : 'Minta Saran AI'}
        </Button>
      </div>

      {/* ─── AI Output Box ───────────────────────────────────────────────── */}
      <OutputBox
        content={aiOutput}
        featureName="Thesis Progress Tracker"
        featureSlug="thesis-progress-tracker"
        isLoading={isLoading}
        emptyTitle="Saran AI Progres Skripsi"
        emptyDescription="Isi progres setiap bab di atas, lalu klik tombol 'Minta Saran AI' untuk mendapatkan evaluasi, rekomendasi prioritas, dan tips anti-prokrastinasi dari AI."
      />
    </div>
  )
}

// ── Section Card Sub-component ─────────────────────────────────────────────────

function SectionCard({ section, data, onUpdate }) {
  const statusColor = STATUS_COLORS[data.status] || STATUS_COLORS['Belum Mulai']

  return (
    <Card className="bg-gradient-to-br from-card to-muted/5 border-border/40 rounded-xl shadow-xs overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
      <CardHeader className="p-4 pb-3 border-b border-border/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-bold text-foreground flex items-center gap-2">
            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted/20 text-muted-foreground">
              {section.label}
            </span>
            {section.title}
          </CardTitle>
          <Badge
            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border-none rounded-full ${statusColor}`}
          >
            {data.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {/* Progress slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
              Progres
            </Label>
            <span
              className={`text-xs font-bold tabular-nums ${getProgressColor(data.progress)}`}
            >
              {data.progress}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={data.progress}
            onChange={(e) =>
              onUpdate(section.id, 'progress', Number(e.target.value))
            }
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-muted/30 accent-primary [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-sm"
          />
        </div>

        {/* Status select */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
            Status
          </Label>
          <Select
            value={data.status}
            onValueChange={(val) => onUpdate(section.id, 'status', val)}
          >
            <SelectTrigger className="rounded-lg border-border/40 bg-muted/10 h-9 text-xs">
              <SelectValue placeholder="Pilih status..." />
            </SelectTrigger>
            <SelectContent className="border-border/40">
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt} className="text-xs">
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Notes textarea */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
            Catatan
          </Label>
          <Textarea
            value={data.notes}
            onChange={(e) => onUpdate(section.id, 'notes', e.target.value)}
            placeholder="Catatan pribadi..."
            className="min-h-[64px] rounded-lg border-border/40 bg-muted/5 text-[12px] leading-relaxed p-2.5 resize-none focus-visible:ring-primary focus-visible:ring-1"
          />
        </div>
      </CardContent>
    </Card>
  )
}
