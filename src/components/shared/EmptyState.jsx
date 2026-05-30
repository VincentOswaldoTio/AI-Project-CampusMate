import { FileQuestion } from 'lucide-react'

/**
 * Komponen empty state untuk ditampilkan saat belum ada konten output.
 * 
 * @param {Object} props
 * @param {string} props.title - Judul pesan kosong
 * @param {string} props.description - Deskripsi/instruksi cara pakai
 */
export default function EmptyState({ 
  title = 'Belum ada hasil', 
  description = 'Masukkan teks atau pertanyaan Anda, lalu tekan tombol untuk menghasilkan output dari AI.' 
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="p-4 rounded-2xl bg-muted/50 text-muted-foreground mb-5">
        <FileQuestion className="h-10 w-10" />
      </div>
      
      <h3 className="text-lg font-bold text-foreground mb-2 tracking-tight">
        {title}
      </h3>
      
      <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
        {description}
      </p>
    </div>
  )
}
