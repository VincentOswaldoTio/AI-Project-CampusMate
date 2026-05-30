import { useState } from 'react'
import { toast } from 'sonner'
import { callOpenRouter } from '@/lib/openrouter'
import { useApiStore } from '@/store/apiStore'

/**
 * Hook untuk memanggil OpenRouter API secara deklaratif.
 * Mengambil apiKey dan model dari apiStore secara otomatis.
 */
export function useOpenRouter() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Memanggil API OpenRouter.
   * 
   * @param {Object} params
   * @param {string} params.systemPrompt - System prompt untuk konteks AI
   * @param {string} params.userMessage - Pesan input dari pengguna
   * @param {number} [params.maxTokens] - Batas token output (opsional)
   * @returns {Promise<string|null>} Teks hasil AI atau null jika gagal
   */
  const callAPI = async ({ systemPrompt, userMessage, maxTokens }) => {
    const { apiKey, model } = useApiStore.getState()

    // Validasi: API key harus ada
    if (!apiKey || apiKey.trim() === '') {
      toast.error('API key belum diatur.', {
        description: 'Masukkan OpenRouter API key di halaman Pengaturan terlebih dahulu.'
      })
      return null
    }

    // Validasi: input pengguna harus ada
    if (!userMessage || userMessage.trim() === '') {
      toast.error('Input tidak boleh kosong.', {
        description: 'Silakan tulis teks atau pertanyaan Anda terlebih dahulu.'
      })
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await callOpenRouter({
        apiKey,
        systemPrompt,
        userMessage: userMessage.trim(),
        model,
        maxTokens
      })

      return result
    } catch (err) {
      const errorMessage = err.message || 'Terjadi kesalahan yang tidak diketahui.'
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { callAPI, isLoading, error }
}
