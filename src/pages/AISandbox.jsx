import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Beaker, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  X, 
  ChevronRight, 
  ArrowRight, 
  Brain, 
  Settings, 
  Database, 
  Cpu, 
  BookOpen, 
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function AISandbox() {
  const [activeTab, setActiveTab] = useState('csp')

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-border/40 hover:bg-muted transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-lg font-bold tracking-tight text-foreground leading-none flex items-center gap-2">
            <Beaker className="h-4 w-4 text-primary" />
            AI Lab Simulator (UAS Sandbox)
          </h1>
          <Badge className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-primary/10 text-primary border-none rounded-full">
            Kecerdasan Buatan
          </Badge>
        </div>
      </div>

      <Separator className="border-border/30" />

      {/* Deskripsi Singkat */}
      <div className="bg-gradient-to-r from-primary/5 via-indigo-500/5 to-transparent border border-primary/20 rounded-xl p-4 flex gap-3 items-start">
        <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-foreground">Sandbox Demonstrasi Teori AI</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Halaman Sandbox ini dibuat khusus untuk memvisualisasikan implementasi nyata dari materi kuliah Kecerdasan Buatan (UAS): 
            <strong> Constraint Satisfaction Problem (CSP)</strong>, <strong>Representasi Pengetahuan &amp; Logika</strong>, 
            <strong> Classical Planning (STRIPS)</strong>, serta <strong>Desain Arsitektur Sistem Agen Cerdas (PEAS)</strong>.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-border/40 overflow-x-auto gap-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('csp')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'csp'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Settings className="h-3.5 w-3.5" />
          CSP Solver (Penjadwalan)
        </button>
        <button
          onClick={() => setActiveTab('logic')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'logic'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Database className="h-3.5 w-3.5" />
          Logic &amp; Reasoning
        </button>
        <button
          onClick={() => setActiveTab('planning')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'planning'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Cpu className="h-3.5 w-3.5" />
          Classical Planning (STRIPS)
        </button>
        <button
          onClick={() => setActiveTab('agent')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'agent'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Brain className="h-3.5 w-3.5" />
          Arsitektur Agen Cerdas (PEAS)
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'csp' && <CSPSolverModule />}
        {activeTab === 'logic' && <LogicReasoningModule />}
        {activeTab === 'planning' && <ClassicalPlanningModule />}
        {activeTab === 'agent' && <AgentDesignModule />}
      </div>
    </div>
  )
}

// Helper: Sleep function for animations
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// ─────────────────────────────────────────────────────────────────────────────
// 1. MODULE: CSP SOLVER
// ─────────────────────────────────────────────────────────────────────────────
function CSPSolverModule() {
  // Variables = Slots
  const slots = [
    { id: 'S1', label: 'Senin Pagi (08:00 - 10:00)' },
    { id: 'S2', label: 'Senin Siang (13:00 - 15:00)' },
    { id: 'S3', label: 'Selasa Pagi (08:00 - 10:00)' },
    { id: 'S4', label: 'Selasa Siang (13:00 - 15:00)' },
    { id: 'S5', label: 'Rabu Pagi (08:00 - 10:00)' },
    { id: 'S6', label: 'Rabu Siang (13:00 - 15:00)' }
  ]

  // Domains = Courses
  const initialCourses = [
    { code: 'KB', name: 'Kecerdasan Buatan', dosen: 'Dr. Ahmad', rule: 'Hanya bisa Pagi (S1, S3, S5)' },
    { code: 'RPL', name: 'Rekayasa Perangkat Lunak', dosen: 'Prof. Budi', rule: 'Tidak bisa Hari Senin (S1, S2)' },
    { code: 'JK', name: 'Jaringan Komputer', dosen: 'Dr. Ahmad', rule: 'Satu dosen dengan KB (tidak boleh hari yang sama)' },
    { code: 'UI', name: 'Desain UI/UX', dosen: 'Bu Citra', rule: 'RPL & UI tidak boleh di hari yang sama' }
  ]

  const [assignment, setAssignment] = useState({}) // { slotId: courseCode }
  const [currentSlotIdx, setCurrentSlotIdx] = useState(-1)
  const [currentCheckingCourse, setCurrentCheckingCourse] = useState(null)
  const [logs, setLogs] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(600) // ms
  const [solverStatus, setSolverStatus] = useState('idle') // idle, running, success, failed
  const isRunningRef = useRef(false)

  // Clear state
  const resetSolver = () => {
    isRunningRef.current = false
    setIsRunning(false)
    setAssignment({})
    setCurrentSlotIdx(-1)
    setCurrentCheckingCourse(null)
    setLogs([])
    setSolverStatus('idle')
  }

  // Constraint check logic
  const checkConstraints = (proposedAssignment, slotId, courseCode) => {
    const course = initialCourses.find(c => c.code === courseCode)
    const slot = slots.find(s => s.id === slotId)
    
    // Constraint 1: Dosen KB (Dr. Ahmad) hanya bisa mengajar slot Pagi
    if (courseCode === 'KB' && !slot.label.includes('Pagi')) {
      return { valid: false, reason: 'KB hanya bisa dijadwalkan di slot Pagi' }
    }

    // Constraint 2: RPL (Prof. Budi) tidak bisa mengajar hari Senin
    if (courseCode === 'RPL' && slot.label.includes('Senin')) {
      return { valid: false, reason: 'Dosen RPL tidak bersedia mengajar di hari Senin' }
    }

    // Constraint 3: KB dan JK memiliki dosen yang sama (Dr. Ahmad) -> Tidak boleh hari yang sama
    const getDay = (sId) => slots.find(s => s.id === sId).label.split(' ')[0]
    const proposedDay = getDay(slotId)

    for (const [sId, cCode] of Object.entries(proposedAssignment)) {
      if (sId === slotId) continue // skip check with self
      const existingCourse = initialCourses.find(c => c.code === cCode)
      if (existingCourse.dosen === course.dosen) {
        const existingDay = getDay(sId)
        if (existingDay === proposedDay) {
          return { valid: false, reason: `${courseCode} & ${cCode} diampu Dr. Ahmad (tidak boleh di hari yang sama)` }
        }
      }
    }

    // Constraint 4: RPL dan UI tidak boleh di hari yang sama
    if (courseCode === 'UI' || courseCode === 'RPL') {
      const targetPartner = courseCode === 'UI' ? 'RPL' : 'UI'
      for (const [sId, cCode] of Object.entries(proposedAssignment)) {
        if (sId === slotId) continue
        if (cCode === targetPartner) {
          const existingDay = getDay(sId)
          if (existingDay === proposedDay) {
            return { valid: false, reason: `RPL dan UI tidak boleh berada di hari yang sama` }
          }
        }
      }
    }

    return { valid: true }
  }

  // Async Backtracking algorithm
  const runBacktracking = async () => {
    if (isRunning) {
      isRunningRef.current = false
      setIsRunning(false)
      setSolverStatus('idle')
      return
    }

    setIsRunning(true)
    isRunningRef.current = true
    setSolverStatus('running')
    setLogs(['Memulai proses Backtracking Search...'])
    
    const currentAssign = {}
    setAssignment({})

    const success = await backtrack(0, currentAssign)
    
    if (!isRunningRef.current) return

    setIsRunning(false)
    if (success) {
      setSolverStatus('success')
      toast.success('Jadwal berhasil diselesaikan!')
      setLogs(prev => [...prev, '🎉 Solusi berhasil ditemukan! Seluruh batasan (constraints) terpenuhi.'])
    } else {
      setSolverStatus('failed')
      toast.error('Tidak ditemukan solusi penjadwalan!')
      setLogs(prev => [...prev, '❌ Gagal: Tidak ada kombinasi jadwal yang memenuhi semua batasan.'])
    }
  }

  const backtrack = async (slotIdx, currentAssign) => {
    if (!isRunningRef.current) return false

    // Goal State: Semua mata kuliah berhasil ditempatkan
    const assignedCoursesCount = Object.values(currentAssign).length
    if (assignedCoursesCount === initialCourses.length) {
      return true
    }

    // Gagal jika slot habis tapi matkul belum semua ditempatkan
    if (slotIdx >= slots.length) {
      return false
    }

    const slot = slots[slotIdx]
    setCurrentSlotIdx(slotIdx)
    await sleep(speed)

    // Coba tempatkan setiap mata kuliah yang belum dijadwalkan
    for (const course of initialCourses) {
      if (!isRunningRef.current) return false

      // Cek apakah mata kuliah sudah ditempatkan di slot lain
      if (Object.values(currentAssign).includes(course.code)) {
        continue
      }

      setCurrentCheckingCourse(course.code)
      setLogs(prev => [...prev, `Mencoba menempatkan ${course.code} di ${slot.id}...`])
      
      // Update UI temporal
      setAssignment({ ...currentAssign, [slot.id]: course.code })
      await sleep(speed)

      // Cek constraints
      const constraintCheck = checkConstraints(currentAssign, slot.id, course.code)

      if (constraintCheck.valid) {
        setLogs(prev => [...prev, `✅ ${course.code} di ${slot.id} lolos kekangan.`])
        currentAssign[slot.id] = course.code
        setAssignment({ ...currentAssign })
        
        // Rekursi ke slot berikutnya
        const result = await backtrack(slotIdx + 1, currentAssign)
        if (result) return true

        // Backtrack
        if (!isRunningRef.current) return false
        setLogs(prev => [...prev, `⚠️ Gagal di langkah selanjutnya, membatalkan ${course.code} dari ${slot.id} (Backtrack)...`])
        delete currentAssign[slot.id]
        setAssignment({ ...currentAssign })
        await sleep(speed)
      } else {
        setLogs(prev => [...prev, `❌ ${course.code} di ${slot.id} melanggar constraint: ${constraintCheck.reason}`])
        await sleep(speed)
      }
    }

    // Jika tidak ada matkul yang cocok di slot ini, coba biarkan slot ini kosong dan lanjut
    setLogs(prev => [...prev, `Meninggalkan slot ${slot.id} kosong untuk jalur pencarian ini...`])
    const result = await backtrack(slotIdx + 1, currentAssign)
    if (result) return true

    return false
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* PANEL CONTROL & LOGS */}
      <div className="lg:col-span-5 space-y-4">
        <Card className="bg-card border-border/40 rounded-xl overflow-hidden shadow-xs">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-widest">
              <Settings className="h-4 w-4 text-primary" />
              Konfigurasi Batasan (CSP)
            </CardTitle>
            <CardDescription className="text-[11px] text-muted-foreground mt-0.5">
              Variabel (Slot Ujian/Kuliah) &amp; Domain (Mata Kuliah) beserta aturan constraint yang harus dipenuhi.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4 text-xs">
            {/* Domain info */}
            <div className="space-y-2">
              <h4 className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider">Domain: Mata Kuliah &amp; Aturan Batasan</h4>
              <div className="space-y-1.5">
                {initialCourses.map((c) => (
                  <div key={c.code} className="p-2 bg-muted/20 border border-border/40 rounded-lg flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">{c.name} ({c.code})</span>
                      <span className="text-[10px] text-muted-foreground">Dosen: {c.dosen}</span>
                    </div>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">⚠️ Constraint: {c.rule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                <span>Kecepatan Animasi</span>
                <span>{speed}ms</span>
              </div>
              <input
                type="range"
                min="200"
                max="2000"
                step="100"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                disabled={isRunning}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={runBacktracking}
                className="flex-1 text-xs font-semibold py-1.5 cursor-pointer"
                variant={isRunning ? 'destructive' : 'default'}
              >
                {isRunning ? (
                  <>
                    <Pause className="h-3.5 w-3.5 mr-1" /> Hentikan
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 mr-1" /> Jalankan Backtracking
                  </>
                )}
              </Button>
              <Button
                onClick={resetSolver}
                variant="outline"
                disabled={isRunning}
                className="text-xs font-semibold border-border/40 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* LOG PANEL */}
        <Card className="bg-card border-border/40 rounded-xl overflow-hidden shadow-xs">
          <CardHeader className="p-4 border-b border-border/40 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-widest">
              <Clock className="h-4 w-4 text-primary" />
              Proses Trace Algoritma
            </CardTitle>
            <Badge className={`text-[9px] font-bold ${
              solverStatus === 'running' ? 'bg-amber-500/10 text-amber-500' :
              solverStatus === 'success' ? 'bg-green-500/10 text-green-500' :
              solverStatus === 'failed' ? 'bg-red-500/10 text-red-500' :
              'bg-muted text-muted-foreground'
            } border-none rounded-full`}>
              {solverStatus.toUpperCase()}
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-48 overflow-y-auto p-4 bg-muted/10 font-mono text-[10px] space-y-1.5 scrollbar-thin">
              {logs.length === 0 && (
                <span className="text-muted-foreground italic">Klik "Jalankan Backtracking" untuk melihat proses...</span>
              )}
              {logs.map((log, idx) => (
                <div key={idx} className={`leading-relaxed ${
                  log.startsWith('✅') ? 'text-green-500' :
                  log.startsWith('❌') ? 'text-red-500 font-semibold' :
                  log.startsWith('⚠️') ? 'text-amber-500' :
                  log.startsWith('🎉') ? 'text-emerald-400 font-bold bg-emerald-500/5 p-1 rounded border border-emerald-500/10' :
                  'text-foreground'
                }`}>
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* VISUAL SCHEDULE GRID */}
      <div className="lg:col-span-7 space-y-4">
        <Card className="bg-card border-border/40 rounded-xl overflow-hidden shadow-xs h-full flex flex-col">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-widest">
              <Database className="h-4 w-4 text-primary" />
              Papan Jadwal Visual (State Variabel)
            </CardTitle>
            <CardDescription className="text-[11px] text-muted-foreground mt-0.5">
              Representasi visual penempatan mata kuliah pada slot waktu. Merah berkedip menandakan sedang dicek / backtrack.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 flex-1 flex flex-col justify-between">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {slots.map((slot, idx) => {
                const assignedCourseCode = assignment[slot.id]
                const course = initialCourses.find(c => c.code === assignedCourseCode)
                const isCurrent = idx === currentSlotIdx
                
                return (
                  <div
                    key={slot.id}
                    className={`p-3 border rounded-xl flex flex-col justify-between h-24 transition-all duration-300 ${
                      isCurrent
                        ? 'border-primary bg-primary/5 shadow-xs ring-1 ring-primary/40'
                        : assignedCourseCode
                        ? 'border-emerald-500/30 bg-emerald-500/5'
                        : 'border-border/40 bg-muted/5'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{slot.id}</span>
                      <span className="text-[10px] text-foreground font-semibold">{slot.label.split(' ')[0]}</span>
                    </div>

                    <div className="py-2 flex items-center justify-center">
                      {course ? (
                        <div className="text-center">
                          <Badge className="bg-primary/20 text-primary border-none rounded-lg text-xs font-extrabold px-2 py-0.5">
                            {course.code}
                          </Badge>
                          <p className="text-[10px] font-bold text-foreground mt-1 truncate max-w-[150px]">{course.name}</p>
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground/50 italic font-mono">- Kosong -</span>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-muted-foreground">
                      <span>{slot.label.split('(')[1]?.replace(')', '') || ''}</span>
                      {isCurrent && currentCheckingCourse && (
                        <span className="text-primary font-bold animate-pulse">Cek: {currentCheckingCourse}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Explanation box */}
            <div className="p-3 bg-muted/20 border border-border/40 rounded-lg mt-4 text-[10px] text-muted-foreground leading-relaxed">
              <h5 className="font-bold text-foreground mb-1">Cara Kerja Solver:</h5>
              Algoritma <strong>Backtracking Search</strong> adalah pencarian kedalaman (DFS) yang menempatkan mata kuliah satu per satu pada slot kosong. 
              Setiap kali penempatan melanggar salah satu batasan (Constraint), algoritma akan <strong>membatalkan (backtrack)</strong> langkah tersebut 
              dan mencoba jalur lain. Jika seluruh mata kuliah sukses terplot tanpa konflik, solusi tercapai.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. MODULE: LOGIC REASONING (FORWARD CHAINING)
// ─────────────────────────────────────────────────────────────────────────────
function LogicReasoningModule() {
  // Facts
  const initialFacts = [
    { id: 'sks_cukup', label: 'SKS Kuliah Terlampaui (>= 100 SKS)', default: false },
    { id: 'lulus_metpen', label: 'Telah Lulus Mata Kuliah Metodologi Penelitian', default: false },
    { id: 'punya_draft', label: 'Memiliki Draf Proposal Penelitian Mandiri', default: false },
    { id: 'ada_dospem', label: 'Mendapat Persetujuan Dosen Calon Pembimbing', default: false }
  ]

  // Rules
  const rules = [
    {
      id: 'R1',
      desc: 'IF SKS Terlampaui AND Lulus Metpen THEN Berhak Ambil Skripsi',
      preconditions: ['sks_cukup', 'lulus_metpen'],
      conclusion: 'berhak_skripsi'
    },
    {
      id: 'R2',
      desc: 'IF Berhak Ambil Skripsi AND Memiliki Draf Proposal THEN Siap Seminar Proposal',
      preconditions: ['berhak_skripsi', 'punya_draft'],
      conclusion: 'siap_seminar'
    },
    {
      id: 'R3',
      desc: 'IF Siap Seminar AND Ada Persetujuan Dosen Calon Pembimbing THEN Jadwalkan Sidang Sempro',
      preconditions: ['siap_seminar', 'ada_dospem'],
      conclusion: 'jadwalkan_sidang'
    }
  ]

  const factLabels = {
    sks_cukup: 'SKS Kuliah >= 100',
    lulus_metpen: 'Lulus Metpen',
    punya_draft: 'Punya Draf Proposal',
    ada_dospem: 'Disetujui Dospem',
    berhak_skripsi: '🌟 Berhak Ambil Skripsi',
    siap_seminar: '🌟 Siap Seminar Proposal',
    jadwalkan_sidang: '🏆 Jadwalkan Sidang Sempro'
  }

  const [activeFacts, setActiveFacts] = useState(['sks_cukup'])
  const [inferredFacts, setInferredFacts] = useState([]) // facts derived during execution
  const [activeRuleId, setActiveRuleId] = useState(null)
  const [logs, setLogs] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [solverStatus, setSolverStatus] = useState('idle')

  const toggleFact = (factId) => {
    if (isRunning) return
    if (activeFacts.includes(factId)) {
      setActiveFacts(prev => prev.filter(f => f !== factId))
    } else {
      setActiveFacts(prev => [...prev, factId])
    }
    // reset status
    setInferredFacts([])
    setLogs([])
    setSolverStatus('idle')
  }

  const runForwardChaining = async () => {
    setIsRunning(true)
    setSolverStatus('running')
    setInferredFacts([])
    setLogs(['Memulai penalaran Forward Chaining...', `Fakta Awal: [${activeFacts.map(f => factLabels[f]).join(', ')}]`])
    
    let currentFacts = [...activeFacts]
    let newlyInferred = []
    let ruleFired = true
    let steps = 0

    await sleep(800)

    while (ruleFired && steps < 10) {
      ruleFired = false
      steps++

      for (const rule of rules) {
        // Cek jika kesimpulan aturan sudah ada di fakta
        if (currentFacts.includes(rule.conclusion)) continue

        setActiveRuleId(rule.id)
        setLogs(prev => [...prev, `Memeriksa Aturan ${rule.id}: ${rule.desc}...`])
        await sleep(800)

        // Cek apakah semua prakondisi dipenuhi fakta saat ini
        const satisfiesAll = rule.preconditions.every(prec => currentFacts.includes(prec))

        if (satisfiesAll) {
          ruleFired = true
          currentFacts.push(rule.conclusion)
          newlyInferred.push(rule.conclusion)
          setInferredFacts([...newlyInferred])
          setLogs(prev => [
            ...prev,
            `🔥 Aturan ${rule.id} TERPENUHI (Fired)!`,
            `👉 Menyimpulkan fakta baru: ${factLabels[rule.conclusion]}`
          ])
          toast.success(`Fakta baru terungkap: ${factLabels[rule.conclusion]}`)
          await sleep(1000)
          break // break for loop to start checking rules from start with new facts
        } else {
          const missing = rule.preconditions.filter(prec => !currentFacts.includes(prec))
          setLogs(prev => [...prev, `❌ Aturan ${rule.id} tidak terpenuhi. Kurang fakta: [${missing.map(f => factLabels[f] || f).join(', ')}]`])
          await sleep(600)
        }
      }
    }

    setActiveRuleId(null)
    setIsRunning(false)
    setSolverStatus('success')
    setLogs(prev => [...prev, 'Penalaran selesai. Tidak ada aturan baru yang dapat dibakar.'])
  }

  const resetLogic = () => {
    setIsRunning(false)
    setInferredFacts([])
    setLogs([])
    setActiveRuleId(null)
    setSolverStatus('idle')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* LEFT: FACTS INPUT & RULES */}
      <div className="lg:col-span-5 space-y-4">
        <Card className="bg-card border-border/40 rounded-xl overflow-hidden shadow-xs">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-widest">
              <Database className="h-4 w-4 text-primary" />
              Fakta Awal (Basis Pengetahuan)
            </CardTitle>
            <CardDescription className="text-[11px] text-muted-foreground mt-0.5">
              Pilih fakta akademis yang dimiliki mahasiswa saat ini.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            <div className="space-y-2">
              {initialFacts.map((fact) => {
                const isActive = activeFacts.includes(fact.id)
                return (
                  <button
                    key={fact.id}
                    onClick={() => toggleFact(fact.id)}
                    disabled={isRunning}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all ${
                      isActive
                        ? 'border-primary bg-primary/5 text-foreground font-semibold'
                        : 'border-border/40 bg-muted/10 text-muted-foreground hover:bg-muted/30 hover:text-foreground'
                    } cursor-pointer`}
                  >
                    <span>{fact.label}</span>
                    <div className={`h-4 w-4 rounded flex items-center justify-center border ${
                      isActive ? 'bg-primary border-primary text-white' : 'border-border/60 bg-background'
                    }`}>
                      {isActive && <Check className="h-3 w-3" />}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={runForwardChaining}
                disabled={isRunning}
                className="flex-1 text-xs font-semibold py-1.5 cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 mr-1" /> Jalankan Forward Chaining
              </Button>
              <Button
                onClick={resetLogic}
                variant="outline"
                disabled={isRunning}
                className="text-xs font-semibold border-border/40 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* RULE LIST */}
        <Card className="bg-card border-border/40 rounded-xl overflow-hidden shadow-xs">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-widest">
              <BookOpen className="h-4 w-4 text-primary" />
              Kumpulan Aturan (Production Rules)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-xs">
            {rules.map((rule) => {
              const isChecking = activeRuleId === rule.id
              return (
                <div
                  key={rule.id}
                  className={`p-2.5 border rounded-lg transition-all ${
                    isChecking
                      ? 'border-amber-500 bg-amber-500/5 ring-1 ring-amber-500/40'
                      : 'border-border/40 bg-muted/10'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-[10px] text-primary">{rule.id}</span>
                    {isChecking && <Badge className="bg-amber-500 text-white rounded text-[8px] px-1 py-0 border-none">Mengevaluasi...</Badge>}
                  </div>
                  <p className="font-mono text-[10px] leading-relaxed text-foreground">{rule.desc}</p>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* RIGHT: REASONING PROCESS & VISUAL GRAPH */}
      <div className="lg:col-span-7 space-y-4">
        {/* LOGS PANEL */}
        <Card className="bg-card border-border/40 rounded-xl overflow-hidden shadow-xs">
          <CardHeader className="p-4 border-b border-border/40 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-widest">
              <Clock className="h-4 w-4 text-primary" />
              Jejak Penalaran (Reasoning Logs)
            </CardTitle>
            <Badge className={`text-[9px] font-bold ${
              solverStatus === 'running' ? 'bg-amber-500/10 text-amber-500' :
              solverStatus === 'success' ? 'bg-green-500/10 text-green-500' :
              'bg-muted text-muted-foreground'
            } border-none rounded-full`}>
              {solverStatus.toUpperCase()}
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-44 overflow-y-auto p-4 bg-muted/10 font-mono text-[10px] space-y-1 scrollbar-thin">
              {logs.length === 0 && (
                <span className="text-muted-foreground italic">Tekan "Jalankan Forward Chaining" untuk memulai proses reasoning...</span>
              )}
              {logs.map((log, idx) => (
                <div key={idx} className={
                  log.includes('TERPENUHI') ? 'text-green-500 font-bold' :
                  log.startsWith('👉') ? 'text-cyan-500 font-semibold' :
                  log.startsWith('❌') ? 'text-muted-foreground/60' :
                  log.startsWith('Memulai') ? 'text-primary font-bold' :
                  'text-foreground'
                }>
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* VISUAL REASONING GRAPH */}
        <Card className="bg-card border-border/40 rounded-xl overflow-hidden shadow-xs">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-widest">
              <Cpu className="h-4 w-4 text-primary" />
              Pohon Deduksi Logika
            </CardTitle>
            <CardDescription className="text-[11px] text-muted-foreground mt-0.5">
              Visualisasi bagaimana fakta awal merambat melalui aturan logika hingga menghasilkan kesimpulan.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 flex flex-col justify-between text-xs space-y-6 h-64">
            <div className="flex flex-col items-center justify-center h-full relative space-y-4">
              
              {/* Row 1: Fakta Awal */}
              <div className="flex flex-wrap justify-center gap-2">
                {initialFacts.map(f => {
                  const isActive = activeFacts.includes(f.id)
                  return (
                    <div
                      key={f.id}
                      className={`px-2.5 py-1 border rounded-full font-semibold transition-all ${
                        isActive
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-muted/10 border-border/40 text-muted-foreground'
                      }`}
                    >
                      {factLabels[f.id]}
                    </div>
                  )
                })}
              </div>

              {/* Arrow */}
              <div className="flex flex-col items-center">
                <div className="h-6 w-0.5 bg-border/40 relative">
                  <ChevronRight className="rotate-90 h-4 w-4 -left-1.5 -bottom-2 text-border/60 absolute" />
                </div>
              </div>

              {/* Row 2: Inferred Level 1 */}
              <div className="flex gap-4">
                <div className={`p-2.5 border rounded-xl transition-all ${
                  inferredFacts.includes('berhak_skripsi')
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'bg-muted/5 border-border/20 text-muted-foreground/40'
                }`}>
                  {factLabels.berhak_skripsi}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex flex-col items-center">
                <div className="h-6 w-0.5 bg-border/40 relative">
                  <ChevronRight className="rotate-90 h-4 w-4 -left-1.5 -bottom-2 text-border/60 absolute" />
                </div>
              </div>

              {/* Row 3: Final Conclusions */}
              <div className="flex flex-wrap gap-4 justify-center">
                <div className={`p-2.5 border rounded-xl transition-all ${
                  inferredFacts.includes('siap_seminar')
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'bg-muted/5 border-border/20 text-muted-foreground/40'
                }`}>
                  {factLabels.siap_seminar}
                </div>

                <div className={`p-2.5 border rounded-xl transition-all ${
                  inferredFacts.includes('jadwalkan_sidang')
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'bg-muted/5 border-border/20 text-muted-foreground/40'
                }`}>
                  {factLabels.jadwalkan_sidang}
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. MODULE: CLASSICAL PLANNING (STRIPS)
// ─────────────────────────────────────────────────────────────────────────────
function ClassicalPlanningModule() {
  // Actions
  const actions = [
    {
      name: 'Kuliah Reguler',
      preconditions: ['mahasiswa_baru'],
      add: ['mahasiswa_aktif'],
      delete: ['mahasiswa_baru'],
      desc: 'Mendaftarkan diri dan mengikuti perkuliahan reguler.'
    },
    {
      name: 'Ikut Magang',
      preconditions: ['mahasiswa_aktif'],
      add: ['kompeten'],
      delete: [],
      desc: 'Mencari pengalaman industri magang kerja.'
    },
    {
      name: 'Bimbingan Skripsi',
      preconditions: ['mahasiswa_aktif', 'kompeten'],
      add: ['skripsi_selesai'],
      delete: [],
      desc: 'Konsultasi berkala ke dosen pembimbing skripsi.'
    },
    {
      name: 'Ujian Sidang',
      preconditions: ['skripsi_selesai'],
      add: ['sarjana_lulus'],
      delete: ['mahasiswa_aktif'],
      desc: 'Ujian mempertahankan skripsi di depan dewan penguji.'
    }
  ]

  const stateLabels = {
    mahasiswa_baru: 'Mahasiswa Baru 👶',
    mahasiswa_aktif: 'Mahasiswa Aktif 📚',
    kompeten: 'Kompetensi Industri 💼',
    skripsi_selesai: 'Skripsi Selesai 📄',
    sarjana_lulus: 'Sarjana Lulus / Wisuda! 🎓'
  }

  // BFS Planner to find path
  const findPlan = (initialState, goalState) => {
    // Basic BFS state space search
    const queue = [[initialState, []]] // [ [state_array], [action_sequence] ]
    const visited = new Set()
    
    // Helper to stringify state for sets
    const stateKey = (state) => [...state].sort().join(',')
    visited.add(stateKey(initialState))

    while (queue.length > 0) {
      const [state, plan] = queue.shift()

      // Goal test: does state contain all goal conditions?
      const isGoal = goalState.every(g => state.includes(g))
      if (isGoal) {
        return plan
      }

      // Check actions
      for (const act of actions) {
        // Precondition check
        const satisfiesPre = act.preconditions.every(p => state.includes(p))
        if (!satisfiesPre) continue

        // Apply effect
        let nextState = state.filter(s => !act.delete.includes(s))
        act.add.forEach(a => {
          if (!nextState.includes(a)) nextState.push(a)
        })

        const key = stateKey(nextState)
        if (!visited.has(key)) {
          visited.add(key)
          queue.push([nextState, [...plan, { actionName: act.name, stateBefore: state, stateAfter: nextState }]])
        }
      }
    }
    return null // no plan found
  }

  const [initialState, setInitialState] = useState(['mahasiswa_baru'])
  const [goalState, setGoalState] = useState(['sarjana_lulus'])
  const [planSteps, setPlanSteps] = useState([])
  const [logs, setLogs] = useState([])
  const [isRunning, setIsRunning] = useState(false)

  const generatePlan = () => {
    setIsRunning(true)
    setLogs(['Inisialisasi Perencana STRIPS Klasik...', `Initial State: [${initialState.map(s => stateLabels[s]).join(', ')}]`, `Goal State: [${goalState.map(s => stateLabels[s]).join(', ')}]`])
    
    const plan = findPlan(initialState, goalState)
    
    if (plan) {
      setPlanSteps(plan)
      setLogs(prev => [
        ...prev,
        'Mencari alur aksi optimal menggunakan BFS State-Space Search...',
        `🎉 Rencana ditemukan! Terdiri dari ${plan.length} aksi.`
      ])
      toast.success('Rencana aksi kelulusan sukses di-generate!')
    } else {
      setPlanSteps([])
      setLogs(prev => [...prev, '❌ Gagal: Tidak ada rangkaian aksi yang dapat mencapai Goal State dari Initial State saat ini.'])
    }
    setIsRunning(false)
  }

  const resetPlanner = () => {
    setPlanSteps([])
    setLogs([])
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* ACTIONS & STATE SETUP */}
      <div className="lg:col-span-5 space-y-4">
        <Card className="bg-card border-border/40 rounded-xl overflow-hidden shadow-xs">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-widest">
              <Settings className="h-4 w-4 text-primary" />
              Pengaturan State Awal &amp; Goal
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4 text-xs">
            <div className="space-y-3">
              <div className="p-2 bg-muted/20 border border-border/40 rounded-lg">
                <span className="font-bold text-[10px] text-muted-foreground uppercase block mb-1">State Awal (Initial State)</span>
                <span className="font-semibold text-foreground">{stateLabels.mahasiswa_baru}</span>
              </div>

              <div className="p-2 bg-muted/20 border border-border/40 rounded-lg">
                <span className="font-bold text-[10px] text-muted-foreground uppercase block mb-1">Goal State</span>
                <span className="font-semibold text-foreground">{stateLabels.sarjana_lulus}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={generatePlan}
                disabled={isRunning}
                className="flex-1 text-xs font-semibold py-1.5 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1" /> Rancang Rencana Kelulusan
              </Button>
              <Button
                onClick={resetPlanner}
                variant="outline"
                disabled={isRunning}
                className="text-xs font-semibold border-border/40 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* DOMAIN ACTIONS */}
        <Card className="bg-card border-border/40 rounded-xl overflow-hidden shadow-xs">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-widest">
              <Database className="h-4 w-4 text-primary" />
              Domain Operator (Aksi STRIPS)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            {actions.map((act) => (
              <div key={act.name} className="p-2.5 bg-muted/10 border border-border/40 rounded-lg space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-foreground text-[10px]">{act.name}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">{act.desc}</p>
                <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
                  <div className="text-amber-600 dark:text-amber-400">
                    <span className="font-bold">PRE:</span> {act.preconditions.join(', ')}
                  </div>
                  <div className="text-emerald-600 dark:text-emerald-400">
                    <span className="font-bold">EFF:</span> +{act.add.join(', ') || 'none'}{act.delete.length > 0 ? ` / -${act.delete.join(', ')}` : ''}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* STRIPS PLANNER VISUALS */}
      <div className="lg:col-span-7 space-y-4">
        {/* LOGS */}
        <Card className="bg-card border-border/40 rounded-xl overflow-hidden shadow-xs">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-widest">
              <Clock className="h-4 w-4 text-primary" />
              Trace Pencarian Ruang State
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-40 overflow-y-auto p-4 bg-muted/10 font-mono text-[10px] space-y-1 scrollbar-thin">
              {logs.length === 0 && (
                <span className="text-muted-foreground italic">Tekan "Rancang Rencana" untuk menghitung langkah aksi...</span>
              )}
              {logs.map((log, idx) => (
                <div key={idx} className={
                  log.startsWith('🎉') ? 'text-green-500 font-bold bg-green-500/5 p-1 rounded' :
                  log.startsWith('❌') ? 'text-red-500 font-bold' :
                  'text-foreground'
                }>
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* PLAN SEQUENCE GRAPH */}
        <Card className="bg-card border-border/40 rounded-xl overflow-hidden shadow-xs flex-1">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-widest">
              <Cpu className="h-4 w-4 text-primary" />
              Graf Alur Rencana Aksi (Plan Graph)
            </CardTitle>
            <CardDescription className="text-[11px] text-muted-foreground mt-0.5">
              Rangkaian aksi berurutan beserta transisi state yang berhasil disusun.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4 min-h-60 flex flex-col justify-center">
            {planSteps.length === 0 ? (
              <div className="text-center text-muted-foreground text-xs italic py-12">
                Tidak ada rencana aktif. Silakan jalankan planner terlebih dahulu.
              </div>
            ) : (
              <div className="flex flex-col gap-4 relative">
                
                {/* Initial State */}
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px] shrink-0">
                    S0
                  </div>
                  <div className="p-2 border border-border/40 bg-muted/20 rounded-xl flex-1 text-xs">
                    <span className="text-[9px] font-bold text-muted-foreground block uppercase">State Awal</span>
                    <span className="font-semibold">{initialState.map(s => stateLabels[s]).join(', ')}</span>
                  </div>
                </div>

                {/* Steps */}
                {planSteps.map((step, idx) => (
                  <div key={idx} className="space-y-4 relative pl-3">
                    
                    {/* Line connecting */}
                    <div className="absolute left-3 top-[-16px] bottom-[-16px] w-0.5 bg-border/40"></div>

                    {/* Action Arrow */}
                    <div className="flex items-center gap-3 relative pl-6">
                      <ArrowRight className="h-4 w-4 text-amber-500 absolute left-2 top-2.5 animate-pulse" />
                      <div className="p-2 border border-amber-500/20 bg-amber-500/5 rounded-xl flex-1 text-xs">
                        <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 block uppercase">Aksi {idx + 1}</span>
                        <span className="font-bold text-foreground">{step.actionName}</span>
                      </div>
                    </div>

                    {/* Next State */}
                    <div className="flex items-center gap-3 relative pl-6">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 z-10">
                        S{idx + 1}
                      </div>
                      <div className="p-2 border border-emerald-500/20 bg-emerald-500/5 rounded-xl flex-1 text-xs">
                        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 block uppercase">State Setelah Aksi</span>
                        <span className="font-semibold">{step.stateAfter.map(s => stateLabels[s] || s).join(', ')}</span>
                      </div>
                    </div>

                  </div>
                ))}

              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MODULE: INTELLIGENT AGENT DESIGN (PEAS)
// ─────────────────────────────────────────────────────────────────────────────
function AgentDesignModule() {
  const [selectedComponent, setSelectedComponent] = useState(null)

  const components = {
    sensors: {
      title: 'Sensors (Sensor)',
      desc: 'Bagaimana agen menangkap informasi dari lingkungannya. Di CampusMate AI, ini mencakup formulir masukan teks, unggah file, penekanan tombol di UI, dan API Key yang diinputkan pengguna.'
    },
    actuators: {
      title: 'Actuators (Aktuator)',
      desc: 'Bagaimana agen bertindak/memberikan aksi balik ke lingkungannya. Ini mencakup output respons teks di layar, formatting berkas ekspor (PDF), riwayat aktivitas, dan toast notifikasi visual.'
    },
    reasoning: {
      title: 'Reasoning Engine (Mesin Penalaran)',
      desc: 'Pusat kognitif agen. Menghubungkan input dari sensor ke model bahasa besar (melalui API OpenRouter) dan memicu pemrosesan lokal (seperti visual solver CSP, Forward Chaining aturan logika, dan BFS STRIPS).'
    },
    knowledge: {
      title: 'Knowledge Base & Memory (Basis Pengetahuan)',
      desc: 'Penyimpanan informasi internal agen. Mencakup draf prompt bawaan (PROMPTS), riwayat sesi pencarian yang disimpan di LocalStorage, dan status konfigurasi aplikasi (tema gelap/terang, API Key).'
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* PEAS DESIGN TABLE */}
      <div className="lg:col-span-5 space-y-4">
        <Card className="bg-card border-border/40 rounded-xl overflow-hidden shadow-xs">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-widest">
              <Brain className="h-4 w-4 text-primary" />
              Pemodelan Agen PEAS
            </CardTitle>
            <CardDescription className="text-[11px] text-muted-foreground mt-0.5">
              Deskripsi formal sistem agen cerdas berdasarkan parameter PEAS.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 text-xs">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-border/40 bg-muted/20 font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
                  <th className="p-3">PEAS</th>
                  <th className="p-3">Deskripsi di CampusMate AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                <tr>
                  <td className="p-3 font-bold text-primary">Performance (P)</td>
                  <td className="p-3 leading-relaxed text-foreground">
                    Kecepatan respons, tingkat relevansi jawaban AI terhadap studi, akurasi pemecahan jadwal belajar, kelancaran navigasi.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-primary">Environment (E)</td>
                  <td className="p-3 leading-relaxed text-foreground">
                    Halaman web peramban (browser), dokumen teks studi mahasiswa, masukan input keyboard/klik, respon endpoint API OpenRouter.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-primary">Actuators (A)</td>
                  <td className="p-3 leading-relaxed text-foreground">
                    Penayangan teks terformat Markdown, penyusunan berkas PDF akademik, penyimpanan data riwayat sesi (Zustand/local storage).
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-primary">Sensors (S)</td>
                  <td className="p-3 leading-relaxed text-foreground">
                    Form isian input, checkbox fakta akademik, pengaturan parameter model, tombol generator, deteksi klik navigasi pengguna.
                  </td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* AGENT CLASSIFICATION */}
        <Card className="bg-card border-border/40 rounded-xl overflow-hidden shadow-xs">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-widest">
              <Cpu className="h-4 w-4 text-primary" />
              Klasifikasi Jenis Agen
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs leading-relaxed text-muted-foreground">
            <p>
              CampusMate AI tergolong sebagai <strong>Goal-Based Agent</strong> (Agen Berbasis Tujuan) dan <strong>Utility-Based Agent</strong>.
            </p>
            <p>
              Agen tidak sekadar merespon secara refleks, melainkan mencocokkan input mahasiswa terhadap **Goal** tertentu (misalnya, membuat draf surel yang sopan, menyusun jadwal belajar seimbang, atau meneliti ide riset).
            </p>
            <p>
              Modul simulator di lab ini juga menunjukkan agen yang menyelesaikan tujuan terstruktur menggunakan **Heuristic Search / Backtracking** (dalam CSP) dan **Logical Deduction** (pada forward chaining).
            </p>
          </CardContent>
        </Card>
      </div>

      {/* INTERACTIVE AGENT DIAGRAM */}
      <div className="lg:col-span-7 space-y-4">
        <Card className="bg-card border-border/40 rounded-xl overflow-hidden shadow-xs">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-widest">
              <Cpu className="h-4 w-4 text-primary" />
              Bagan Interaktif Lingkaran Penalaran Agen
            </CardTitle>
            <CardDescription className="text-[11px] text-muted-foreground mt-0.5">
              Klik salah satu komponen arsitektur agen di bawah untuk melihat detail penjelasannya.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 flex flex-col justify-between h-96">
            
            {/* Interactive SVG Diagram */}
            <div className="flex-1 flex flex-col items-center justify-center relative py-6">
              
              <div className="grid grid-cols-3 gap-6 w-full max-w-md items-center justify-center text-center">
                
                {/* Column 1: Env & UI */}
                <div className="flex flex-col gap-12 items-center justify-center">
                  <button
                    onClick={() => setSelectedComponent('sensors')}
                    className={`w-24 h-16 border rounded-xl flex flex-col items-center justify-center p-1 transition-all ${
                      selectedComponent === 'sensors' ? 'border-primary bg-primary/10 font-bold scale-105' : 'border-border/40 bg-muted/10 hover:bg-muted/30'
                    } cursor-pointer`}
                  >
                    <Badge variant="outline" className="text-[8px] px-1 border-none bg-primary/20 text-primary mb-1">Sensor</Badge>
                    <span className="text-[10px] text-foreground">Sensors</span>
                  </button>

                  <button
                    onClick={() => setSelectedComponent('actuators')}
                    className={`w-24 h-16 border rounded-xl flex flex-col items-center justify-center p-1 transition-all ${
                      selectedComponent === 'actuators' ? 'border-primary bg-primary/10 font-bold scale-105' : 'border-border/40 bg-muted/10 hover:bg-muted/30'
                    } cursor-pointer`}
                  >
                    <Badge variant="outline" className="text-[8px] px-1 border-none bg-emerald-500/20 text-emerald-500 mb-1">Aktuator</Badge>
                    <span className="text-[10px] text-foreground">Actuators</span>
                  </button>
                </div>

                {/* Column 2: Arrows / Connection */}
                <div className="flex flex-col items-center justify-center gap-12 font-mono text-[9px] text-muted-foreground/60">
                  <div className="flex items-center gap-1 w-full justify-center">
                    <span className="animate-pulse">Input</span>
                    <ArrowRight className="h-3.5 w-3.5 text-primary" />
                  </div>
                  
                  <div className="flex items-center gap-1 w-full justify-center">
                    <ArrowRight className="h-3.5 w-3.5 text-emerald-500 rotate-180" />
                    <span className="animate-pulse">Action</span>
                  </div>
                </div>

                {/* Column 3: Agent Core */}
                <div className="flex flex-col gap-12 items-center justify-center">
                  <button
                    onClick={() => setSelectedComponent('reasoning')}
                    className={`w-24 h-16 border rounded-xl flex flex-col items-center justify-center p-1 transition-all ${
                      selectedComponent === 'reasoning' ? 'border-primary bg-primary/10 font-bold scale-105' : 'border-border/40 bg-muted/10 hover:bg-muted/30'
                    } cursor-pointer`}
                  >
                    <Badge variant="outline" className="text-[8px] px-1 border-none bg-amber-500/20 text-amber-500 mb-1">Kognitif</Badge>
                    <span className="text-[10px] text-foreground leading-tight">Reasoning Engine</span>
                  </button>

                  <button
                    onClick={() => setSelectedComponent('knowledge')}
                    className={`w-24 h-16 border rounded-xl flex flex-col items-center justify-center p-1 transition-all ${
                      selectedComponent === 'knowledge' ? 'border-primary bg-primary/10 font-bold scale-105' : 'border-border/40 bg-muted/10 hover:bg-muted/30'
                    } cursor-pointer`}
                  >
                    <Badge variant="outline" className="text-[8px] px-1 border-none bg-indigo-500/20 text-indigo-500 mb-1">Memori</Badge>
                    <span className="text-[10px] text-foreground">Knowledge Base</span>
                  </button>
                </div>

              </div>

            </div>

            {/* Explanation Area */}
            <div className="p-3.5 bg-muted/20 border border-border/40 rounded-xl min-h-24 transition-all">
              {selectedComponent ? (
                <div className="space-y-1">
                  <h4 className="font-bold text-foreground text-xs flex items-center gap-1">
                    <Check className="h-3.5 w-3.5 text-primary" />
                    {components[selectedComponent].title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {components[selectedComponent].desc}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground text-[11px] italic h-full justify-center py-6">
                  <HelpCircle className="h-4 w-4" />
                  Klik salah satu blok diagram di atas untuk melihat detail deskripsi arsitektur agen cerdas.
                </div>
              )}
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}
