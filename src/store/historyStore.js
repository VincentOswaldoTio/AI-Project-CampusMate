import { create } from 'zustand'

// Helper untuk membaca dari localStorage secara aman
const getInitialHistory = () => {
  try {
    const stored = localStorage.getItem('campusmate_history')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Gagal membaca history dari localStorage:', error)
    return []
  }
}

// Helper untuk menulis ke localStorage secara aman
const saveHistory = (items) => {
  try {
    localStorage.setItem('campusmate_history', JSON.stringify(items))
  } catch (error) {
    console.error('Gagal menulis history ke localStorage:', error)
  }
}

export const useHistoryStore = create((set) => ({
  // State Awal
  items: getInitialHistory(),
  totalUsed: (() => {
    try {
      const stored = localStorage.getItem('campusmate_total_used')
      return stored ? parseInt(stored, 10) : 0
    } catch {
      return 0
    }
  })(),

  // Actions
  addItem: (itemData) => {
    set((state) => {
      const newItem = {
        id: itemData.id || crypto.randomUUID(),
        feature: itemData.feature,
        featureName: itemData.featureName,
        category: itemData.category,
        input: itemData.input,
        output: itemData.output,
        createdAt: itemData.createdAt || new Date().toISOString(),
        favorite: !!itemData.favorite
      }

      // Masukkan item baru ke depan, batasi maksimal 100 item
      const updatedItems = [newItem, ...state.items].slice(0, 100)
      saveHistory(updatedItems)

      // Update total used
      const nextTotal = state.totalUsed + 1
      try {
        localStorage.setItem('campusmate_total_used', nextTotal.toString())
      } catch (err) {
        console.error('Gagal menulis totalUsed ke localStorage:', err)
      }

      return { 
        items: updatedItems,
        totalUsed: nextTotal
      }
    })
  },

  removeItem: (id) => {
    set((state) => {
      const updatedItems = state.items.filter((item) => item.id !== id)
      saveHistory(updatedItems)
      return { items: updatedItems }
    })
  },

  toggleFavorite: (id) => {
    set((state) => {
      const updatedItems = state.items.map((item) =>
        item.id === id ? { ...item, favorite: !item.favorite } : item
      )
      saveHistory(updatedItems)
      return { items: updatedItems }
    })
  },

  clearAll: () => {
    saveHistory([])
    // Opsional: total digunakan tetap dipertahankan sebagai statistik kumulatif,
    // namun kita biarkan tetap terhitung dari localStorage.
    set({ items: [] })
  }
}))
