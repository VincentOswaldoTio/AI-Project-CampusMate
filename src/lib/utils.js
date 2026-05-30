import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Mengubah ISO date string menjadi timestamp relatif dalam bahasa Indonesia.
 * "Baru saja" / "X menit lalu" / "X jam lalu" / "Kemarin" / tanggal lengkap
 * 
 * @param {string|Date} dateString - String tanggal ISO
 * @returns {string} Timestamp relatif
 */
export function getRelativeTimestamp(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date

  if (isNaN(diffMs) || diffMs < 0) {
    return 'Baru saja'
  }

  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)

  if (diffSec < 60) {
    return 'Baru saja'
  }
  if (diffMin < 60) {
    return `${diffMin} menit lalu`
  }
  if (diffHour < 24) {
    return `${diffHour} jam lalu`
  }

  // Cek apakah kemarin
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  
  const isYesterday = 
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()

  if (isYesterday) {
    return 'Kemarin'
  }

  // Format tanggal lengkap
  return date.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Membersihkan sintaksis Markdown untuk disalin ke clipboard dalam bentuk teks rapi tanpa karakter markdown (*, #, `, dll)
 * 
 * @param {string} text - Teks berformat Markdown
 * @returns {string} Teks polos yang bersih dan rapi
 */
export function cleanMarkdownForCopy(text) {
  if (!text) return '';

  let clean = text;

  // 1. Hapus tag HTML
  clean = clean.replace(/<[^>]*>/g, '');

  // 2. Format headings (hapus karakter # di awal baris tetapi pertahankan kontennya)
  clean = clean.replace(/^(?:#+)\s*(.*?)$/gm, '$1');

  // 3. Hapus cetak tebal / miring (asterisks dan underscores)
  clean = clean.replace(/\*\*\*(.*?)\*\*\*/g, '$1');
  clean = clean.replace(/\*\*(.*?)\*\*/g, '$1');
  clean = clean.replace(/\*(.*?)\*/g, '$1');
  clean = clean.replace(/___(.*?)___/g, '$1');
  clean = clean.replace(/__(.*?)__/g, '$1');
  clean = clean.replace(/_(.*?)_/g, '$1');

  // 4. Hapus backticks inline code
  clean = clean.replace(/`(.*?)`/g, '$1');

  // 5. Hapus triple backticks pada blok kode (dan baris bahasa pemrogramannya)
  clean = clean.replace(/```[a-zA-Z]*\n([\s\S]*?)```/g, '$1');

  // 6. Hapus karakter blockquote >
  clean = clean.replace(/^\s*>\s*(.*?)$/gm, '$1');

  // 7. Bersihkan pemisah tabel (misalnya |---|---|)
  clean = clean.replace(/^\s*\|[-:| ]+\|\s*$/gm, '');
  // Ubah karakter pipa tabel | menjadi spasi ganda agar rapi
  clean = clean.replace(/\|/g, '  ');

  // 8. Rapikan daftar list (ubah - atau * menjadi bullet point standar • agar rapi)
  clean = clean.replace(/^\s*[-*+]\s+(.*?)$/gm, '• $1');

  // 9. Batasi baris kosong berlebih (maksimal 2 baris kosong berturut-turut)
  clean = clean.replace(/\n{3,}/g, '\n\n');

  return clean.trim();
}
