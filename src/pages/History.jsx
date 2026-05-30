import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Trash2, 
  Star, 
  Copy, 
  Check, 
  Search, 
  Clock,
  History as HistoryIcon,
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useHistory } from '@/hooks/useHistory'
import { getRelativeTimestamp, cleanMarkdownForCopy } from '@/lib/utils'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.min.css'

// 7 Kategori Akademis untuk pemetaan dropdown filter
const CATEGORIES = [
  'Manipulasi Teks',
  'Riset & Struktur',
  'Penulisan Ilmiah',
  'Belajar & Studi',
  'Produktivitas',
  'Kesejahteraan',
  'Manajemen Akademik'
]

function History() {
  const { items, removeItem, toggleFavorite, clearAll } = useHistory()

  // State untuk filter responsif
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'favorites'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all') // 'all' | nama kategori

  // State untuk melacak item yang di-expand
  const [expandedItems, setExpandedItems] = useState({}) // { [id]: boolean }
  const [copiedItemId, setCopiedItemId] = useState(null)

  // Toggle status expand kartu
  const handleToggleExpand = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  // Handler Salin Teks
  const handleCopy = async (e, id, text) => {
    e.stopPropagation() // Mencegah memicu expand kartu
    try {
      const cleanText = cleanMarkdownForCopy(text)
      await navigator.clipboard.writeText(cleanText)
      setCopiedItemId(id)
      toast.success("Teks berhasil disalin ke clipboard!")
      setTimeout(() => setCopiedItemId(null), 2000)
    } catch {
      toast.error("Gagal menyalin teks.")
    }
  }

  // Handler Hapus Item Tunggal
  const handleRemove = (e, id, featureName) => {
    e.stopPropagation() // Mencegah memicu expand kartu
    removeItem(id)
    toast.error("Item riwayat telah dihapus", {
      description: `Riwayat ${featureName} berhasil dibersihkan.`
    })
  }

  // Handler Ubah Status Favorit
  const handleToggleFav = (e, id, featureName, currentFav) => {
    e.stopPropagation() // Mencegah memicu expand kartu
    toggleFavorite(id)
    toast.success(currentFav ? "Dihapus dari favorit" : "Ditambahkan ke favorit", {
      description: featureName
    })
  }

  // Filter & Search Responsif (useMemo untuk kecepatan maksimal tanpa lag)
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Filter Tab (Semua vs Favorit)
      if (activeTab === 'favorites' && !item.favorite) {
        return false
      }

      // 2. Filter Kategori
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false
      }

      // 3. Filter Search (Cari di nama fitur atau output hasil AI)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase()
        const matchesFeature = item.featureName.toLowerCase().includes(query)
        const matchesOutput = item.output.toLowerCase().includes(query)
        
        if (!matchesFeature && !matchesOutput) {
          return false
        }
      }

      return true
    })
  }, [items, activeTab, selectedCategory, searchQuery])

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-border/40 hover:bg-muted transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <HistoryIcon className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-extrabold tracking-tight text-foreground">Riwayat Penggunaan</h1>
              <Badge variant="secondary" className="px-2 py-0.5 text-[10px] font-bold bg-primary/10 text-primary border-none">
                {items.length} Total
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Log aktivitas terstruktur dari seluruh generasi dan tugas perkuliahan AI Anda.
            </p>
          </div>
        </div>

        {/* Tombol Hapus Semua dengan AlertDialog */}
        {items.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                className="h-9 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm w-full sm:w-auto"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Hapus Semua
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-xl border-border bg-card">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-foreground">Apakah Anda yakin?</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground text-xs leading-relaxed">
                  Tindakan ini bersifat permanen dan tidak dapat dibatalkan. Seluruh log riwayat aktivitas penggunaan akademik Anda akan dihapus secara total dari perangkat ini.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-lg border-border hover:bg-muted text-xs">
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={clearAll} 
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs"
                >
                  Hapus Permanen
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <Separator className="border-border/30" />

      {/* FILTER BAR & TABS - Compact & Responsif */}
      <div className="space-y-3 bg-gradient-to-br from-card to-muted/5 p-4 rounded-xl border border-border/40 shadow-xs">
        
        {/* Tab Selector (Semua | Favorit) */}
        <div className="flex border-b border-border/40 pb-2 gap-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`text-xs font-bold uppercase tracking-wider pb-1 transition-all relative ${
              activeTab === 'all' 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Semua Riwayat
            {activeTab === 'all' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`text-xs font-bold uppercase tracking-wider pb-1 transition-all relative ${
              activeTab === 'favorites' 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Favorit
            {activeTab === 'favorites' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </div>

        {/* Inputs (Search & Category Dropdown) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Input Pencarian */}
          <div className="relative flex items-center md:col-span-2">
            <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground/60" />
            <Input
              type="text"
              placeholder="Cari kata kunci di isi output atau nama fitur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 rounded-lg border-border/40 bg-muted/5 text-xs text-foreground focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          {/* Dropdown Kategori */}
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-muted-foreground/60 flex-shrink-0 hidden sm:inline" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="rounded-lg border-border/40 bg-muted/10 text-xs h-9">
                <SelectValue placeholder="Pilih Kategori..." />
              </SelectTrigger>
              <SelectContent className="border-border/40">
                <SelectItem value="all">Semua Kategori</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* RENDER LIST RIWAYAT */}
      {filteredItems.length === 0 ? (
        /* EMPTY STATE - Menangani 2 skenario spesifik */
        items.length === 0 ? (
          /* Skenario A: Kosong Total */
          <Card className="border-dashed border border-border/40 bg-muted/5 text-center p-12 rounded-xl">
            <CardContent className="p-4 flex flex-col items-center justify-center space-y-4">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <HistoryIcon className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">Belum Ada Aktivitas</h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                  Log aktivitas perkuliahan Anda kosong. Silakan gunakan salah satu fitur AI pada menu Beranda untuk mulai menganalisis tugas dan melihat hasilnya di sini.
                </p>
              </div>
              <Link to="/">
                <Button className="h-9 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold uppercase tracking-wider px-6 rounded-lg shadow-sm">
                  Kembali ke Beranda
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          /* Skenario B: Filter Aktif Tapi Tidak Ketemu */
          <Card className="border border-border/40 bg-muted/5 text-center p-12 rounded-xl">
            <CardContent className="p-4 flex flex-col items-center justify-center space-y-3">
              <div className="p-2.5 bg-amber-500/10 rounded-full text-amber-500">
                <Search className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">Tidak Ada Hasil Cocok</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Pencarian kata kunci <strong className="text-foreground">"{searchQuery}"</strong> atau filter kategori <strong className="text-foreground">"{selectedCategory === 'all' ? 'Semua' : selectedCategory}"</strong> tidak menemukan log riwayat yang sesuai.
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                  setActiveTab('all')
                }}
                className="h-8 text-xs font-semibold rounded-lg border-border/40"
              >
                Reset Filter Pencarian
              </Button>
            </CardContent>
          </Card>
        )
      ) : (
        /* DAFTAR ITEM LOG AKTIVITAS - Bersih, Padat, Mudah Di-scan */
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const isExpanded = !!expandedItems[item.id]

            return (
              <Card 
                key={item.id} 
                onClick={() => handleToggleExpand(item.id)}
                className={`bg-gradient-to-br from-card to-muted/5 hover:to-muted/10 border-border/40 hover:border-border/60 transition-all duration-200 rounded-xl overflow-hidden cursor-pointer select-none relative ${
                  isExpanded ? 'ring-1 ring-primary/30 shadow-sm' : ''
                }`}
              >
                <CardContent className="p-4 space-y-2.5">
                  
                  {/* Baris Atas: Nama Fitur & Badge Kategori */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground tracking-tight group-hover:text-primary transition-colors">
                        {item.featureName}
                      </span>
                      <Badge className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider bg-muted text-muted-foreground border-none rounded-md">
                        {item.category}
                      </Badge>
                    </div>

                    {/* Tombol Aksi Kanan (Salin, Favorit, Hapus) */}
                    <div className="flex items-center gap-1">
                      {/* Tombol Favorit */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => handleToggleFav(e, item.id, item.featureName, item.favorite)}
                        className={`h-7 w-7 rounded-md ${
                          item.favorite 
                            ? 'text-amber-500 hover:text-amber-600 bg-amber-500/5' 
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                        }`}
                      >
                        <Star className="h-3.5 w-3.5" fill={item.favorite ? "currentColor" : "none"} />
                      </Button>

                      {/* Tombol Salin */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => handleCopy(e, item.id, item.output)}
                        className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      >
                        {copiedItemId === item.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>

                      {/* Tombol Hapus */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => handleRemove(e, item.id, item.featureName)}
                        className="h-7 w-7 rounded-md text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Konten Log (Muted, Dibatasi Karakter / Preview) */}
                  <div className="space-y-1.5 font-sans">
                    {!isExpanded ? (
                      /* Preview Mode (150 karakter) */
                      <p className="text-xs text-muted-foreground/80 leading-relaxed font-sans line-clamp-2 pr-4">
                        {item.output.length > 150 ? item.output.substring(0, 150) + '...' : item.output}
                      </p>
                    ) : (
                      /* Expanded Mode (Markdown Rendered ala OutputBox) */
                      <div className="bg-[#F6F8FA] dark:bg-[#0D1117] border border-border/40 p-4 rounded-lg text-[12px] leading-relaxed overflow-x-auto transition-all select-text" onClick={(e) => e.stopPropagation()}>
                        <div className="cm-prose select-text">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                            components={{
                              p({ children }) {
                                return <p className="text-[12px] leading-[1.7] text-foreground/90 mb-2 last:mb-0">{children}</p>
                              },
                              h1({ children }) {
                                return <h1 className="text-[14px] font-bold text-primary mt-4 mb-2 first:mt-0">{children}</h1>
                              },
                              h2({ children }) {
                                return <h2 className="text-[13px] font-bold text-primary mt-3.5 mb-1.5 first:mt-0 border-b border-border/20 pb-1">{children}</h2>
                              },
                              h3({ children }) {
                                return <h3 className="text-[12.5px] font-bold text-foreground mt-3 mb-1 first:mt-0">{children}</h3>
                              },
                              ul({ children }) {
                                return <ul className="list-disc pl-4 space-y-0.5 mb-2 text-[12px] leading-[1.6] marker:text-primary/60">{children}</ul>
                              },
                              ol({ children }) {
                                return <ol className="list-decimal pl-4 space-y-0.5 mb-2 text-[12px] leading-[1.6] marker:text-primary/60 marker:font-semibold">{children}</ol>
                              },
                              li({ children }) {
                                return <li className="pl-0.5">{children}</li>
                              },
                              strong({ children }) {
                                return <strong className="font-bold text-foreground">{children}</strong>
                              },
                              em({ children }) {
                                return <em className="italic text-foreground/80">{children}</em>
                              },
                              blockquote({ children }) {
                                return (
                                  <blockquote className="border-l-2 border-primary/60 bg-primary/5 dark:bg-primary/10 px-3 py-1.5 my-2 rounded-r-md italic text-[12px] leading-relaxed text-foreground/80">
                                    {children}
                                  </blockquote>
                                )
                              },
                              pre({ children }) {
                                return (
                                  <pre className="!bg-[#0D1117] dark:!bg-[#161B22] !text-[#E6EDF3] rounded-md p-3 text-[11px] leading-relaxed overflow-x-auto border border-border/20 my-2">
                                    {children}
                                  </pre>
                                )
                              },
                              code({ className, children, ...props }) {
                                const isInline = !className
                                if (isInline) {
                                  return (
                                    <code className="bg-muted/40 dark:bg-white/10 text-primary dark:text-blue-300 px-1 py-0.5 rounded text-[11px] font-mono font-semibold" {...props}>
                                      {children}
                                    </code>
                                  )
                                }
                                return <code className={className} {...props}>{children}</code>
                              },
                              table({ children }) {
                                return (
                                  <div className="overflow-x-auto my-2 rounded border border-border/30">
                                    <table className="w-full text-[11px] border-collapse">
                                      {children}
                                    </table>
                                  </div>
                                )
                              },
                              thead({ children }) {
                                return <thead className="bg-muted/30 dark:bg-white/5">{children}</thead>
                              },
                              th({ children }) {
                                return <th className="px-2.5 py-1.5 text-left text-[10px] font-bold uppercase tracking-wider text-foreground/70 border-b border-border/30">{children}</th>
                              },
                              td({ children }) {
                                return <td className="px-2.5 py-1.5 text-[11px] text-foreground/80 border-b border-border/10">{children}</td>
                              },
                              tr({ children }) {
                                return <tr className="even:bg-muted/5 dark:even:bg-white/[0.01] hover:bg-muted/10 transition-colors">{children}</tr>
                              }
                            }}
                          >
                            {item.output}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Baris Bawah: Timestamp Relatif & Expand Indicator */}
                  <div className="flex items-center justify-between text-[9px] text-muted-foreground font-semibold uppercase tracking-wider pt-1">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground/60" />
                      <span>{getRelativeTimestamp(item.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-0.5 text-primary text-[8px] font-bold">
                      {isExpanded ? (
                        <>
                          <span>TUTUP</span>
                          <ChevronUp className="h-3 w-3" />
                        </>
                      ) : (
                        <>
                          <span>LIHAT LENGKAP</span>
                          <ChevronDown className="h-3 w-3" />
                        </>
                      )}
                    </div>
                  </div>

                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default History
