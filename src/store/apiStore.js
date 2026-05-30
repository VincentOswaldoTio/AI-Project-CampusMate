import { create } from 'zustand'

export const useApiStore = create((set) => ({
  // State Awal
  apiKey: localStorage.getItem('campusmate_api_key') || '',
  model: 'openrouter/auto',
  isConnected: false,
  theme: localStorage.getItem('campusmate_theme') || 'light',

  // Actions
  setApiKey: (apiKey) => {
    localStorage.setItem('campusmate_api_key', apiKey)
    set({ apiKey })
  },

  setModel: (model) => {
    set({ model })
  },

  setConnected: (isConnected) => {
    set({ isConnected })
  },

  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('campusmate_theme', newTheme)
      return { theme: newTheme }
    })
  }
}))
