import { useLocation, Link } from 'react-router-dom'
import { 
  Sun, 
  Moon, 
  ChevronRight, 
  Cpu,
  GraduationCap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useApiStore } from '@/store/apiStore'
import { toast } from 'sonner'

export default function Header() {
  const location = useLocation()
  const { theme, model, toggleTheme } = useApiStore()

  // Mapper Rute ke Nama Breadcrumb
  const getBreadcrumbName = (pathname) => {
    if (pathname === '/') return 'Beranda'
    if (pathname === '/history') return 'Riwayat'
    if (pathname === '/settings') return 'Pengaturan'
    
    if (pathname.startsWith('/features/')) {
      const featureKey = pathname.split('/').pop()
      const featureMap = {
        'smart-summarizer': 'Smart Summarizer',
        'academic-paraphraser': 'Academic Paraphraser',
        'grammar-fixer': 'Grammar & PUEBI Fixer',
        'tone-transformer': 'Tone Transformer',
        'research-idea-generator': 'Research Idea Generator',
        'automatic-outline': 'Automatic Outline',
        'literature-review-helper': 'Literature Review Helper',
        'argument-builder': 'Argument Builder',
        'abstract-translator': 'Abstract Translator',
        'citation-formatter': 'Citation Formatter',
        'data-explainer': 'Data Explainer',
        'reference-keywords': 'Reference Keywords',
        'concept-simplifier': 'Concept Simplifier',
        'exam-prep-questioner': 'Exam Prep Questioner',
        'dosen-email-drafter': 'Dosen Email Drafter',
        'action-item-extractor': 'Action Item Extractor',
        'presentation-script': 'Presentation Script',
        'motivation-wellness': 'Motivation & Wellness',
        'thesis-progress-tracker': 'Thesis Progress Tracker',
        'study-schedule-generator': 'Study Schedule Generator'
      }
      return featureMap[featureKey] || 'Fitur AI'
    }
    return 'Halaman'
  }

  const breadcrumbName = getBreadcrumbName(location.pathname)

  const handleThemeToggle = () => {
    toggleTheme()
    toast.success(`Tema berhasil diubah ke mode ${theme === 'light' ? 'Gelap (Dark)' : 'Terang (Light)'}`, {
      duration: 1500
    })
  }

  return (
    <header className="h-[60px] bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30 transition-colors duration-300">
      
      {/* Bagian Kiri: Breadcrumb Dinamis */}
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1.5">
          <GraduationCap className="h-4 w-4" />
          <span>CampusMate AI</span>
        </Link>
        
        <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
        
        <span className="text-foreground font-bold tracking-tight">
          {breadcrumbName}
        </span>
      </div>

      {/* Bagian Kanan: Model AI & Toggle Tema */}
      <div className="flex items-center gap-4">
        
        {/* Active AI Model Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-muted/40 px-3 py-1.5 rounded-full border border-border">
          <Cpu className="h-3.5 w-3.5 text-primary" />
          <span className="text-[11px] font-bold text-muted-foreground uppercase leading-none">
            Model:
          </span>
          <Badge variant="secondary" className="text-[10px] font-extrabold px-1.5 py-0.5 border-none bg-primary/8 text-primary uppercase">
            {model.split('/').pop()}
          </Badge>
        </div>

        {/* Toggle Theme Sun/Moon */}
        <Button
          variant="outline"
          size="icon"
          onClick={handleThemeToggle}
          className="h-9 w-9 rounded-xl border-border hover:bg-muted text-muted-foreground hover:text-foreground active:scale-95 transition-all"
          title="Ubah Tema"
        >
          {theme === 'dark' ? <Sun className="h-[1.1rem] w-[1.1rem] text-amber-500" /> : <Moon className="h-[1.1rem] w-[1.1rem]" />}
        </Button>
        
      </div>

    </header>
  )
}
