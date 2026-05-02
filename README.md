# 🎓 CampusMate AI

> Asisten akademik berbasis AI untuk mahasiswa Indonesia — 20 fitur lengkap dalam satu aplikasi React.

---

## 📋 Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Fitur Lengkap](#fitur-lengkap)
- [Tech Stack](#tech-stack)
- [Cara Install & Menjalankan](#cara-install--menjalankan)
- [Cara Mendapatkan API Key (Gratis)](#cara-mendapatkan-api-key-gratis)
- [Struktur Folder](#struktur-folder)
- [Cara Penggunaan](#cara-penggunaan)
- [Tim Pengembang](#tim-pengembang)

---

## Tentang Proyek

CampusMate AI adalah aplikasi web yang dirancang khusus untuk membantu mahasiswa Indonesia dalam kegiatan akademik sehari-hari. Mulai dari menulis, riset, belajar, hingga menjaga kesehatan mental — semuanya tersedia dalam satu platform yang mudah digunakan.

Proyek ini awalnya dibangun dengan **Streamlit (Python)**, kemudian dimigrasi penuh ke **React (Vite)** agar lebih cepat, stabil, dan dapat di-deploy ke mana saja tanpa backend.

---

## Fitur Lengkap

### 📝 API Open Router

CampusMate menggunakan OpenRouter sebagai penyedia API. OpenRouter menyediakan akses gratis ke berbagai model AI dengan limit 20 request/menit dan 200 request/hari untuk tier gratis.

### 📝 Manipulasi Teks

| Fitur                     | Deskripsi                                                                                                                                              |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Smart Summarizer**      | Meringkas jurnal, materi kuliah, atau artikel panjang menjadi poin-poin utama. Mendukung format bullet point, paragraf naratif, dan poin + penjelasan. |
| **Academic Paraphraser**  | Memparafrase teks agar tidak terdeteksi plagiarisme dengan tingkat perubahan rendah/sedang/tinggi.                                                     |
| **Grammar & PUEBI Fixer** | Mengoreksi tulisan sesuai kaidah PUEBI (Pedoman Umum Ejaan Bahasa Indonesia). Tersedia mode koreksi + penjelasan, koreksi saja, atau daftar kesalahan. |
| **Tone Transformer**      | Mengubah nada tulisan dari santai/gaul menjadi formal akademik, jurnal ilmiah, atau laporan resmi.                                                     |

### 🔬 Riset & Struktur

| Fitur                        | Deskripsi                                                                                                               |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Research Idea Generator**  | Menghasilkan hingga 15 ide judul penelitian lengkap dengan variabel, metode, potensi kontribusi, dan tingkat kesulitan. |
| **Automatic Outline**        | Membuat kerangka skripsi/makalah/proposal secara otomatis berdasarkan judul dan latar belakang.                         |
| **Literature Review Helper** | Membandingkan dua jurnal secara akademik: persamaan, perbedaan, research gap, metodologi, temuan, dan implikasi.        |
| **Argument Builder**         | Menyusun argumen PRO dan KONTRA yang kuat untuk topik debat atau esai argumentatif.                                     |

### ✍️ Penulisan Ilmiah

| Fitur                   | Deskripsi                                                                                                            |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Abstract Translator** | Menerjemahkan abstrak jurnal antara Bahasa Indonesia ↔ Academic English standar jurnal internasional.                |
| **Citation Formatter**  | Memformat daftar pustaka ke berbagai gaya sitasi: APA 7th, MLA 9th, Harvard, Chicago, Vancouver, IEEE.               |
| **Data Explainer**      | Mengubah data mentah (angka/tabel/statistik) menjadi narasi akademik yang siap masuk bab hasil penelitian.           |
| **Reference Keywords**  | Menghasilkan kata kunci pencarian jurnal beserta Boolean Search String siap pakai untuk Google Scholar, Scopus, dll. |

### 📚 Belajar & Studi

| Fitur                    | Deskripsi                                                                                                             |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| **Concept Simplifier**   | Menjelaskan konsep atau teori rumit menggunakan analogi sehari-hari yang mudah dipahami.                              |
| **Exam Prep Questioner** | Membuat soal latihan ujian (MCQ, esai, benar/salah) dari catatan kuliah, lengkap dengan kunci jawaban dan penjelasan. |

### ⚡ Produktivitas

| Fitur                     | Deskripsi                                                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Dosen Email Drafter**   | Membuat email formal, pesan WhatsApp, atau surat resmi kepada dosen dengan bahasa yang sopan dan profesional.       |
| **Action Item Extractor** | Mengekstrak semua tugas dan tanggung jawab dari notulensi rapat, dilengkapi prioritas dan deadline.                 |
| **Presentation Script**   | Membuat naskah bicara presentasi lengkap dengan timing, transisi antar slide, dan petunjuk [JEDA] / [TUNJUK SLIDE]. |

### 💚 Kesejahteraan

| Fitur                     | Deskripsi                                                                                                                          |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Motivation & Wellness** | Chat interaktif dengan AI yang berperan sebagai sahabat suportif — membantu mengatasi stress, prokrastinasi, dan tekanan akademik. |

---

## Tech Stack

| Komponen  | Teknologi                                             |
| --------- | ----------------------------------------------------- |
| Framework | React 18 + Vite                                       |
| Bahasa    | JavaScript (JSX)                                      |
| Styling   | CSS-in-JS (inline styles)                             |
| Font      | Google Fonts — Playfair Display, Nunito               |
| AI API    | OpenRouter API (`openrouter/free` router)             |
| Model AI  | Auto-select dari pool model gratis OpenRouter         |
| Deploy    | Dapat di-deploy ke Vercel, Netlify, atau GitHub Pages |

> **Mengapa OpenRouter?**
> OpenRouter adalah gateway API yang mendukung CORS dari browser, gratis, dan secara otomatis memilih model AI terbaik yang tersedia — sehingga aplikasi tidak akan error meskipun satu model sedang tidak tersedia.

---

## Cara Install & Menjalankan

### Prasyarat

- Node.js versi 18 ke atas
- npm atau yarn

### Langkah-langkah

**1. Clone atau buat proyek Vite baru**

```bash
npm create vite@latest campusmate -- --template react
cd campusmate
```

**2. Install dependencies**

```bash
npm install
```

**3. Jalankan aplikasi**

```bash
npm run dev
```

**4. Buka di browser**

```
http://localhost:5173
```

---

## Cara Mendapatkan API Key (Gratis)

CampusMate menggunakan **OpenRouter** sebagai penyedia API. Berikut cara mendapatkan API key secara gratis:

1. Buka **[openrouter.ai](https://openrouter.ai)** di browser
2. Klik **Sign In** — bisa menggunakan akun Google
3. Setelah masuk, buka **[openrouter.ai/keys](https://openrouter.ai/keys)**
4. Klik tombol **Create Key**
5. Beri nama bebas (contoh: `campusmate-key`) lalu klik **Create**
6. **Copy** API key yang muncul — formatnya `sk-or-v1-...`
7. Buka CampusMate di browser, paste API key di kolom sidebar kiri
8. Klik **🔌 Test Koneksi API** untuk memastikan key berfungsi
9. Jika muncul ✅ **Koneksi berhasil** — semua fitur siap digunakan

> **Catatan:** Tidak perlu kartu kredit. OpenRouter menyediakan akses gratis ke berbagai model AI dengan limit 20 request/menit dan 200 request/hari untuk tier gratis.

---

## Struktur Folder

```
campusmate/
├── src/
│   ├── App.jsx          ← Seluruh kode CampusMate (1 file)
│   └── main.jsx         ← Entry point React
├── public/
│   └── vite.svg
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

> Seluruh aplikasi dibangun dalam **satu file JSX** untuk kemudahan deployment dan pemeliharaan.

---

## Cara Penggunaan

### Pertama Kali

1. Masukkan API key OpenRouter di sidebar kiri
2. Klik **Test Koneksi API** untuk verifikasi
3. Pilih fitur yang dibutuhkan dari sidebar atau halaman beranda

### Tips Penggunaan

- **Summarizer**: Paste teks minimal 3–5 paragraf untuk hasil terbaik
- **Research Ideas**: Semakin spesifik kata kunci, semakin relevan ide yang dihasilkan
- **Citation Formatter**: Masukkan satu sumber per baris; bisa berupa URL, DOI, atau info manual
- **Wellness Chat**: Bisa digunakan kapan saja untuk curhat atau minta saran mengatasi stress akademik
- **Exam Prep**: Paste catatan lengkap satu topik untuk soal yang lebih berkualitas

### Tombol Salin

Setiap hasil output memiliki tombol **📋 Salin** untuk langsung menyalin ke clipboard.

---

## Tim Pengembang

| Nama    | Peran     |
| ------- | --------- |
| Vincent | Developer |
| Vian    | Developer |
| Jimmy   | Developer |
| Reagan  | Developer |

---

## Lisensi

Proyek ini dikembangkan untuk keperluan akademik. Bebas digunakan dan dimodifikasi untuk kebutuhan non-komersial.

---

<p align="center">
  Dibuat dengan ❤️ untuk mahasiswa Indonesia · Powered by OpenRouter AI
</p>
