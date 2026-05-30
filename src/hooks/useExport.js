import jsPDF from 'jspdf'
import { toast } from 'sonner'

/**
 * Hook untuk mengekspor konten hasil AI ke berbagai format file.
 */
export function useExport() {
  /**
   * Menghasilkan timestamp yang bersih untuk nama file.
   * @returns {string} Format: YYYYMMDD-HHmmss
   */
  const getTimestamp = () => {
    const now = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  }

  /**
   * Mengformat tanggal ke tampilan Indonesia yang rapi.
   * @returns {string} Format: "29 Mei 2026, 10:30"
   */
  const getFormattedDate = () => {
    return new Date().toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * Mengekspor konten ke file PDF dengan layout akademik yang bersih.
   * 
   * @param {Object} params
   * @param {string} params.content - Teks konten yang akan diekspor
   * @param {string} params.title - Judul fitur (misal: 'Smart Summarizer')
   * @param {string} params.feature - Slug fitur untuk nama file
   */
  const exportToPDF = ({ content, title, feature }) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 20
      const maxLineWidth = pageWidth - margin * 2
      const formattedDate = getFormattedDate()

      // --- Header ---
      doc.setFontSize(9)
      doc.setTextColor(100, 116, 139) // text-muted (#64748B)
      doc.text(`CampusMate AI  |  ${title}  |  ${formattedDate}`, margin, 15)

      // Garis pemisah header
      doc.setDrawColor(226, 232, 240) // border (#E2E8F0)
      doc.setLineWidth(0.3)
      doc.line(margin, 18, pageWidth - margin, 18)

      // --- Judul ---
      doc.setFontSize(16)
      doc.setTextColor(15, 23, 42) // text-primary (#0F172A)
      doc.text(title, margin, 28)

      // --- Konten ---
      doc.setFontSize(10)
      doc.setTextColor(51, 65, 85) // warna teks gelap yang nyaman dibaca
      
      const lines = doc.splitTextToSize(content, maxLineWidth)
      let y = 36
      const lineHeight = 5

      for (let i = 0; i < lines.length; i++) {
        // Cek apakah perlu pindah halaman
        if (y + lineHeight > pageHeight - 25) {
          // Footer di halaman saat ini
          doc.setFontSize(8)
          doc.setTextColor(148, 163, 184) // text-muted-dark
          doc.text('Dibuat dengan CampusMate AI', margin, pageHeight - 10)
          doc.text(`Halaman ${doc.internal.getNumberOfPages()}`, pageWidth - margin - 15, pageHeight - 10)

          doc.addPage()
          y = 20
        }

        doc.setFontSize(10)
        doc.setTextColor(51, 65, 85)
        doc.text(lines[i], margin, y)
        y += lineHeight
      }

      // --- Footer halaman terakhir ---
      doc.setFontSize(8)
      doc.setTextColor(148, 163, 184)
      doc.text('Dibuat dengan CampusMate AI', margin, pageHeight - 10)
      doc.text(`Halaman ${doc.internal.getNumberOfPages()}`, pageWidth - margin - 15, pageHeight - 10)

      // Simpan file
      const filename = `campusmate-${feature}-${getTimestamp()}.pdf`
      doc.save(filename)

      toast.success('PDF berhasil diekspor!', {
        description: filename
      })
    } catch (error) {
      toast.error('Gagal mengekspor PDF.', {
        description: error.message
      })
    }
  }

  /**
   * Mengekspor konten ke file TXT.
   * 
   * @param {Object} params
   * @param {string} params.content - Teks konten yang akan diekspor
   * @param {string} params.title - Judul fitur
   * @param {string} params.feature - Slug fitur untuk nama file
   */
  const exportToTXT = ({ content, title, feature }) => {
    try {
      const formattedDate = getFormattedDate()
      
      const textContent = [
        `CampusMate AI | ${title}`,
        `Tanggal: ${formattedDate}`,
        '='.repeat(60),
        '',
        content,
        '',
        '='.repeat(60),
        'Dibuat dengan CampusMate AI'
      ].join('\n')

      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      
      const filename = `campusmate-${feature}-${getTimestamp()}.txt`
      
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('TXT berhasil diekspor!', {
        description: filename
      })
    } catch (error) {
      toast.error('Gagal mengekspor TXT.', {
        description: error.message
      })
    }
  }

  return { exportToPDF, exportToTXT }
}
