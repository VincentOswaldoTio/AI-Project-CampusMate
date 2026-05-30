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
