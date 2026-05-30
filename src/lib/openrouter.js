const BASE_URL = 'https://openrouter.ai/api/v1'

/**
 * Memanggil OpenRouter API untuk mendapatkan respons AI.
 * 
 * @param {Object} params
 * @param {string} params.apiKey - API key OpenRouter
 * @param {string} params.systemPrompt - System prompt untuk konteks AI
 * @param {string} params.userMessage - Pesan input dari pengguna
 * @param {string} params.model - Model AI yang digunakan (default: 'openrouter/auto')
 * @param {number} params.maxTokens - Batas maksimum token output (default: 2000)
 * @returns {Promise<string>} Teks hasil respons AI
 */
export async function callOpenRouter({ 
  apiKey, 
  systemPrompt, 
  userMessage, 
  model = 'openrouter/auto', 
  maxTokens = 2000 
}) {
  let response

  try {
    response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'CampusMate AI'
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ]
      })
    })
  } catch (networkError) {
    throw new Error('Tidak bisa terhubung. Periksa koneksi internet.')
  }

  // Menangani HTTP error sesuai kode status
  if (!response.ok) {
    switch (response.status) {
      case 401:
        throw new Error('API key tidak valid. Cek di halaman Pengaturan.')
      case 402:
        throw new Error('Limit harian OpenRouter habis. Coba besok.')
      case 429:
        throw new Error('Terlalu banyak request. Tunggu 1 menit lalu coba lagi.')
      case 503:
        throw new Error('Model AI sedang sibuk. Coba beberapa saat lagi.')
      default: {
        const errorBody = await response.text().catch(() => '')
        throw new Error(`Terjadi kesalahan server (${response.status}). ${errorBody}`)
      }
    }
  }

  const data = await response.json()

  // Mengekstrak teks dari respons standar OpenAI-compatible
  const text = data?.choices?.[0]?.message?.content

  if (!text) {
    throw new Error('Respons dari AI kosong. Coba kirim ulang permintaan Anda.')
  }

  return text.trim()
}

/**
 * Menguji koneksi ke OpenRouter API.
 * 
 * @param {string} apiKey - API key OpenRouter
 * @returns {Promise<{success: boolean, model: string, latency: number}>}
 */
export async function testConnection(apiKey) {
  const startTime = performance.now()

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'CampusMate AI'
      },
      body: JSON.stringify({
        model: 'openrouter/auto',
        max_tokens: 10,
        messages: [
          { role: 'user', content: 'Balas hanya dengan kata: OK' }
        ]
      })
    })

    const latency = Math.round(performance.now() - startTime)

    if (!response.ok) {
      return { success: false, model: '', latency }
    }

    const data = await response.json()
    const modelUsed = data?.model || 'openrouter/auto'

    return { success: true, model: modelUsed, latency }
  } catch (error) {
    const latency = Math.round(performance.now() - startTime)
    return { success: false, model: '', latency }
  }
}
