<p align="center">
  <img src="https://img.icons8.com/fluency/96/graduation-cap.png" alt="CampusMate AI Logo" width="80" />
</p>

<h1 align="center">CampusMate AI</h1>

<p align="center">
  <strong>Asisten Akademik Berbasis AI untuk Mahasiswa Indonesia</strong>
</p>

<p align="center">
  <a href="https://campus-mate-ashy.vercel.app/">
    <img src="https://img.shields.io/badge/▲%20Deploy-Vercel-black?style=for-the-badge&logo=vercel" alt="Deploy on Vercel" />
  </a>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 18" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License" />
</p>

---

## 📖 Tentang CampusMate AI

**CampusMate AI** adalah platform web modern yang menyediakan **20 fitur AI** untuk membantu mahasiswa Indonesia dalam perkuliahan, riset, dan penulisan ilmiah. Dibangun dengan teknologi terkini dan desain yang terinspirasi dari **Linear**, **Vercel Dashboard**, dan **Raycast** — CampusMate dirancang agar terasa seperti _tools_ modern yang mahasiswa ingin buka setiap hari.

Semua fitur didukung oleh model bahasa besar (LLM) melalui **OpenRouter API**, memberikan fleksibilitas untuk memilih model AI yang paling sesuai dengan kebutuhan.

> [!TIP]
> **Live Demo & Preview:** Anda dapat langsung mencoba aplikasi tanpa perlu menjalankannya secara lokal melalui link deployment berikut: **[https://campus-mate-ashy.vercel.app/](https://campus-mate-ashy.vercel.app/)** 🚀

---

## ✨ Daftar 20 Fitur

### 📝 Manipulasi Teks

| # | Fitur | Deskripsi |
|---|-------|-----------|
| 1 | **Smart Summarizer** | Ringkas teks panjang menjadi poin-poin kunci secara instan |
| 2 | **Academic Paraphraser** | Parafrase teks dengan gaya akademik yang sesuai standar |
| 3 | **Grammar & PUEBI Fixer** | Perbaiki tata bahasa Inggris dan ejaan PUEBI Indonesia |
| 4 | **Tone Transformer** | Ubah nada tulisan — formal, kasual, persuasif, dan lainnya |

### 🔬 Riset & Struktur

| # | Fitur | Deskripsi |
|---|-------|-----------|
| 5 | **Research Idea Generator** | Hasilkan ide riset orisinal dari topik yang diminati |
| 6 | **Automatic Outline** | Buat kerangka tulisan terstruktur secara otomatis |
| 7 | **Literature Review Helper** | Bantu menyusun tinjauan pustaka yang komprehensif |
| 8 | **Argument Builder** | Bangun argumen akademik yang kuat dan terstruktur |

### 🎓 Penulisan Ilmiah

| # | Fitur | Deskripsi |
|---|-------|-----------|
| 9 | **Abstract Translator** | Terjemahkan abstrak antara Bahasa Indonesia dan Inggris |
| 10 | **Citation Formatter** | Format sitasi sesuai standar APA, MLA, Chicago, dll. |
| 11 | **Data Explainer** | Jelaskan data dan statistik dalam narasi yang mudah dipahami |
| 12 | **Reference Keywords** | Hasilkan kata kunci pencarian untuk menemukan referensi |

### 📚 Belajar & Studi

| # | Fitur | Deskripsi |
|---|-------|-----------|
| 13 | **Concept Simplifier** | Sederhanakan konsep kompleks menjadi penjelasan yang mudah |
| 14 | **Exam Prep Questioner** | Buat soal latihan untuk persiapan ujian |

### ⚡ Produktivitas

| # | Fitur | Deskripsi |
|---|-------|-----------|
| 15 | **Dosen Email Drafter** | Tulis email profesional ke dosen dengan cepat |
| 16 | **Action Item Extractor** | Ekstrak tugas dan aksi dari catatan meeting/kuliah |
| 17 | **Presentation Script** | Buat naskah presentasi yang menarik dan terstruktur |

### 🌱 Kesejahteraan

| # | Fitur | Deskripsi |
|---|-------|-----------|
| 18 | **Motivation & Wellness** | Chat interface untuk dukungan motivasi dan kesejahteraan |

### 🗂️ Manajemen Akademik

| # | Fitur | Deskripsi |
|---|-------|-----------|
| 19 | **Thesis Progress Tracker** | Lacak dan kelola progres penulisan skripsi/tesis |
| 20 | **Study Schedule Generator** | Buat jadwal belajar yang optimal dan terstruktur |

---

## 🛠️ Tech Stack

| Teknologi | Fungsi |
|-----------|--------|
| **React 18** | Library UI utama dengan hooks dan functional components |
| **Vite** | Build tool yang cepat dengan HMR (Hot Module Replacement) |
| **Tailwind CSS v4** | Utility-first CSS framework untuk styling modern |
| **shadcn/ui** | Komponen UI yang accessible dan customizable |
| **Zustand** | State management yang ringan dan intuitif |
| **React Router** | Client-side routing untuk navigasi SPA |
| **Sonner** | Toast notification yang elegan |
| **OpenRouter API** | Gateway ke berbagai model AI (GPT, Claude, Gemini, dll.) |
| **react-markdown** | Render output Markdown dari AI |
| **highlight.js** | Syntax highlighting untuk blok kode |

---

## 📋 Prerequisites

Pastikan Anda sudah menginstal:

- **Node.js** versi 18 atau lebih baru — [Download](https://nodejs.org/)
- **npm** (sudah termasuk dengan Node.js)
- **OpenRouter API Key** — [Dapatkan di sini](https://openrouter.ai/keys)

---

## 🚀 Instalasi & Jalankan Lokal

```bash
# 1. Clone repository
git clone https://github.com/VincentOswaldoTio/AI-Project-CampusMate.git

# 2. Masuk ke direktori project
cd AI-Project-CampusMate/campusmate-v2

# 3. Install dependencies
npm install

# 4. Jalankan development server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173` secara default.

---

## 🔑 Mendapatkan API Key

CampusMate AI menggunakan **OpenRouter** sebagai gateway ke berbagai model AI. Berikut cara mendapatkan API key:

1. Buka [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Buat akun baru atau login jika sudah punya
3. Klik **"Create Key"** untuk generate API key baru
4. Salin API key yang dihasilkan
5. Buka aplikasi CampusMate AI → navigasi ke halaman **Pengaturan**
6. Paste API key di kolom yang tersedia dan simpan

> [!NOTE]
> API key disimpan secara lokal di browser Anda (localStorage) dan **tidak pernah** dikirim ke server mana pun selain OpenRouter.

---

## ▲ Deploy ke Vercel

Deploy CampusMate AI ke Vercel dalam beberapa langkah mudah:

1. **Import Repository**
   - Buka [vercel.com](https://vercel.com) dan login
   - Klik **"Add New Project"** → Import dari GitHub
   - Pilih repository `AI-Project-CampusMate`

2. **Konfigurasi Build**
   - **Framework Preset**: `Vite`
   - **Root Directory**: `campusmate-v2`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Deploy**
   - Klik **"Deploy"** dan tunggu proses build selesai
   - Aplikasi Anda akan live di URL yang diberikan Vercel

> [!TIP]
> File `vercel.json` sudah dikonfigurasi untuk menangani client-side routing — semua rute akan di-rewrite ke `index.html`.

---

## 👥 Tim

<table>
  <tr>
    <td align="center"><strong>Vincent Oswaldo Tio</strong></td>
    <td align="center"><strong>Vian</strong></td>
    <td align="center"><strong>Jimmy</strong></td>
    <td align="center"><strong>Reagan</strong></td>
  </tr>
</table>

---

## 📄 License

Proyek ini dilisensikan di bawah **MIT License** — lihat file [LICENSE](LICENSE) untuk detail.

```
MIT License

Copyright (c) 2025 CampusMate AI Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<p align="center">
  Dibuat dengan ❤️ untuk mahasiswa Indonesia
</p>
