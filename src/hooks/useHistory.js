import { useHistoryStore } from '@/store/historyStore'

/**
 * Hook wrapper untuk historyStore.
 * Menyediakan fungsi utilitas tambahan untuk pengelolaan riwayat.
 */
export function useHistory() {
  const { items, totalUsed, addItem, removeItem, toggleFavorite, clearAll } = useHistoryStore()

  /**
   * Menyimpan hasil generasi AI ke riwayat.
   * 
   * @param {Object} params
   * @param {string} params.feature - Slug rute fitur (misal: 'smart-summarizer')
   * @param {string} params.featureName - Nama tampilan fitur (misal: 'Smart Summarizer')
   * @param {string} params.category - Kategori fitur (misal: 'Manipulasi Teks')
   * @param {string} params.input - Teks input pengguna
   * @param {string} params.output - Teks output dari AI
   */
  const saveToHistory = ({ feature, featureName, category, input, output }) => {
    addItem({
      feature,
      featureName,
      category,
      input,
      output,
      favorite: false
    })
  }

  /**
   * Mengambil N item riwayat terbaru.
   * 
   * @param {number} limit - Jumlah item yang diambil (default: 5)
   * @returns {Array} Daftar item riwayat terbaru
   */
  const getRecentItems = (limit = 5) => {
    return items.slice(0, limit)
  }

  return {
    items,
    totalUsed,
    saveToHistory,
    getRecentItems,
    removeItem,
    toggleFavorite,
    clearAll
  }
}
