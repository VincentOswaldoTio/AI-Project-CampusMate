import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, CalendarDays, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useOpenRouter } from '@/hooks/useOpenRouter'
import { useHistory } from '@/hooks/useHistory'
import { PROMPTS } from '@/lib/prompts'
import OutputBox from '@/components/shared/OutputBox'
import { toast } from 'sonner'

function createCourse() {
  return {
    id: Date.now() + Math.random(),
    name: '',
    sks: '3',
    hasExam: false,
    examDate: ''
  }
}

export default function StudyScheduleGenerator() {
  const { callAPI, isLoading } = useOpenRouter()
  const { saveToHistory } = useHistory()

  // Dynamic course list
  const [courses, setCourses] = useState([createCourse()])

  // Schedule config
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [otherNotes, setOtherNotes] = useState('')
  const [intensity, setIntensity] = useState('Normal')
  const [output, setOutput] = useState(null)

  // ── Course handlers ─────────────────────────────────────────────────────
  const addCourse = () => {
    if (courses.length >= 15) {
      toast.error('Maksimal 15 mata kuliah.')
      return
    }
    setCourses(prev => [...prev, createCourse()])
  }

  const removeCourse = (id) => {
    if (courses.length <= 1) {
      toast.error('Minimal harus ada 1 mata kuliah.')
      return
    }
    setCourses(prev => prev.filter(c => c.id !== id))
  }

  const updateCourse = (id, field, value) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate at least 1 course with name
    const filledCourses = courses.filter(c => c.name.trim().length > 0)
    if (filledCourses.length === 0) {
      toast.error('Validasi Gagal', {
        description: 'Isi minimal 1 nama mata kuliah.'
      })
      return
    }

    // Validate dates
    if (!startDate || !endDate) {
      toast.error('Validasi Gagal', {
        description: 'Tentukan tanggal mulai dan tanggal selesai jadwal belajar.'
      })
      return
    }

    // Build user message
    let msg = `[INTENSITAS BELAJAR: ${intensity}]\n`
    msg += `[PERIODE JADWAL: ${startDate} s/d ${endDate}]\n\n`
    msg += `[DAFTAR MATA KULIAH]:\n`

    filledCourses.forEach((c, i) => {
      msg += `${i + 1}. ${c.name} (${c.sks} SKS)`
      if (c.hasExam && c.examDate) msg += ` — Ujian: ${c.examDate}`
      msg += '\n'
    })

    if (otherNotes.trim()) {
      msg += `\n[DEADLINE & KEGIATAN LAIN]:\n${otherNotes.trim()}\n`
    }

    const systemPrompt = PROMPTS.studyScheduleGenerator
    const result = await callAPI({
      systemPrompt,
      userMessage: msg
    })

    if (result) {
      setOutput(result)
      saveToHistory({
        feature: 'study-schedule-generator',
        featureName: 'Study Schedule Generator',
        category: 'Manajemen Akademik',
        input: `Jadwal Belajar (${filledCourses.length} matkul, ${intensity}): ${startDate} s/d ${endDate}`,
        output: result
      })
      toast.success('Jadwal Belajar Berhasil Dibuat!', {
        description: 'Rencana jadwal mingguan personal Anda telah disimpan ke riwayat.'
      })
    }
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-border/40 hover:bg-muted transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-lg font-bold tracking-tight text-foreground leading-none">
            Study Schedule Generator
          </h1>
          <Badge className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-none rounded-full">
            Manajemen Akademik
          </Badge>
        </div>
      </div>

      <Separator className="border-border/30" />

      {/* Grid Desktop Split-Pane / Mobile Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 items-start">

        {/* PANEL FORM (Kiri) */}
        <div className="lg:col-span-4 lg:sticky lg:top-4 space-y-4 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-1">
          <Card className="bg-gradient-to-br from-card to-muted/5 border-border/40 rounded-xl shadow-xs overflow-hidden">
            <CardHeader className="p-4 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-widest">
                <CalendarDays className="h-3.5 w-3.5 text-primary" />
                Perencana Jadwal Belajar
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                Susun jadwal belajar mingguan personal dengan teknik Pomodoro &amp; Spaced Repetition berdasarkan beban matkul dan ketersediaan waktu Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* ── Dynamic Course Rows ─────────────────────────────── */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                      Daftar Mata Kuliah ({courses.length})
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCourse}
                      className="h-7 text-[10px] font-bold uppercase tracking-wider gap-1 rounded-lg border-border/40 cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                      Tambah
                    </Button>
                  </div>

                  <div className="space-y-2.5">
                    {courses.map((course, idx) => (
                      <div
                        key={course.id}
                        className="p-3 bg-muted/5 border border-border/40 rounded-lg space-y-2.5"
                      >
                        {/* Row 1: Name + SKS + Delete */}
                        <div className="flex gap-2 items-start">
                          <div className="flex-1 space-y-1">
                            <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">
                              Matkul {idx + 1}
                            </Label>
                            <Input
                              value={course.name}
                              onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                              placeholder="Nama matkul..."
                              className="rounded-lg border-border/40 bg-background text-xs h-8 focus-visible:ring-1 focus-visible:ring-primary"
                            />
                          </div>
                          <div className="w-20 space-y-1">
                            <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">
                              SKS
                            </Label>
                            <Select value={course.sks} onValueChange={(v) => updateCourse(course.id, 'sks', v)}>
                              <SelectTrigger className="rounded-lg border-border/40 bg-background text-xs h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="border-border/40">
                                {[1, 2, 3, 4, 5, 6].map(n => (
                                  <SelectItem key={n} value={String(n)}>{n} SKS</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="pt-4">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeCourse(course.id)}
                              className="h-8 w-8 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>

                        {/* Row 2: Exam toggle + date */}
                        <div className="flex items-center gap-3">
                          <div
                            onClick={() => updateCourse(course.id, 'hasExam', !course.hasExam)}
                            className="flex items-center gap-2 cursor-pointer select-none"
                          >
                            <div className={`h-4 w-4 rounded flex items-center justify-center border transition-all ${
                              course.hasExam
                                ? 'bg-primary border-primary text-primary-foreground'
                                : 'border-input bg-background/50'
                            }`}>
                              {course.hasExam && (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor" className="w-2.5 h-2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              )}
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Ada Ujian</span>
                          </div>

                          {course.hasExam && (
                            <Input
                              type="date"
                              value={course.examDate}
                              onChange={(e) => updateCourse(course.id, 'examDate', e.target.value)}
                              className="rounded-lg border-border/40 bg-background text-xs h-8 flex-1 focus-visible:ring-1 focus-visible:ring-primary"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="border-border/20" />

                {/* ── Schedule Config ─────────────────────────────────── */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="start-date" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                      Tanggal Mulai
                    </Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="rounded-lg border-border/40 bg-muted/10 text-xs h-9 focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="end-date" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                      Tanggal Selesai
                    </Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="rounded-lg border-border/40 bg-muted/10 text-xs h-9 focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>
                </div>

                {/* Intensitas */}
                <div className="space-y-1.5">
                  <Label htmlFor="intensity" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Intensitas Belajar
                  </Label>
                  <Select value={intensity} onValueChange={setIntensity}>
                    <SelectTrigger id="intensity" className="rounded-lg border-border/40 bg-muted/10 text-xs h-9">
                      <SelectValue placeholder="Pilih..." />
                    </SelectTrigger>
                    <SelectContent className="border-border/40">
                      <SelectItem value="Santai">Santai (Banyak Istirahat)</SelectItem>
                      <SelectItem value="Normal">Normal (Seimbang)</SelectItem>
                      <SelectItem value="Intensif">Intensif (Ujian Dekat)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Deadline & kegiatan lain */}
                <div className="space-y-1.5">
                  <Label htmlFor="other-notes" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                    Deadline &amp; Kegiatan Lain <span className="text-muted-foreground/60">(Opsional)</span>
                  </Label>
                  <Textarea
                    id="other-notes"
                    value={otherNotes}
                    onChange={(e) => setOtherNotes(e.target.value)}
                    placeholder="Contoh: Rabu ada UKM basket, deadline makalah Jumat..."
                    className="min-h-[80px] rounded-lg border-border/40 bg-muted/5 text-[12px] leading-relaxed p-3 focus-visible:ring-primary focus-visible:ring-1"
                  />
                </div>

                {/* Submit */}
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
                      <span>Buat Jadwal Belajar</span>
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
            featureName="Study Schedule Generator"
            featureSlug="study-schedule-generator"
            isLoading={isLoading}
            emptyTitle="Hasil Jadwal Belajar Mingguan"
            emptyDescription="Tambahkan daftar mata kuliah Anda beserta SKS dan jadwal ujian di sebelah kiri, kemudian tentukan periode dan tingkat intensitas belajar. Klik 'Buat Jadwal Belajar' untuk menyusun perencanaan belajar personal menggunakan teknik Pomodoro."
          />
        </div>

      </div>
    </div>
  )
}
