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
   * Mengekspor konten ke file PDF dengan layout akademik formal (Format Skripsi).
   * Menggunakan Times New Roman, batas margin skripsi (4-3-3-3), perataan rata kanan-kiri (justified),
   * tabel bergaris, blok kode terbingkai, list ber-bullet, dan running header/footer.
   * 
   * @param {Object} params
   * @param {string} params.content - Teks konten yang akan diekspor (berformat Markdown)
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

      // Batas Margin Formal Skripsi Indonesia (kiri 40mm untuk jilid, kanan-atas-bawah 30mm)
      const margin = {
        top: 30,
        left: 40,
        right: 30,
        bottom: 30
      }

      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const maxLineWidth = pageWidth - margin.left - margin.right
      const formattedDate = getFormattedDate()

      let y = margin.top + 10
      const paragraphSpacing = 6
      const lineSpacing = 5.5

      // Mengatur font default ke Times New Roman (standar akademik)
      doc.setFont('times', 'normal')

      // Fungsi pembantu mengecek batas bawah halaman (page overflow) dan menambah halaman baru
      const checkPageOverflow = (neededHeight) => {
        if (y + neededHeight > pageHeight - margin.bottom) {
          // Menggambar footer pada halaman aktif sebelum menambah yang baru
          doc.setFont('times', 'italic')
          doc.setFontSize(8.5)
          doc.setTextColor(148, 163, 184)
          doc.text('Draft Akademik - Dibuat secara otomatis dengan CampusMate AI', margin.left, pageHeight - 15)
          doc.text(`Halaman ${doc.internal.getNumberOfPages()}`, pageWidth - margin.right - 12, pageHeight - 15)

          doc.addPage()
          y = margin.top

          // Menggambar header berulang pada halaman baru
          doc.setFont('times', 'italic')
          doc.setFontSize(8)
          doc.setTextColor(100, 116, 139)
          doc.text(`CampusMate AI  |  Draft Skripsi: ${title}`, margin.left, margin.top - 15)
          doc.setDrawColor(226, 232, 240)
          doc.setLineWidth(0.25)
          doc.line(margin.left, margin.top - 12, pageWidth - margin.right, margin.top - 12)
        }
      }

      // --- HEADER HALAMAN PERTAMA ---
      doc.setFont('times', 'italic')
      doc.setFontSize(8)
      doc.setTextColor(100, 116, 139)
      doc.text(`CampusMate AI  |  Draft Skripsi: ${title}  |  Dibuat pada: ${formattedDate}`, margin.left, margin.top - 15)
      doc.setDrawColor(226, 232, 240)
      doc.setLineWidth(0.35)
      doc.line(margin.left, margin.top - 12, pageWidth - margin.right, margin.top - 12)

      // --- JUDUL UTAMA DOKUMEN ---
      doc.setFont('times', 'bold')
      doc.setFontSize(15)
      doc.setTextColor(15, 23, 42)
      doc.text(title.toUpperCase(), margin.left, margin.top - 2)

      // Garis aksen biru di bawah judul
      doc.setDrawColor(59, 130, 246)
      doc.setLineWidth(0.8)
      doc.line(margin.left, margin.top + 1, margin.left + 25, margin.top + 1)

      // Memecah dokumen menjadi baris-baris
      const rawLines = content.split('\n')
      
      let inCodeBlock = false
      let codeBlockContent = []
      
      let inTable = false
      let tableRows = []

      for (let i = 0; i < rawLines.length; i++) {
        let line = rawLines[i].trim()

        // --- 1. Blok Kode (Monospace) ---
        if (line.startsWith('```')) {
          if (inCodeBlock) {
            inCodeBlock = false
            const codeText = codeBlockContent.join('\n')
            doc.setFont('courier', 'normal')
            doc.setFontSize(8.5)
            doc.setTextColor(31, 41, 55)

            const codeLines = doc.splitTextToSize(codeText, maxLineWidth - 10)
            const boxHeight = (codeLines.length * 4) + 6

            checkPageOverflow(boxHeight + 5)

            // Bingkai abu-abu tipis untuk blok kode
            doc.setFillColor(248, 250, 252)
            doc.setDrawColor(226, 232, 240)
            doc.setLineWidth(0.2)
            doc.roundedRect(margin.left, y - 2, maxLineWidth, boxHeight, 1.5, 1.5, 'FD')

            let codeY = y + 2
            codeLines.forEach((cl) => {
              doc.text(cl, margin.left + 5, codeY)
              codeY += 4
            })

            y += boxHeight + 3
            codeBlockContent = []
          } else {
            inCodeBlock = true
          }
          continue
        }

        if (inCodeBlock) {
          codeBlockContent.push(rawLines[i])
          continue
        }

        // --- 2. Tabel Akademik ---
        const isTableRow = line.startsWith('|')
        if (isTableRow) {
          inTable = true
          tableRows.push(line)
          continue
        } else if (inTable && !isTableRow) {
          inTable = false
          if (tableRows.length > 0) {
            // Hapus pemisah horizontal markdown seperti |---|---|
            const cleanRows = tableRows.filter(r => !/^\s*\|[-:| ]+\|\s*$/.test(r))
            
            doc.setFont('times', 'normal')
            doc.setFontSize(9)
            doc.setTextColor(51, 65, 85)

            const parsedRows = cleanRows.map(row => {
              const cells = row.split('|').map(c => c.trim())
              if (cells[0] === '') cells.shift()
              if (cells[cells.length - 1] === '') cells.pop()
              return cells
            })

            if (parsedRows.length > 0) {
              const colCount = parsedRows[0].length
              const colWidth = maxLineWidth / colCount
              const rowHeight = 7

              checkPageOverflow((parsedRows.length * rowHeight) + 6)

              let tableY = y
              parsedRows.forEach((rowCells, rIdx) => {
                const isHeader = rIdx === 0
                doc.setFont('times', isHeader ? 'bold' : 'normal')
                
                // Header dengan latar belakang abu-abu terang
                if (isHeader) {
                  doc.setFillColor(241, 245, 249)
                  doc.rect(margin.left, tableY - 4, maxLineWidth, rowHeight, 'F')
                }

                rowCells.forEach((cellText, cIdx) => {
                  const cellX = margin.left + (cIdx * colWidth)
                  doc.setDrawColor(203, 213, 225)
                  doc.setLineWidth(0.2)
                  doc.rect(cellX, tableY - 4, colWidth, rowHeight, 'D')
                  
                  const cellLines = doc.splitTextToSize(cellText, colWidth - 4)
                  doc.text(cellLines[0] || '', cellX + 2, tableY)
                })

                tableY += rowHeight
              })

              y = tableY + 3
            }
          }
          tableRows = []
        }

        // Lewati baris kosong
        if (line === '') {
          y += 2
          continue
        }

        // --- 3. Kutipan Blok (Blockquote) ---
        if (line.startsWith('>')) {
          const quoteText = line.replace(/^>\s*/, '').trim()
          doc.setFont('times', 'italic')
          doc.setFontSize(10.5)
          doc.setTextColor(71, 85, 105)

          const cleanQuote = quoteText.replace(/\*\*/g, '')
          const wrappedQuote = doc.splitTextToSize(cleanQuote, maxLineWidth - 10)
          const neededHeight = wrappedQuote.length * lineSpacing

          checkPageOverflow(neededHeight + 4)

          // Garis tegak biru disebelah kiri
          doc.setDrawColor(59, 130, 246)
          doc.setLineWidth(0.8)
          doc.line(margin.left + 2, y - 3, margin.left + 2, y - 3 + neededHeight)

          let quoteY = y
          wrappedQuote.forEach((ql) => {
            doc.text(ql, margin.left + 7, quoteY)
            quoteY += lineSpacing
          })

          y = quoteY + 2
          continue
        }

        // --- 4. Heading / Sub-Bab Akademis ---
        const headingMatch = line.match(/^(#{1,4})\s+(.*)$/)
        if (headingMatch) {
          const level = headingMatch[1].length
          const titleText = headingMatch[2].replace(/\*\*/g, '').trim()

          doc.setFont('times', 'bold')
          doc.setTextColor(15, 23, 42)

          let headingSize = 12
          if (level === 1) headingSize = 13.5
          else if (level === 2) headingSize = 12.5
          else headingSize = 11.5

          doc.setFontSize(headingSize)
          checkPageOverflow(8)

          y += 3
          doc.text(titleText, margin.left, y)
          y += 6
          continue
        }

        // --- 5. List Ber-bullet ---
        const listMatch = line.match(/^[-*+•]\s+(.*)$/)
        if (listMatch) {
          const itemText = listMatch[1]
          doc.setFont('times', 'normal')
          doc.setFontSize(11)
          doc.setTextColor(51, 65, 85)

          const cleanItemText = itemText.replace(/\*\*/g, '')
          const wrappedItem = doc.splitTextToSize(cleanItemText, maxLineWidth - 8)
          const neededHeight = wrappedItem.length * lineSpacing

          checkPageOverflow(neededHeight + 2)

          doc.setFont('times', 'bold')
          doc.text('•', margin.left + 2, y)
          
          doc.setFont('times', 'normal')
          let itemY = y
          wrappedItem.forEach((il) => {
            doc.text(il, margin.left + 6, itemY)
            itemY += lineSpacing
          })

          y = itemY + 1
          continue
        }

        // --- 6. List Berangka (Ordered List) ---
        const numListMatch = line.match(/^(\d+)\.\s+(.*)$/)
        if (numListMatch) {
          const num = numListMatch[1]
          const itemText = numListMatch[2]
          doc.setFont('times', 'normal')
          doc.setFontSize(11)
          doc.setTextColor(51, 65, 85)

          const cleanItemText = itemText.replace(/\*\*/g, '')
          const wrappedItem = doc.splitTextToSize(cleanItemText, maxLineWidth - 8)
          const neededHeight = wrappedItem.length * lineSpacing

          checkPageOverflow(neededHeight + 2)

          doc.setFont('times', 'bold')
          doc.text(`${num}.`, margin.left + 1.5, y)
          
          doc.setFont('times', 'normal')
          let itemY = y
          wrappedItem.forEach((il) => {
            doc.text(il, margin.left + 6, itemY)
            itemY += lineSpacing
          })

          y = itemY + 1
          continue
        }

        // --- 7. Paragraf Standar Skripsi (Justified, Indentasi Baris Pertama) ---
        doc.setFont('times', 'normal')
        doc.setFontSize(11)
        doc.setTextColor(51, 65, 85)

        // Indentasi baris pertama skripsi (sekitar 7.5mm) jika berupa paragraf panjang/kontinu
        const isLongParagraph = line.length > 120
        const textIndent = isLongParagraph ? 7.5 : 0

        const cleanParagraph = line.replace(/\*\*/g, '')
        const wrappedParagraph = doc.splitTextToSize(cleanParagraph, maxLineWidth - textIndent)
        const neededHeight = wrappedParagraph.length * lineSpacing

        checkPageOverflow(neededHeight + 2)

        let paraY = y
        wrappedParagraph.forEach((pl, idx) => {
          const currentX = margin.left + (idx === 0 ? textIndent : 0)
          
          // Menggunakan perataan rata kanan-kiri (justified) formal akademis untuk dokumen skripsi!
          doc.text(pl, currentX, paraY, { 
            align: idx === wrappedParagraph.length - 1 ? 'left' : 'justify',
            maxWidth: maxLineWidth - (idx === 0 ? textIndent : 0)
          })
          paraY += lineSpacing
        })

        y = paraY + 2
      }

      // Render sisa tabel yang mungkin masih aktif di baris terakhir dokumen
      if (inTable && tableRows.length > 0) {
        const cleanRows = tableRows.filter(r => !/^\s*\|[-:| ]+\|\s*$/.test(r))
        doc.setFont('times', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(51, 65, 85)

        const parsedRows = cleanRows.map(row => {
          const cells = row.split('|').map(c => c.trim())
          if (cells[0] === '') cells.shift()
          if (cells[cells.length - 1] === '') cells.pop()
          return cells
        })

        if (parsedRows.length > 0) {
          const colCount = parsedRows[0].length
          const colWidth = maxLineWidth / colCount
          const rowHeight = 7

          checkPageOverflow((parsedRows.length * rowHeight) + 6)

          let tableY = y
          parsedRows.forEach((rowCells, rIdx) => {
            const isHeader = rIdx === 0
            doc.setFont('times', isHeader ? 'bold' : 'normal')
            if (isHeader) {
              doc.setFillColor(241, 245, 249)
              doc.rect(margin.left, tableY - 4, maxLineWidth, rowHeight, 'F')
            }
            rowCells.forEach((cellText, cIdx) => {
              const cellX = margin.left + (cIdx * colWidth)
              doc.setDrawColor(203, 213, 225)
              doc.setLineWidth(0.2)
              doc.rect(cellX, tableY - 4, colWidth, rowHeight, 'D')
              const cellLines = doc.splitTextToSize(cellText, colWidth - 4)
              doc.text(cellLines[0] || '', cellX + 2, tableY)
            })
            tableY += rowHeight
          })
          y = tableY + 3
        }
      }

      // --- FOOTER HALAMAN TERAKHIR ---
      doc.setFont('times', 'italic')
      doc.setFontSize(8.5)
      doc.setTextColor(148, 163, 184)
      doc.text('Draft Akademik - Dibuat secara otomatis dengan CampusMate AI', margin.left, pageHeight - 15)
      doc.text(`Halaman ${doc.internal.getNumberOfPages()}`, pageWidth - margin.right - 12, pageHeight - 15)

      // Simpan file PDF
      const filename = `campusmate-${feature}-${getTimestamp()}.pdf`
      doc.save(filename)

      toast.success('PDF akademik berhasil diekspor!', {
        description: filename
      })
    } catch (error) {
      console.error(error)
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
