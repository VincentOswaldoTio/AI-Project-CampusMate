import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  GraduationCap, 
  Home, 
  History, 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  BookMarked, 
  Sparkles, 
  CheckCircle2, 
  Heart, 
  Calendar
} from 'lucide-react'
import { useApiStore } from '@/store/apiStore'
import { cn } from '@/lib/utils'

export default function Sidebar() {
  const location = useLocation()
  const { isConnected } = useApiStore()

  // 7 Kategori Collapsible untuk 20 Fitur Akademik
  const categories = [
    {
      name: "Manipulasi Teks",
      icon: FileText,
      items: [
        { name: "Smart Summarizer", path: "/features/smart-summarizer" },
        { name: "Academic Paraphraser", path: "/features/academic-paraphraser" },
        { name: "Grammar & PUEBI Fixer", path: "/features/grammar-fixer" },
        { name: "Tone Transformer", path: "/features/tone-transformer" },
      ]
    },
    {
      name: "Riset & Struktur",
      icon: BookMarked,
      items: [
        { name: "Research Idea Generator", path: "/features/research-idea-generator" },
        { name: "Automatic Outline", path: "/features/automatic-outline" },
        { name: "Literature Review Helper", path: "/features/literature-review-helper" },
        { name: "Argument Builder", path: "/features/argument-builder" },
      ]
    },
    {
      name: "Penulisan Ilmiah",
      icon: Sparkles,
      items: [
        { name: "Abstract Translator", path: "/features/abstract-translator" },
        { name: "Citation Formatter", path: "/features/citation-formatter" },
        { name: "Data Explainer", path: "/features/data-explainer" },
        { name: "Reference Keywords", path: "/features/reference-keywords" },
      ]
    },
    {
      name: "Belajar & Studi",
      icon: GraduationCap,
      items: [
        { name: "Concept Simplifier", path: "/features/concept-simplifier" },
        { name: "Exam Prep Questioner", path: "/features/exam-prep-questioner" },
      ]
    },
    {
      name: "Produktivitas",
      icon: CheckCircle2,
      items: [
        { name: "Dosen Email Drafter", path: "/features/dosen-email-drafter" },
        { name: "Action Item Extractor", path: "/features/action-item-extractor" },
        { name: "Presentation Script", path: "/features/presentation-script" },
      ]
    },
    {
      name: "Kesejahteraan",
      icon: Heart,
      items: [
        { name: "Motivation & Wellness", path: "/features/motivation-wellness" },
      ]
    },
    {
      name: "Manajemen Akademik",
      icon: Calendar,
      items: [
        { name: "Thesis Progress Tracker", path: "/features/thesis-progress-tracker" },
        { name: "Study Schedule Generator", path: "/features/study-schedule-generator" },
      ]
    }
  ]

  // Status collapsible (kategori pertama dibuka secara default, sisanya ditutup)
  const [expanded, setExpanded] = useState({
    "Manipulasi Teks": true,
    "Riset & Struktur": false,
    "Penulisan Ilmiah": false,
    "Belajar & Studi": false,
    "Produktivitas": false,
    "Kesejahteraan": false,
    "Manajemen Akademik": false,
  })

  const toggleCategory = (name) => {
    setExpanded((prev) => ({
      ...prev,
      [name]: !prev[name]
    }))
  }

  const isActive = (path) => location.pathname === path

  return (
    <aside className="w-[240px] h-screen bg-card border-r border-border/40 flex flex-col justify-between fixed left-0 top-0 z-35 select-none transition-colors duration-300">
      
      {/* Bagian Atas: Logo & Navigasi Utama */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Logo dengan Subtle Header Gradient */}
        <div className="px-5 py-3.5 border-b border-border/40 bg-gradient-to-b from-primary/5 to-transparent flex items-center gap-2.5">
          <div className="p-1 bg-primary rounded-md text-white">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="font-bold text-[0.9375rem] tracking-tight bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            CampusMate <span className="text-foreground">AI</span>
          </span>
        </div>

        {/* List Menu - Scrollable, Compact spacing (4px) */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 scrollbar-thin">
          
          {/* Navigasi Utama */}
          <div className="space-y-1">
            <span className="px-2.5 text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground/60 block mb-1">
              Menu Utama
            </span>
            <Link to="/" className={cn(
              "flex items-center gap-2.5 px-3 h-8 rounded-md text-[0.8125rem] font-medium transition-all duration-150 ease-out",
              isActive("/") 
                ? "bg-primary/10 border-l-2 border-primary rounded-l-none text-primary font-semibold" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}>
              <Home className="h-3.5 w-3.5" />
              <span>Beranda</span>
            </Link>
            
            <Link to="/history" className={cn(
              "flex items-center gap-2.5 px-3 h-8 rounded-md text-[0.8125rem] font-medium transition-all duration-150 ease-out",
              isActive("/history") 
                ? "bg-primary/10 border-l-2 border-primary rounded-l-none text-primary font-semibold" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}>
              <History className="h-3.5 w-3.5" />
              <span>Riwayat</span>
            </Link>

            <Link to="/settings" className={cn(
              "flex items-center gap-2.5 px-3 h-8 rounded-md text-[0.8125rem] font-medium transition-all duration-150 ease-out",
              isActive("/settings") 
                ? "bg-primary/10 border-l-2 border-primary rounded-l-none text-primary font-semibold" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}>
              <Settings className="h-3.5 w-3.5" />
              <span>Pengaturan</span>
            </Link>
          </div>

          {/* Kategori Akademis Collapsible */}
          <div className="space-y-2">
            <span className="px-2.5 text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground/60 block mb-1">
              Fitur Akademik
            </span>
            
            <div className="space-y-0.5">
              {categories.map((cat, idx) => {
                const CatIcon = cat.icon
                const isExpanded = expanded[cat.name]
                const isSubActive = cat.items.some(item => isActive(item.path))
                
                return (
                  <div key={idx} className="space-y-0.5">
                    {/* Collapsible Header (32px height) */}
                    <button
                      onClick={() => toggleCategory(cat.name)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 h-8 rounded-md text-[0.75rem] font-semibold tracking-wide transition-all duration-150 hover:bg-muted/30",
                        isSubActive ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <CatIcon className="h-3.5 w-3.5" />
                        <span>{cat.name}</span>
                      </div>
                      {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </button>

                    {/* Collapsible Items (Compact sub-menu) */}
                    {isExpanded && (
                      <div className="pl-5 pr-1 py-0.5 space-y-0.5 border-l border-border/40 ml-3.5">
                        {cat.items.map((item, itemIdx) => (
                          <Link
                            key={itemIdx}
                            to={item.path}
                            className={cn(
                              "block px-2.5 h-7 flex items-center rounded-md text-[0.75rem] font-medium transition-all truncate duration-150",
                              isActive(item.path)
                                ? "bg-primary/10 border-l-2 border-primary rounded-l-none text-primary font-semibold"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                            )}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Bagian Bawah: Indikator Status API */}
      <div className="p-3 border-t border-border/40 bg-muted/10">
        <div className="flex items-center gap-2 px-1">
          <div className="relative flex items-center">
            <span className={cn(
              "h-1.5 w-1.5 rounded-full absolute",
              isConnected ? "bg-emerald-500 animate-ping opacity-75" : "bg-rose-500"
            )}></span>
            <span className={cn(
              "h-1.5 w-1.5 rounded-full relative",
              isConnected ? "bg-emerald-500" : "bg-rose-500"
            )}></span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-[8px] text-muted-foreground/80 font-bold leading-none uppercase tracking-wider">
              API STATUS
            </span>
            <span className="text-[10px] font-bold text-foreground leading-tight mt-0.5">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
      </div>

    </aside>
  )
}
