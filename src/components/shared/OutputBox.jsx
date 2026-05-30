import { useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.min.css'
import { 
  Copy, 
  Check, 
  FileText, 
  FileDown,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { useExport } from '@/hooks/useExport'
import EmptyState from './EmptyState'

/**
 * Komponen area output AI premium dengan rendering Markdown profesional.
 *
 * @param {Object} props
 * @param {string|null} props.content - Teks hasil AI (null = belum ada)
 * @param {string} props.featureName - Nama fitur untuk label dan ekspor
 * @param {string} props.featureSlug - Slug fitur untuk penamaan file ekspor
 * @param {boolean} props.isLoading - Apakah sedang memproses
 * @param {string} [props.emptyTitle] - Judul custom untuk empty state
 * @param {string} [props.emptyDescription] - Deskripsi custom untuk empty state
 */
export default function OutputBox({ 
  content, 
  featureName = 'CampusMate AI', 
  featureSlug = 'output',
  isLoading = false,
  emptyTitle,
  emptyDescription
}) {
  const [copied, setCopied] = useState(false)
  const { exportToPDF, exportToTXT } = useExport()

  // Timestamp saat ini untuk label
  const timestamp = new Date().toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  // Handler salin ke clipboard
  const handleCopy = async () => {
    if (!content) return
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      toast.success('Teks berhasil disalin ke clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Gagal menyalin teks.')
    }
  }

  // Handler ekspor PDF
  const handleExportPDF = () => {
    if (!content) return
    exportToPDF({ content, title: featureName, feature: featureSlug })
  }

  // Handler ekspor TXT
  const handleExportTXT = () => {
    if (!content) return
    exportToTXT({ content, title: featureName, feature: featureSlug })
  }

  // Handler salin blok kode
  const handleCopyCode = useCallback(async (code) => {
    try {
      await navigator.clipboard.writeText(code)
      toast.success('Kode berhasil disalin!')
    } catch {
      toast.error('Gagal menyalin kode.')
    }
  }, [])

  // --- State: Loading ---
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border/40 bg-[#F6F8FA] dark:bg-[#0D1117] p-5 space-y-4 min-h-[400px] flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-2 justify-center">
          <div className="h-2 w-2 rounded-full bg-primary animate-shimmer" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Sedang memproses dokumen...
          </span>
        </div>
        <div className="space-y-3 px-4">
          <Skeleton className="h-3 w-full rounded-md" />
          <Skeleton className="h-3 w-[92%] rounded-md" />
          <Skeleton className="h-3 w-[78%] rounded-md" />
          <Skeleton className="h-3 w-[85%] rounded-md" />
          <Skeleton className="h-3 w-[60%] rounded-md" />
        </div>
      </div>
    )
  }

  // --- State: Kosong ---
  if (!content) {
    return (
      <div className="rounded-xl border border-dashed border-border/40 bg-muted/5 min-h-[400px] flex items-center justify-center">
        <EmptyState 
          title={emptyTitle || `Hasil ${featureName}`}
          description={emptyDescription || 'Masukkan teks atau pertanyaan Anda di panel sebelah kiri, lalu tekan tombol proses untuk mendapatkan hasil dari AI.'}
        />
      </div>
    )
  }

  // --- State: Ada Konten — Markdown Rendering Profesional ---
  return (
    <div className="rounded-xl border border-border/40 bg-[#F6F8FA] dark:bg-[#0D1117] overflow-hidden min-h-[400px] flex flex-col transition-colors duration-300">
      
      {/* Sticky Action Toolbar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">
            HASIL AI
          </span>
          <div className="flex items-center gap-1 text-muted-foreground border-l border-border/40 pl-2">
            <Clock className="h-3 w-3" />
            <span className="text-[10px] font-semibold">{timestamp}</span>
          </div>
        </div>

        {/* Toolbar Buttons (Max height 36px) */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 px-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted/40 gap-1.5 rounded-md"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Salin</span>
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleExportTXT}
            className="h-8 px-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted/40 gap-1.5 rounded-md"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>TXT</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleExportPDF}
            className="h-8 px-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted/40 gap-1.5 rounded-md"
          >
            <FileDown className="h-3.5 w-3.5" />
            <span>PDF</span>
          </Button>
        </div>
      </div>

      {/* Main Content Area — Markdown Rendered */}
      <div className="flex-1 p-5 select-text overflow-x-auto">
        <div className="cm-prose">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              // Code blocks with copy button
              pre({ children }) {
                // Extract code text for copy
                const codeElement = children?.props
                const codeText = codeElement?.children || ''

                return (
                  <div className="relative group/code my-3">
                    <button
                      onClick={() => handleCopyCode(String(codeText))}
                      className="absolute top-2 right-2 h-7 px-2 rounded-md bg-white/10 hover:bg-white/20 text-[10px] font-bold uppercase tracking-wider text-white/60 hover:text-white/90 opacity-0 group-hover/code:opacity-100 transition-opacity duration-150 flex items-center gap-1"
                    >
                      <Copy className="h-3 w-3" />
                      Salin
                    </button>
                    <pre className="!bg-[#0D1117] dark:!bg-[#161B22] !text-[#E6EDF3] rounded-lg p-4 text-[12px] leading-relaxed overflow-x-auto border border-border/20">
                      {children}
                    </pre>
                  </div>
                )
              },
              // Inline code
              code({ className, children, ...props }) {
                const isInline = !className
                if (isInline) {
                  return (
                    <code className="bg-muted/40 dark:bg-white/10 text-primary dark:text-blue-300 px-1.5 py-0.5 rounded-md text-[12px] font-mono font-semibold" {...props}>
                      {children}
                    </code>
                  )
                }
                return <code className={className} {...props}>{children}</code>
              },
              // Headings
              h1({ children }) {
                return <h1 className="text-xl font-bold text-primary mt-6 mb-3 leading-tight tracking-tight first:mt-0">{children}</h1>
              },
              h2({ children }) {
                return <h2 className="text-lg font-bold text-primary mt-5 mb-2.5 leading-tight tracking-tight border-b border-border/30 pb-1.5">{children}</h2>
              },
              h3({ children }) {
                return <h3 className="text-[15px] font-bold text-foreground mt-4 mb-2 leading-snug">{children}</h3>
              },
              h4({ children }) {
                return <h4 className="text-[13px] font-bold text-foreground mt-3 mb-1.5 leading-snug uppercase tracking-wide">{children}</h4>
              },
              // Paragraphs
              p({ children }) {
                return <p className="text-[13px] leading-[1.8] text-foreground/90 mb-3 last:mb-0">{children}</p>
              },
              // Bold & Italic
              strong({ children }) {
                return <strong className="font-bold text-foreground">{children}</strong>
              },
              em({ children }) {
                return <em className="italic text-foreground/80">{children}</em>
              },
              // Lists
              ul({ children }) {
                return <ul className="list-disc pl-5 space-y-1 mb-3 text-[13px] leading-[1.7] text-foreground/90 marker:text-primary/50">{children}</ul>
              },
              ol({ children }) {
                return <ol className="list-decimal pl-5 space-y-1 mb-3 text-[13px] leading-[1.7] text-foreground/90 marker:text-primary/60 marker:font-semibold">{children}</ol>
              },
              li({ children }) {
                return <li className="pl-1">{children}</li>
              },
              // Blockquote
              blockquote({ children }) {
                return (
                  <blockquote className="border-l-3 border-primary/60 bg-primary/5 dark:bg-primary/10 px-4 py-3 my-3 rounded-r-lg italic text-[13px] leading-relaxed text-foreground/80">
                    {children}
                  </blockquote>
                )
              },
              // Horizontal rule
              hr() {
                return <hr className="border-border/40 my-4" />
              },
              // Tables
              table({ children }) {
                return (
                  <div className="overflow-x-auto my-3 rounded-lg border border-border/40">
                    <table className="w-full text-[12px] border-collapse">
                      {children}
                    </table>
                  </div>
                )
              },
              thead({ children }) {
                return <thead className="bg-muted/30 dark:bg-white/5">{children}</thead>
              },
              th({ children }) {
                return <th className="px-3 py-2 text-left text-[11px] font-bold uppercase tracking-wider text-foreground/70 border-b border-border/40">{children}</th>
              },
              td({ children }) {
                return <td className="px-3 py-2 text-[12px] text-foreground/80 border-b border-border/20">{children}</td>
              },
              tr({ children }) {
                return <tr className="even:bg-muted/10 dark:even:bg-white/[0.02] hover:bg-muted/20 dark:hover:bg-white/5 transition-colors">{children}</tr>
              },
              // Links
              a({ href, children }) {
                return (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 underline underline-offset-2 decoration-primary/30 hover:decoration-primary/60 transition-colors">
                    {children}
                  </a>
                )
              }
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
