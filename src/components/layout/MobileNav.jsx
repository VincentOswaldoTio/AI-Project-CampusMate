import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  History, 
  Settings, 
  Grid,
  ChevronRight,
  FileText,
  BookMarked,
  Sparkles,
  GraduationCap,
  CheckCircle2,
  Heart,
  Calendar,
  X,
  Beaker
} from 'lucide-react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export default function MobileNav() {
  const location = useLocation()
  const [sheetOpen, setSheetOpen] = useState(false)

  // 7 Kategori untuk 20 Fitur
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

  const isActive = (path) => location.pathname === path

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border z-40 flex items-center justify-around px-2 shadow-lg transition-colors duration-300">
      
      {/* Tab 1: Beranda */}
      <Link to="/" className={cn(
        "flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold tracking-tight transition-all duration-200",
        isActive("/") ? "text-primary" : "text-muted-foreground"
      )}>
        <Home className="h-5 w-5 mb-0.5" />
        <span>Beranda</span>
      </Link>

      {/* Tab 2: AI Lab */}
      <Link to="/ai-sandbox" className={cn(
        "flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold tracking-tight transition-all duration-200",
        isActive("/ai-sandbox") ? "text-primary" : "text-muted-foreground"
      )}>
        <Beaker className="h-5 w-5 mb-0.5" />
        <span>AI Lab</span>
      </Link>

      {/* Tab 2: Fitur (Membuka Bottom Sheet) */}
      <Dialog open={sheetOpen} onOpenChange={setSheetOpen}>
        <DialogTrigger asChild>
          <button className={cn(
            "flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold tracking-tight transition-all duration-200 text-muted-foreground hover:text-foreground"
          )}>
            <Grid className="h-5 w-5 mb-0.5" />
            <span>Fitur</span>
          </button>
        </DialogTrigger>
        
        {/* Custom dialog content styled as a premium Bottom Sheet */}
        <DialogContent 
          showCloseButton={false}
          className="fixed bottom-0 top-auto left-0 -translate-x-0 -translate-y-0 w-full max-w-full rounded-t-3xl rounded-b-none bg-card border-t border-border max-h-[80vh] overflow-y-auto p-0 animate-in slide-in-from-bottom duration-300 focus:outline-none"
        >
          {/* Bottom Sheet Handle */}
          <div className="flex justify-center py-2.5">
            <div className="w-12 h-1.5 bg-muted rounded-full"></div>
          </div>

          {/* Dialog Header */}
          <div className="px-6 pb-4 border-b border-border flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-extrabold tracking-tight">Eksplorasi Fitur AI</DialogTitle>
              <p className="text-xs text-muted-foreground">Pilih dari 20 asisten akademik terbaik kami</p>
            </div>
            
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full border border-border h-8 w-8 text-muted-foreground">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>

          {/* Grid Kategori Fitur - Scrollable */}
          <div className="px-6 py-6 space-y-6 overflow-y-auto max-h-[calc(80vh-80px)] scrollbar-none pb-12">
            {categories.map((cat, idx) => {
              const CatIcon = cat.icon
              return (
                <div key={idx} className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <CatIcon className="h-3.5 w-3.5 text-primary" />
                    <span>{cat.name}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {cat.items.map((item, itemIdx) => (
                      <Link
                        key={itemIdx}
                        to={item.path}
                        onClick={() => setSheetOpen(false)} // Close sheet on navigate
                        className={cn(
                          "flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all border border-border/60 hover:bg-muted/50",
                          isActive(item.path)
                            ? "bg-primary/5 text-primary border-primary/30 font-bold"
                            : "bg-muted/10 text-foreground"
                        )}
                      >
                        <span>{item.name}</span>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

        </DialogContent>
      </Dialog>

      {/* Tab 3: Riwayat */}
      <Link to="/history" className={cn(
        "flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold tracking-tight transition-all duration-200",
        isActive("/history") ? "text-primary" : "text-muted-foreground"
      )}>
        <History className="h-5 w-5 mb-0.5" />
        <span>Riwayat</span>
      </Link>

      {/* Tab 4: Pengaturan */}
      <Link to="/settings" className={cn(
        "flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold tracking-tight transition-all duration-200",
        isActive("/settings") ? "text-primary" : "text-muted-foreground"
      )}>
        <Settings className="h-5 w-5 mb-0.5" />
        <span>Pengaturan</span>
      </Link>

    </nav>
  )
}
