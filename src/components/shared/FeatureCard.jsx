import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  FileText, 
  RefreshCw, 
  CheckSquare, 
  MessageSquare, 
  Lightbulb, 
  ListCollapse, 
  BookOpen, 
  Scale, 
  Languages, 
  Bookmark, 
  BarChart3, 
  Search, 
  Compass, 
  HelpCircle, 
  Mail, 
  ClipboardList, 
  Tv, 
  Heart, 
  GraduationCap, 
  Calendar,
  ArrowRight
} from 'lucide-react'

const CATEGORY_COLORS = {
  'Manipulasi Teks': '#2563EB',      // Biru
  'Riset & Struktur': '#7C3AED',     // Ungu
  'Penulisan Ilmiah': '#4F46E5',     // Indigo
  'Belajar & Studi': '#059669',      // Hijau
  'Produktivitas': '#D97706',        // Oranye
  'Kesejahteraan': '#DB2777',        // Pink
  'Manajemen Akademik': '#0D9488'    // Teal
}

const ICON_MAP = {
  'smart-summarizer': FileText,
  'academic-paraphraser': RefreshCw,
  'grammar-fixer': CheckSquare,
  'tone-transformer': MessageSquare,
  'research-idea-generator': Lightbulb,
  'automatic-outline': ListCollapse,
  'literature-review-helper': BookOpen,
  'argument-builder': Scale,
  'abstract-translator': Languages,
  'citation-formatter': Bookmark,
  'data-explainer': BarChart3,
  'reference-keywords': Search,
  'concept-simplifier': Compass,
  'exam-prep-questioner': HelpCircle,
  'dosen-email-drafter': Mail,
  'action-item-extractor': ClipboardList,
  'presentation-script': Tv,
  'motivation-wellness': Heart,
  'thesis-progress-tracker': GraduationCap,
  'study-schedule-generator': Calendar,
}

/**
 * FeatureCard Component
 * Menampilkan kartu alat kerja akademik yang indah dengan aksen warna kategori di sisi kiri.
 */
function FeatureCard({ title, description, category, path, color }) {
  const accentColor = color || CATEGORY_COLORS[category] || '#64748B'
  const IconComponent = ICON_MAP[path] || FileText

  return (
    <Link to={`/features/${path}`} className="block h-full group">
      <Card 
        className="h-full border-l-3 bg-gradient-to-br from-card/95 via-card to-muted/20 hover:to-muted/30 border-y-border/40 border-r-border/40 hover:border-y-border/60 hover:border-r-border/60 hover:shadow-md hover:shadow-primary/5 transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between overflow-hidden rounded-xl cursor-pointer"
        style={{ 
          borderLeftColor: accentColor,
          backgroundImage: `radial-gradient(circle at top right, ${accentColor}0e, transparent 65%)`
        }}
      >
        <CardHeader className="p-4 space-y-2 flex-grow flex flex-col justify-between h-full">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <span 
                className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                style={{ 
                  backgroundColor: `${accentColor}12`, // Opacity ~11%
                  color: accentColor 
                }}
              >
                {category}
              </span>
              <div 
                className="p-1.5 rounded-lg border border-border/10 transition-all duration-300 group-hover:scale-110 group-hover:border-border/30 bg-muted/40 text-muted-foreground group-hover:text-primary"
                style={{
                  color: accentColor,
                  backgroundColor: `${accentColor}0a`
                }}
              >
                <IconComponent className="h-3.5 w-3.5" />
              </div>
            </div>
            
            <CardTitle className="text-xs.5 sm:text-sm font-extrabold text-foreground group-hover:text-primary transition-colors leading-snug">
              {title}
            </CardTitle>
            
            <CardDescription className="text-[11px] text-muted-foreground/80 line-clamp-2 leading-relaxed mt-0.5">
              {description}
            </CardDescription>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/20">
            <span className="text-[9px] font-bold text-muted-foreground/60 group-hover:text-primary transition-colors tracking-widest uppercase">Buka Alat</span>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </div>
        </CardHeader>
      </Card>
    </Link>
  )
}

export default FeatureCard
