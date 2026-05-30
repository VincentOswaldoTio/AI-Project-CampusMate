import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const CATEGORY_COLORS = {
  'Manipulasi Teks': '#2563EB',      // Biru
  'Riset & Struktur': '#7C3AED',     // Ungu
  'Penulisan Ilmiah': '#4F46E5',     // Indigo
  'Belajar & Studi': '#059669',      // Hijau
  'Produktivitas': '#D97706',        // Oranye
  'Kesejahteraan': '#DB2777',        // Pink
  'Manajemen Akademik': '#0D9488'    // Teal
}

/**
 * FeatureCard Component
 * Menampilkan kartu alat kerja akademik yang indah dengan aksen warna kategori di sisi kiri.
 */
function FeatureCard({ title, description, category, path, color }) {
  // Gunakan warna dari props jika disediakan, jika tidak cari berdasarkan kategori
  const accentColor = color || CATEGORY_COLORS[category] || '#64748B'

  return (
    <Link to={`/features/${path}`} className="block h-full group">
      <Card 
        className="h-full border-l-4 bg-gradient-to-br from-card to-muted/5 hover:to-muted/10 border-y-border/40 border-r-border/40 hover:border-y-border/60 hover:border-r-border/60 hover:shadow-md hover:shadow-primary/5 transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between overflow-hidden rounded-xl cursor-pointer"
        style={{ borderLeftColor: accentColor }}
      >
        <CardHeader className="p-4 space-y-2 flex-grow">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span 
              className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ 
                backgroundColor: `${accentColor}10`, // Opacity 10%
                color: accentColor 
              }}
            >
              {category}
            </span>
          </div>
          
          <CardTitle className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
            {title}
          </CardTitle>
          
          <CardDescription className="text-[12px] text-muted-foreground line-clamp-2 leading-relaxed mt-1">
            {description}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}

export default FeatureCard
