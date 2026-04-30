import { useState, useRef, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════
const BASE_SYSTEM = `Kamu adalah CampusMate AI, asisten akademik cerdas untuk mahasiswa Indonesia.
KARAKTER: Seperti kakak tingkat yang pintar, ramah, dan selalu siap membantu. Berikan output yang langsung bisa dipakai, tanpa basa-basi pembuka.
BAHASA: Bahasa Indonesia baku dan akademis sebagai default. Untuk wellness/motivasi: lebih santai dan hangat. Jika diminta English: gunakan Academic English standar jurnal internasional.
KUALITAS: Langsung ke inti, tanpa pembuka seperti "Tentu saja!" atau "Baik!". Gunakan struktur yang jelas (heading, bullet, penomoran) sesuai konteks. Ikuti PUEBI untuk konten akademik. Jangan mengarang fakta, data, atau referensi.`;

const WELLNESS_SYSTEM = `Kamu adalah CampusMate, sahabat akademik yang hangat dan suportif. Cara merespons: validasi perasaan dulu, tunjukkan empati tulus, baru beri saran praktis. Gaya: Hangat seperti teman yang bijak. Bahasa Indonesia natural. Boleh pakai emoji relevan.`;

const FEATURES = {
  home: { icon: "🏠", label: "Beranda", section: null },
  summarizer: {
    icon: "📝",
    label: "Smart Summarizer",
    section: "Manipulasi Teks",
  },
  paraphraser: {
    icon: "🔄",
    label: "Academic Paraphraser",
    section: "Manipulasi Teks",
  },
  grammar: {
    icon: "✅",
    label: "Grammar & PUEBI Fixer",
    section: "Manipulasi Teks",
  },
  tone: { icon: "🎭", label: "Tone Transformer", section: "Manipulasi Teks" },
  ideas: {
    icon: "💡",
    label: "Research Idea Generator",
    section: "Riset & Struktur",
  },
  outline: {
    icon: "📋",
    label: "Automatic Outline",
    section: "Riset & Struktur",
  },
  litreview: {
    icon: "🔍",
    label: "Literature Review Helper",
    section: "Riset & Struktur",
  },
  argument: {
    icon: "⚖️",
    label: "Argument Builder",
    section: "Riset & Struktur",
  },
  translator: {
    icon: "🌐",
    label: "Abstract Translator",
    section: "Penulisan Ilmiah",
  },
  citation: {
    icon: "📌",
    label: "Citation Formatter",
    section: "Penulisan Ilmiah",
  },
  data: { icon: "📊", label: "Data Explainer", section: "Penulisan Ilmiah" },
  keywords: {
    icon: "🔑",
    label: "Reference Keywords",
    section: "Penulisan Ilmiah",
  },
  concept: {
    icon: "🧩",
    label: "Concept Simplifier",
    section: "Belajar & Studi",
  },
  exam: {
    icon: "📖",
    label: "Exam Prep Questioner",
    section: "Belajar & Studi",
  },
  email: { icon: "📧", label: "Dosen Email Drafter", section: "Produktivitas" },
  actionitem: {
    icon: "✅",
    label: "Action Item Extractor",
    section: "Produktivitas",
  },
  script: {
    icon: "🎤",
    label: "Presentation Script",
    section: "Produktivitas",
  },
  wellness: {
    icon: "💚",
    label: "Motivation & Wellness",
    section: "Kesejahteraan",
  },
};

const SECTION_COLORS = {
  "Manipulasi Teks": {
    accent: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.25)",
  },
  "Riset & Struktur": {
    accent: "#10B981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.25)",
  },
  "Penulisan Ilmiah": {
    accent: "#8B5CF6",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.25)",
  },
  "Belajar & Studi": {
    accent: "#38BDF8",
    bg: "rgba(56,189,248,0.08)",
    border: "rgba(56,189,248,0.25)",
  },
  Produktivitas: {
    accent: "#F43F5E",
    bg: "rgba(244,63,94,0.08)",
    border: "rgba(244,63,94,0.25)",
  },
  Kesejahteraan: {
    accent: "#10B981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.25)",
  },
};

const HOME_GROUPS = [
  {
    name: "Manipulasi Teks",
    keys: ["summarizer", "paraphraser", "grammar", "tone"],
  },
  {
    name: "Riset & Struktur",
    keys: ["ideas", "outline", "litreview", "argument"],
  },
  {
    name: "Penulisan Ilmiah",
    keys: ["translator", "citation", "data", "keywords"],
  },
  { name: "Belajar & Studi", keys: ["concept", "exam"] },
  { name: "Produktivitas", keys: ["email", "actionitem", "script"] },
  { name: "Kesejahteraan", keys: ["wellness"] },
];

// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// API CALL — OpenRouter (CORS aman, gratis, tanpa rate limit ketat)
// Model: openrouter/free (auto-pilih model gratis yang aktif)
// ═══════════════════════════════════════════════════════════
async function callAI({
  apiKey,
  prompt,
  system = BASE_SYSTEM,
  history = [],
  maxTokens = 4096,
}) {
  const messages = [
    { role: "system", content: system },
    ...history.map((h) => ({
      role: h.role === "assistant" ? "assistant" : "user",
      content: h.content,
    })),
    { role: "user", content: prompt },
  ];

  const body = JSON.stringify({
    model: "openrouter/free",
    messages,
    max_tokens: maxTokens,
    temperature: 0.7,
  });

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + apiKey,
    },
    body,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err?.error?.message || "HTTP " + res.status;
    if (res.status === 401)
      throw new Error("API Key tidak valid. Pastikan format: sk-or-v1-...");
    if (res.status === 402)
      throw new Error("Kredit habis. Buat akun baru di openrouter.ai");
    if (res.status === 429)
      throw new Error(
        "Terlalu banyak request. Tunggu sebentar lalu coba lagi.",
      );
    if (res.status === 503)
      throw new Error("Model sedang sibuk. Coba lagi dalam beberapa detik.");
    throw new Error(msg);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("Tidak ada respons dari AI. Coba lagi.");
  return text;
}

// ═══════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════
function useAI(apiKey) {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = useCallback(
    async (opts) => {
      if (!apiKey) {
        setError("Masukkan API Key terlebih dahulu!");
        return;
      }
      setLoading(true);
      setError("");
      setResult("");
      try {
        const text = await callAI({ apiKey, ...opts });
        setResult(text);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [apiKey],
  );

  return { result, loading, error, run, setResult };
}

// ═══════════════════════════════════════════════════════════
// REUSABLE UI COMPONENTS
// ═══════════════════════════════════════════════════════════
const styles = {
  card: {
    background: "#111827",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 14,
    padding: "1.25rem 1.5rem",
    marginBottom: "1rem",
  },
  input: {
    width: "100%",
    background: "#1C2535",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10,
    color: "#F3F4F6",
    padding: "0.6rem 0.85rem",
    fontSize: "0.88rem",
    fontFamily: "'Nunito', sans-serif",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  textarea: {
    width: "100%",
    background: "#1C2535",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10,
    color: "#F3F4F6",
    padding: "0.65rem 0.85rem",
    fontSize: "0.88rem",
    fontFamily: "'Nunito', sans-serif",
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
    lineHeight: 1.6,
    transition: "border-color 0.2s",
  },
  select: {
    width: "100%",
    background: "#1C2535",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10,
    color: "#F3F4F6",
    padding: "0.6rem 0.85rem",
    fontSize: "0.88rem",
    fontFamily: "'Nunito', sans-serif",
    outline: "none",
    cursor: "pointer",
  },
  label: {
    display: "block",
    fontSize: "0.7rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#6B7280",
    marginBottom: "0.35rem",
  },
  btnPrimary: {
    background: "linear-gradient(135deg, #F59E0B, #D97706)",
    color: "#0A0E1A",
    border: "none",
    borderRadius: 10,
    padding: "0.65rem 1.5rem",
    fontWeight: 700,
    fontSize: "0.88rem",
    fontFamily: "'Nunito', sans-serif",
    cursor: "pointer",
    width: "100%",
    transition: "opacity 0.2s, transform 0.15s",
  },
  result: {
    background: "#111827",
    border: "1px solid rgba(255,255,255,0.07)",
    borderLeft: "3px solid #F59E0B",
    borderRadius: 12,
    padding: "1.25rem 1.5rem",
    fontSize: "0.88rem",
    lineHeight: 1.85,
    color: "#F3F4F6",
    whiteSpace: "pre-wrap",
    fontFamily: "'Nunito', sans-serif",
    wordBreak: "break-word",
    marginTop: "1rem",
  },
  error: {
    background: "rgba(244,63,94,0.08)",
    border: "1px solid rgba(244,63,94,0.25)",
    borderRadius: 10,
    padding: "0.75rem 1rem",
    color: "#F43F5E",
    fontSize: "0.83rem",
    marginTop: "0.75rem",
  },
};

function Label({ children }) {
  return <label style={styles.label}>{children}</label>;
}

function Field({ label, children, style }) {
  return (
    <div style={{ marginBottom: "0.85rem", ...style }}>
      {label && <Label>{label}</Label>}
      {children}
    </div>
  );
}

function Grid({ cols = 2, children }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: "0.85rem",
      }}
    >
      {children}
    </div>
  );
}

function ResultBox({ text, accentColor = "#F59E0B" }) {
  if (!text) return null;
  return (
    <div style={{ ...styles.result, borderLeftColor: accentColor }}>{text}</div>
  );
}

function LoadingSpinner() {
  return (
    <div style={{ textAlign: "center", padding: "2rem 0", color: "#F59E0B" }}>
      <div
        style={{
          width: 32,
          height: 32,
          border: "3px solid rgba(245,158,11,0.2)",
          borderTop: "3px solid #F59E0B",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          margin: "0 auto 0.75rem",
        }}
      />
      <div style={{ fontSize: "0.82rem", color: "#6B7280" }}>
        Sedang memproses...
      </div>
    </div>
  );
}

function ErrorBox({ msg }) {
  if (!msg) return null;
  return <div style={styles.error}>⚠️ {msg}</div>;
}

function PageHeader({ featureKey }) {
  const f = FEATURES[featureKey];
  const sec = f.section;
  const col = SECTION_COLORS[sec] || SECTION_COLORS["Manipulasi Teks"];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        marginBottom: "1.75rem",
        paddingBottom: "1.25rem",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          background: col.bg,
          border: `1px solid ${col.border}`,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.4rem",
          flexShrink: 0,
        }}
      >
        {f.icon}
      </div>
      <div>
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.5rem",
            fontWeight: 600,
            color: "#F3F4F6",
            lineHeight: 1.2,
          }}
        >
          {f.label}
        </div>
        {sec && (
          <span
            style={{
              display: "inline-block",
              marginTop: 5,
              padding: "2px 10px",
              background: col.bg,
              border: `1px solid ${col.border}`,
              borderRadius: 99,
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: col.accent,
            }}
          >
            {sec}
          </span>
        )}
      </div>
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={copy}
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8,
        color: "#9CA3AF",
        fontSize: "0.75rem",
        padding: "0.35rem 0.75rem",
        cursor: "pointer",
        marginTop: "0.75rem",
      }}
    >
      {copied ? "✅ Tersalin!" : "📋 Salin"}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════
// FEATURE PAGES
// ═══════════════════════════════════════════════════════════

function PageSummarizer({ apiKey }) {
  const { result, loading, error, run } = useAI(apiKey);
  const [teks, setTeks] = useState("");
  const [pjg, setPjg] = useState("7–10 poin (sedang)");
  const [gaya, setGaya] = useState("Bullet points");

  const handle = () => {
    if (!teks.trim()) return;
    const n = pjg.split("–")[0].trim() + "–" + pjg.split("–")[1].split(" ")[0];
    run({
      prompt: `Ringkas teks ini menjadi ${n} poin utama dalam format ${gaya}, bahasa Indonesia akademik. Mulai langsung tanpa basa-basi. Akhiri dengan 1 kalimat 'Kesimpulan:'.\n\nTEKS:\n${teks}`,
    });
  };

  return (
    <div>
      <PageHeader featureKey="summarizer" />
      <Field label="Teks yang ingin diringkas">
        <textarea
          style={{ ...styles.textarea, minHeight: 160 }}
          value={teks}
          onChange={(e) => setTeks(e.target.value)}
          placeholder="Paste jurnal, materi kuliah, atau artikel di sini..."
        />
      </Field>
      <Grid>
        <Field label="Panjang ringkasan">
          <select
            style={styles.select}
            value={pjg}
            onChange={(e) => setPjg(e.target.value)}
          >
            {[
              "3–5 poin (singkat)",
              "7–10 poin (sedang)",
              "10–15 poin (detail)",
            ].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="Format output">
          <select
            style={styles.select}
            value={gaya}
            onChange={(e) => setGaya(e.target.value)}
          >
            {["Bullet points", "Paragraf naratif", "Poin + penjelasan"].map(
              (v) => (
                <option key={v}>{v}</option>
              ),
            )}
          </select>
        </Field>
      </Grid>
      <button
        style={styles.btnPrimary}
        onClick={handle}
        disabled={loading || !teks.trim()}
      >
        📝 Ringkas Sekarang
      </button>
      {loading && <LoadingSpinner />}
      <ErrorBox msg={error} />
      <ResultBox text={result} />
      {result && <CopyButton text={result} />}
    </div>
  );
}

function PageParaphraser({ apiKey }) {
  const { result, loading, error, run } = useAI(apiKey);
  const [teks, setTeks] = useState("");
  const [lvl, setLvl] = useState("Sedang");
  const [reg, setReg] = useState("Formal akademik");

  const handle = () => {
    if (!teks.trim()) return;
    run({
      prompt: `Parafrase teks berikut dengan perubahan ${lvl} dan register ${reg}. Pertahankan makna, ubah struktur dan kosakata. Hanya berikan hasil parafrasenya saja.\n\nTEKS:\n${teks}`,
    });
  };

  return (
    <div>
      <PageHeader featureKey="paraphraser" />
      <Field label="Teks yang ingin diparafrase">
        <textarea
          style={{ ...styles.textarea, minHeight: 150 }}
          value={teks}
          onChange={(e) => setTeks(e.target.value)}
          placeholder="Paste teks yang ingin diubah agar tidak terdeteksi plagiarisme..."
        />
      </Field>
      <Grid>
        <Field label="Tingkat perubahan">
          <select
            style={styles.select}
            value={lvl}
            onChange={(e) => setLvl(e.target.value)}
          >
            {["Rendah", "Sedang", "Tinggi (sangat berbeda)"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="Register bahasa">
          <select
            style={styles.select}
            value={reg}
            onChange={(e) => setReg(e.target.value)}
          >
            {["Formal akademik", "Semi-formal", "Jurnal ilmiah"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
      </Grid>
      <button
        style={styles.btnPrimary}
        onClick={handle}
        disabled={loading || !teks.trim()}
      >
        🔄 Parafrase Sekarang
      </button>
      {loading && <LoadingSpinner />}
      <ErrorBox msg={error} />
      {result && (
        <Grid>
          <div>
            <Label>Teks Asli</Label>
            <div
              style={{
                ...styles.result,
                borderLeftColor: "#6B7280",
                maxHeight: 200,
                overflowY: "auto",
              }}
            >
              {teks}
            </div>
          </div>
          <div>
            <Label>Hasil Parafrase</Label>
            <ResultBox text={result} />
            <CopyButton text={result} />
          </div>
        </Grid>
      )}
    </div>
  );
}

function PageGrammar({ apiKey }) {
  const { result, loading, error, run } = useAI(apiKey);
  const [teks, setTeks] = useState("");
  const [mode, setMode] = useState("Koreksi + Penjelasan");

  const handle = () => {
    if (!teks.trim()) return;
    const prompts = {
      "Koreksi + Penjelasan": `Koreksi teks berikut sesuai PUEBI. Format:\n**TEKS TERKOREKSI:**\n[teks]\n\n**DAFTAR KOREKSI:**\n[list tiap koreksi dengan aturannya]\n\n**RINGKASAN:**\n[jenis kesalahan]\n\nTEKS:\n${teks}`,
      "Koreksi Saja": `Koreksi teks berikut sesuai PUEBI. Berikan HANYA teks yang sudah benar.\n\nTEKS:\n${teks}`,
      "Daftar Kesalahan": `Analisis dan buat daftar kesalahan PUEBI saja (format: • [teks salah] → [teks benar]: [aturan]).\n\nTEKS:\n${teks}`,
    };
    run({ prompt: prompts[mode] });
  };

  return (
    <div>
      <PageHeader featureKey="grammar" />
      <Field label="Teks yang ingin dikoreksi">
        <textarea
          style={{ ...styles.textarea, minHeight: 160 }}
          value={teks}
          onChange={(e) => setTeks(e.target.value)}
          placeholder="Masukkan tulisan kamu untuk dikoreksi sesuai PUEBI..."
        />
      </Field>
      <Field label="Mode koreksi">
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {["Koreksi + Penjelasan", "Koreksi Saja", "Daftar Kesalahan"].map(
            (m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  padding: "0.45rem 0.9rem",
                  borderRadius: 8,
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  border: `1px solid ${mode === m ? "rgba(245,158,11,0.5)" : "rgba(255,255,255,0.08)"}`,
                  background:
                    mode === m ? "rgba(245,158,11,0.12)" : "transparent",
                  color: mode === m ? "#F59E0B" : "#9CA3AF",
                  cursor: "pointer",
                }}
              >
                {m}
              </button>
            ),
          )}
        </div>
      </Field>
      <button
        style={styles.btnPrimary}
        onClick={handle}
        disabled={loading || !teks.trim()}
      >
        ✅ Koreksi Sekarang
      </button>
      {loading && <LoadingSpinner />}
      <ErrorBox msg={error} />
      <ResultBox text={result} />
      {result && <CopyButton text={result} />}
    </div>
  );
}

function PageTone({ apiKey }) {
  const { result, loading, error, run } = useAI(apiKey);
  const [teks, setTeks] = useState("");
  const [dari, setDari] = useState("Santai/Gaul");
  const [ke, setKe] = useState("Formal Akademik");

  const handle = () => {
    if (!teks.trim()) return;
    run({
      prompt: `Ubah nada tulisan dari '${dari}' ke '${ke}'. Pertahankan makna. Berikan HANYA hasilnya.\n\nTEKS:\n${teks}`,
    });
  };

  return (
    <div>
      <PageHeader featureKey="tone" />
      <Field label="Teks yang ingin diubah nadanya">
        <textarea
          style={{ ...styles.textarea, minHeight: 140 }}
          value={teks}
          onChange={(e) => setTeks(e.target.value)}
          placeholder="Contoh: 'gue rasa ini penting banget buat ngebantu orang...'"
        />
      </Field>
      <Grid>
        <Field label="Dari nada">
          <select
            style={styles.select}
            value={dari}
            onChange={(e) => setDari(e.target.value)}
          >
            {["Santai/Gaul", "Semi-formal", "Bahasa medsos", "Percakapan"].map(
              (v) => (
                <option key={v}>{v}</option>
              ),
            )}
          </select>
        </Field>
        <Field label="Ke nada">
          <select
            style={styles.select}
            value={ke}
            onChange={(e) => setKe(e.target.value)}
          >
            {[
              "Formal Akademik",
              "Jurnal ilmiah",
              "Laporan resmi",
              "Semi-formal ilmiah",
            ].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
      </Grid>
      <button
        style={styles.btnPrimary}
        onClick={handle}
        disabled={loading || !teks.trim()}
      >
        🎭 Transformasi
      </button>
      {loading && <LoadingSpinner />}
      <ErrorBox msg={error} />
      {result && (
        <Grid>
          <div>
            <Label>Asli ({dari})</Label>
            <div
              style={{
                ...styles.result,
                borderLeftColor: "#6B7280",
                maxHeight: 200,
                overflowY: "auto",
              }}
            >
              {teks}
            </div>
          </div>
          <div>
            <Label>Hasil ({ke})</Label>
            <ResultBox text={result} />
            <CopyButton text={result} />
          </div>
        </Grid>
      )}
    </div>
  );
}

function PageIdeas({ apiKey }) {
  const { result, loading, error, run } = useAI(apiKey);
  const [bidang, setBidang] = useState("");
  const [minat, setMinat] = useState("");
  const [jenjang, setJenjang] = useState("S1 (Skripsi)");
  const [n, setN] = useState(10);
  const [metode, setMetode] = useState(["Kuantitatif", "Kualitatif"]);

  const toggleMetode = (m) =>
    setMetode((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );

  const handle = () => {
    if (!bidang || !minat) return;
    run({
      prompt: `Buat tepat ${n} ide judul penelitian ${jenjang} di bidang ${bidang}, topik: ${minat}, metode: ${metode.join(", ") || "bebas"}.\n\nFormat tiap ide:\n[n]. **[JUDUL]**\n• Variabel: [variabel]\n• Metode: [metode]\n• Kontribusi: [potensi]\n• Kesulitan: [Mudah/Sedang/Tinggi]`,
      maxTokens: 3000,
    });
  };

  return (
    <div>
      <PageHeader featureKey="ideas" />
      <Grid>
        <Field label="Bidang studi">
          <input
            style={styles.input}
            value={bidang}
            onChange={(e) => setBidang(e.target.value)}
            placeholder="Teknik Informatika, Manajemen, Psikologi..."
          />
        </Field>
        <Field label="Kata kunci">
          <input
            style={styles.input}
            value={minat}
            onChange={(e) => setMinat(e.target.value)}
            placeholder="AI, UMKM, kesehatan mental, blockchain..."
          />
        </Field>
      </Grid>
      <Grid>
        <Field label="Jenjang">
          <select
            style={styles.select}
            value={jenjang}
            onChange={(e) => setJenjang(e.target.value)}
          >
            {[
              "S1 (Skripsi)",
              "S2 (Tesis)",
              "S3 (Disertasi)",
              "Tugas Akhir",
            ].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label={`Jumlah ide: ${n}`}>
          <input
            type="range"
            min={5}
            max={15}
            value={n}
            onChange={(e) => setN(+e.target.value)}
            style={{ width: "100%", accentColor: "#F59E0B", marginTop: 8 }}
          />
        </Field>
      </Grid>
      <Field label="Metode penelitian (pilih beberapa)">
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {[
            "Kuantitatif",
            "Kualitatif",
            "Mixed Method",
            "Eksperimen",
            "Studi Kasus",
            "R&D",
          ].map((m) => (
            <button
              key={m}
              onClick={() => toggleMetode(m)}
              style={{
                padding: "0.35rem 0.8rem",
                borderRadius: 8,
                fontSize: "0.78rem",
                fontWeight: 600,
                border: `1px solid ${metode.includes(m) ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.08)"}`,
                background: metode.includes(m)
                  ? "rgba(16,185,129,0.1)"
                  : "transparent",
                color: metode.includes(m) ? "#10B981" : "#9CA3AF",
                cursor: "pointer",
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </Field>
      <button
        style={styles.btnPrimary}
        onClick={handle}
        disabled={loading || !bidang || !minat}
      >
        💡 Generate {n} Ide Penelitian
      </button>
      {loading && <LoadingSpinner />}
      <ErrorBox msg={error} />
      <ResultBox text={result} accentColor="#10B981" />
      {result && <CopyButton text={result} />}
    </div>
  );
}

function PageOutline({ apiKey }) {
  const { result, loading, error, run } = useAI(apiKey);
  const [judul, setJudul] = useState("");
  const [jenis, setJenis] = useState("Skripsi (Bab 1–5)");
  const [detail, setDetail] = useState("Detail (sub-sub-bab)");
  const [lb, setLb] = useState("");

  const handle = () => {
    if (!judul.trim()) return;
    run({
      prompt: `Buat outline ${jenis} standar akademik Indonesia, tingkat ${detail}.\nJUDUL: ${judul}\n${lb ? "LATAR BELAKANG: " + lb : ""}\n\nFormat: BAB I: [NAMA]\n  1.1 [sub]\n    1.1.1 [sub-sub]`,
      maxTokens: 3000,
    });
  };

  return (
    <div>
      <PageHeader featureKey="outline" />
      <Field label="Judul penelitian">
        <input
          style={styles.input}
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          placeholder="Pengaruh Penggunaan AI terhadap Produktivitas Mahasiswa..."
        />
      </Field>
      <Grid>
        <Field label="Jenis dokumen">
          <select
            style={styles.select}
            value={jenis}
            onChange={(e) => setJenis(e.target.value)}
          >
            {[
              "Skripsi (Bab 1–5)",
              "Makalah Akademik",
              "Proposal Penelitian",
              "Laporan Penelitian",
            ].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="Tingkat detail">
          <select
            style={styles.select}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
          >
            {[
              "Garis besar",
              "Detail (sub-sub-bab)",
              "Sangat detail (+poin isi)",
            ].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
      </Grid>
      <Field label="Latar belakang singkat (opsional)">
        <textarea
          style={{ ...styles.textarea, minHeight: 80 }}
          value={lb}
          onChange={(e) => setLb(e.target.value)}
          placeholder="Tulis latar belakang singkat untuk membuat outline lebih relevan..."
        />
      </Field>
      <button
        style={styles.btnPrimary}
        onClick={handle}
        disabled={loading || !judul.trim()}
      >
        📋 Buat Outline
      </button>
      {loading && <LoadingSpinner />}
      <ErrorBox msg={error} />
      <ResultBox text={result} accentColor="#10B981" />
      {result && <CopyButton text={result} />}
    </div>
  );
}

function PageLitreview({ apiKey }) {
  const { result, loading, error, run } = useAI(apiKey);
  const [t1, setT1] = useState("");
  const [t2, setT2] = useState("");
  const [fokus, setFokus] = useState([
    "Persamaan",
    "Perbedaan",
    "Research Gap",
  ]);

  const toggleFokus = (f) =>
    setFokus((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
    );

  const handle = () => {
    if (!t1.trim() || !t2.trim()) return;
    run({
      prompt: `Bandingkan dua teks jurnal berikut. Fokus: ${fokus.join(", ")}.\n\nJURNAL 1:\n${t1}\n\nJURNAL 2:\n${t2}\n\nGunakan heading jelas untuk tiap bagian. Akhiri dengan sintesis akademik.`,
      maxTokens: 3000,
    });
  };

  return (
    <div>
      <PageHeader featureKey="litreview" />
      <Grid>
        <Field label="Jurnal 1">
          <textarea
            style={{ ...styles.textarea, minHeight: 160 }}
            value={t1}
            onChange={(e) => setT1(e.target.value)}
            placeholder="Paste abstrak jurnal pertama..."
          />
        </Field>
        <Field label="Jurnal 2">
          <textarea
            style={{ ...styles.textarea, minHeight: 160 }}
            value={t2}
            onChange={(e) => setT2(e.target.value)}
            placeholder="Paste abstrak jurnal kedua..."
          />
        </Field>
      </Grid>
      <Field label="Fokus analisis">
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {[
            "Persamaan",
            "Perbedaan",
            "Research Gap",
            "Metodologi",
            "Temuan",
            "Implikasi",
          ].map((f) => (
            <button
              key={f}
              onClick={() => toggleFokus(f)}
              style={{
                padding: "0.35rem 0.8rem",
                borderRadius: 8,
                fontSize: "0.78rem",
                fontWeight: 600,
                border: `1px solid ${fokus.includes(f) ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.08)"}`,
                background: fokus.includes(f)
                  ? "rgba(16,185,129,0.1)"
                  : "transparent",
                color: fokus.includes(f) ? "#10B981" : "#9CA3AF",
                cursor: "pointer",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </Field>
      <button
        style={styles.btnPrimary}
        onClick={handle}
        disabled={loading || !t1.trim() || !t2.trim()}
      >
        🔍 Analisis Perbandingan
      </button>
      {loading && <LoadingSpinner />}
      <ErrorBox msg={error} />
      <ResultBox text={result} accentColor="#10B981" />
      {result && <CopyButton text={result} />}
    </div>
  );
}

function PageArgument({ apiKey }) {
  const { result, loading, error, run } = useAI(apiKey);
  const [topik, setTopik] = useState("");
  const [ctx, setCtx] = useState("Debat akademik");
  const [n, setN] = useState("5 per sisi");

  const handle = () => {
    if (!topik.trim()) return;
    const num = n.split(" ")[0];
    run({
      prompt: `Susun ${num} argumen PRO dan ${num} KONTRA untuk topik '${topik}' dalam konteks ${ctx}.\nFormat tiap argumen:\n[n]. **[Poin Utama]**\n   - Elaborasi: ...\n   - Bukti/Data: ...\n\nAkhiri dengan bagian '💡 POSISI PALING KUAT'.`,
      maxTokens: 3000,
    });
  };

  return (
    <div>
      <PageHeader featureKey="argument" />
      <Field label="Topik / mosi debat">
        <input
          style={styles.input}
          value={topik}
          onChange={(e) => setTopik(e.target.value)}
          placeholder="Apakah AI harus digunakan dalam sistem pendidikan Indonesia?"
        />
      </Field>
      <Grid>
        <Field label="Konteks">
          <select
            style={styles.select}
            value={ctx}
            onChange={(e) => setCtx(e.target.value)}
          >
            {[
              "Debat akademik",
              "Esai argumentatif",
              "Diskusi kelas",
              "Jurnal opini",
            ].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="Jumlah argumen">
          <select
            style={styles.select}
            value={n}
            onChange={(e) => setN(e.target.value)}
          >
            {["3 per sisi", "5 per sisi", "7 per sisi"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
      </Grid>
      <button
        style={styles.btnPrimary}
        onClick={handle}
        disabled={loading || !topik.trim()}
      >
        ⚖️ Bangun Argumen
      </button>
      {loading && <LoadingSpinner />}
      <ErrorBox msg={error} />
      <ResultBox text={result} accentColor="#10B981" />
      {result && <CopyButton text={result} />}
    </div>
  );
}

function PageTranslator({ apiKey }) {
  const { result, loading, error, run } = useAI(apiKey);
  const [teks, setTeks] = useState("");
  const [arah, setArah] = useState("ID → EN");
  const [bid, setBid] = useState("");

  const handle = () => {
    if (!teks.trim()) return;
    const pr =
      arah === "ID → EN"
        ? `Terjemahkan ke Academic English standar jurnal internasional.${bid ? " Bidang: " + bid + "." : ""} Berikan HANYA terjemahannya.\n\nABSTRAK:\n${teks}`
        : `Terjemahkan ke Bahasa Indonesia baku akademis sesuai PUEBI.${bid ? " Bidang: " + bid + "." : ""} Berikan HANYA terjemahannya.\n\nABSTRACT:\n${teks}`;
    run({ prompt: pr });
  };

  return (
    <div>
      <PageHeader featureKey="translator" />
      <Field label="Arah terjemahan">
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["ID → EN", "EN → ID"].map((a) => (
            <button
              key={a}
              onClick={() => setArah(a)}
              style={{
                padding: "0.45rem 1rem",
                borderRadius: 8,
                fontSize: "0.82rem",
                fontWeight: 600,
                border: `1px solid ${arah === a ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.08)"}`,
                background: arah === a ? "rgba(139,92,246,0.1)" : "transparent",
                color: arah === a ? "#8B5CF6" : "#9CA3AF",
                cursor: "pointer",
              }}
            >
              {a === "ID → EN"
                ? "🇮🇩 Indonesia → 🇬🇧 English"
                : "🇬🇧 English → 🇮🇩 Indonesia"}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Abstrak">
        <textarea
          style={{ ...styles.textarea, minHeight: 160 }}
          value={teks}
          onChange={(e) => setTeks(e.target.value)}
          placeholder="Paste abstrak jurnal atau skripsi..."
        />
      </Field>
      <Field label="Bidang ilmu (opsional)">
        <input
          style={styles.input}
          value={bid}
          onChange={(e) => setBid(e.target.value)}
          placeholder="Informatika, Ekonomi, Kedokteran..."
        />
      </Field>
      <button
        style={styles.btnPrimary}
        onClick={handle}
        disabled={loading || !teks.trim()}
      >
        🌐 Terjemahkan
      </button>
      {loading && <LoadingSpinner />}
      <ErrorBox msg={error} />
      {result && (
        <Grid>
          <div>
            <Label>Teks Asli</Label>
            <div
              style={{
                ...styles.result,
                borderLeftColor: "#6B7280",
                maxHeight: 200,
                overflowY: "auto",
              }}
            >
              {teks}
            </div>
          </div>
          <div>
            <Label>Hasil Terjemahan</Label>
            <ResultBox text={result} accentColor="#8B5CF6" />
            <CopyButton text={result} />
          </div>
        </Grid>
      )}
    </div>
  );
}

function PageCitation({ apiKey }) {
  const { result, loading, error, run } = useAI(apiKey);
  const [src, setSrc] = useState("");
  const [fmt, setFmt] = useState("APA 7th Edition");

  const handle = () => {
    if (!src.trim()) return;
    run({
      prompt: `Format tiap sumber ke ${fmt}. Urutkan alfabetis, beri nomor. Jika info kurang gunakan [n.d.] atau [n.p.].\n\nSUMBER:\n${src}\n\nOutput: DAFTAR PUSTAKA (${fmt})\n1. ...`,
      maxTokens: 2000,
    });
  };

  return (
    <div>
      <PageHeader featureKey="citation" />
      <Field label="Format sitasi">
        <select
          style={styles.select}
          value={fmt}
          onChange={(e) => setFmt(e.target.value)}
        >
          {[
            "APA 7th Edition",
            "MLA 9th Edition",
            "Harvard",
            "Chicago",
            "Vancouver",
            "IEEE",
          ].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </Field>
      <Field label="Daftar sumber (satu per baris)">
        <textarea
          style={{ ...styles.textarea, minHeight: 160 }}
          value={src}
          onChange={(e) => setSrc(e.target.value)}
          placeholder={
            "https://...\nNama, Tahun, Judul, Penerbit\ndoi:10.xxx/..."
          }
        />
      </Field>
      <button
        style={styles.btnPrimary}
        onClick={handle}
        disabled={loading || !src.trim()}
      >
        📌 Format Sitasi
      </button>
      {loading && <LoadingSpinner />}
      <ErrorBox msg={error} />
      <ResultBox text={result} accentColor="#8B5CF6" />
      {result && <CopyButton text={result} />}
    </div>
  );
}

function PageData({ apiKey }) {
  const { result, loading, error, run } = useAI(apiKey);
  const [raw, setRaw] = useState("");
  const [ctx, setCtx] = useState("");
  const [gaya, setGaya] = useState("Bab hasil penelitian");

  const handle = () => {
    if (!raw.trim()) return;
    run({
      prompt: `Ubah data berikut menjadi narasi ${gaya} dalam bahasa Indonesia akademik. Konteks: ${ctx || "data penelitian"}. Interpretasikan tren, pola, temuan. Tulis 3–5 paragraf komprehensif.\n\nDATA:\n${raw}`,
      maxTokens: 2000,
    });
  };

  return (
    <div>
      <PageHeader featureKey="data" />
      <Field label="Data mentah (angka/tabel/statistik)">
        <textarea
          style={{ ...styles.textarea, minHeight: 150 }}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={
            "Tahun 2020: n=1200, kepuasan=78%\nTahun 2021: n=1850, kepuasan=82%\n..."
          }
        />
      </Field>
      <Grid>
        <Field label="Konteks penelitian">
          <input
            style={styles.input}
            value={ctx}
            onChange={(e) => setCtx(e.target.value)}
            placeholder="survei kepuasan mahasiswa..."
          />
        </Field>
        <Field label="Gaya narasi">
          <select
            style={styles.select}
            value={gaya}
            onChange={(e) => setGaya(e.target.value)}
          >
            {[
              "Bab hasil penelitian",
              "Analisis kritis",
              "Ringkasan eksekutif",
              "Laporan",
            ].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
      </Grid>
      <button
        style={styles.btnPrimary}
        onClick={handle}
        disabled={loading || !raw.trim()}
      >
        📊 Jelaskan Data
      </button>
      {loading && <LoadingSpinner />}
      <ErrorBox msg={error} />
      <ResultBox text={result} accentColor="#8B5CF6" />
      {result && <CopyButton text={result} />}
    </div>
  );
}

function PageKeywords({ apiKey }) {
  const { result, loading, error, run } = useAI(apiKey);
  const [topik, setTopik] = useState("");
  const [db, setDb] = useState(["Google Scholar", "Scopus"]);
  const [n, setN] = useState(20);

  const toggleDb = (d) =>
    setDb((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );

  const handle = () => {
    if (!topik.trim()) return;
    run({
      prompt: `Buat ${n} variasi kata kunci English untuk mencari jurnal di ${db.join(", ")} tentang: ${topik}.\n\nSediakan:\n## KATA KUNCI UTAMA\n## SINONIM & VARIASI\n## BOOLEAN SEARCH STRINGS (contoh siap pakai)\n## TIPS PENCARIAN`,
      maxTokens: 2000,
    });
  };

  return (
    <div>
      <PageHeader featureKey="keywords" />
      <Field label="Topik penelitian">
        <input
          style={styles.input}
          value={topik}
          onChange={(e) => setTopik(e.target.value)}
          placeholder="dampak media sosial pada prestasi belajar mahasiswa..."
        />
      </Field>
      <Grid>
        <Field label="Database target">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {[
              "Google Scholar",
              "Scopus",
              "Web of Science",
              "PubMed",
              "IEEE Xplore",
            ].map((d) => (
              <button
                key={d}
                onClick={() => toggleDb(d)}
                style={{
                  padding: "0.32rem 0.65rem",
                  borderRadius: 8,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  border: `1px solid ${db.includes(d) ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.08)"}`,
                  background: db.includes(d)
                    ? "rgba(139,92,246,0.1)"
                    : "transparent",
                  color: db.includes(d) ? "#8B5CF6" : "#9CA3AF",
                  cursor: "pointer",
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </Field>
        <Field label={`Jumlah kata kunci: ${n}`}>
          <input
            type="range"
            min={10}
            max={30}
            value={n}
            onChange={(e) => setN(+e.target.value)}
            style={{ width: "100%", accentColor: "#8B5CF6", marginTop: 8 }}
          />
        </Field>
      </Grid>
      <button
        style={styles.btnPrimary}
        onClick={handle}
        disabled={loading || !topik.trim()}
      >
        🔑 Cari Kata Kunci
      </button>
      {loading && <LoadingSpinner />}
      <ErrorBox msg={error} />
      <ResultBox text={result} accentColor="#8B5CF6" />
      {result && <CopyButton text={result} />}
    </div>
  );
}

function PageConcept({ apiKey }) {
  const { result, loading, error, run } = useAI(apiKey);
  const [konsep, setKonsep] = useState("");
  const [lvl, setLvl] = useState("Mahasiswa umum");
  const [gaya, setGaya] = useState("Kehidupan sehari-hari");

  const handle = () => {
    if (!konsep.trim()) return;
    run({
      prompt: `Jelaskan '${konsep}' untuk ${lvl} dengan analogi ${gaya}.\n\nFormat:\n🎯 **APA ITU ${konsep.toUpperCase()}?** [1 kalimat]\n\n🎬 **ANALOGI:** [analogi relatable]\n\n📖 **PENJELASAN:** [step-by-step]\n\n💡 **CONTOH NYATA:** [aplikasi dunia nyata]\n\n❓ **CEK PEMAHAMAN:** [2-3 pertanyaan singkat]`,
      maxTokens: 2000,
    });
  };

  return (
    <div>
      <PageHeader featureKey="concept" />
      <Field label="Konsep / teori">
        <input
          style={styles.input}
          value={konsep}
          onChange={(e) => setKonsep(e.target.value)}
          placeholder="Teori Relativitas, Blockchain, Teori Disonansi Kognitif..."
        />
      </Field>
      <Grid>
        <Field label="Level pembaca">
          <select
            style={styles.select}
            value={lvl}
            onChange={(e) => setLvl(e.target.value)}
          >
            {[
              "Pemula (SMA)",
              "Mahasiswa awal",
              "Mahasiswa umum",
              "Profesional non-bidang",
            ].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="Gaya analogi">
          <select
            style={styles.select}
            value={gaya}
            onChange={(e) => setGaya(e.target.value)}
          >
            {[
              "Kehidupan sehari-hari",
              "Olahraga",
              "Makanan",
              "Teknologi populer",
              "Bebas",
            ].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
      </Grid>
      <button
        style={styles.btnPrimary}
        onClick={handle}
        disabled={loading || !konsep.trim()}
      >
        🧩 Sederhanakan Konsep
      </button>
      {loading && <LoadingSpinner />}
      <ErrorBox msg={error} />
      <ResultBox text={result} accentColor="#38BDF8" />
      {result && <CopyButton text={result} />}
    </div>
  );
}

function PageExam({ apiKey }) {
  const { result, loading, error, run } = useAI(apiKey);
  const [materi, setMateri] = useState("");
  const [tipe, setTipe] = useState("Pilihan Ganda (MCQ)");
  const [n, setN] = useState(10);
  const [diff, setDiff] = useState("Campuran");
  const [kunci, setKunci] = useState(true);

  const handle = () => {
    if (!materi.trim()) return;
    run({
      prompt: `Buat ${n} soal ${tipe}, kesulitan ${diff} dari materi berikut. ${kunci ? "Sertakan kunci + penjelasan di akhir." : "Tanpa kunci jawaban."} Untuk MCQ: 4 pilihan (A–D).\n\nMATERI:\n${materi}`,
      maxTokens: 4000,
    });
  };

  return (
    <div>
      <PageHeader featureKey="exam" />
      <Field label="Catatan / materi ujian">
        <textarea
          style={{ ...styles.textarea, minHeight: 160 }}
          value={materi}
          onChange={(e) => setMateri(e.target.value)}
          placeholder="Paste catatan atau ringkasan materi yang ingin dibuat soalnya..."
        />
      </Field>
      <Grid cols={3}>
        <Field label="Tipe soal">
          <select
            style={styles.select}
            value={tipe}
            onChange={(e) => setTipe(e.target.value)}
          >
            {[
              "Pilihan Ganda (MCQ)",
              "Esai pendek",
              "Benar/Salah",
              "Mix (MCQ + Esai)",
            ].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label={`Jumlah soal: ${n}`}>
          <input
            type="range"
            min={5}
            max={30}
            value={n}
            onChange={(e) => setN(+e.target.value)}
            style={{ width: "100%", accentColor: "#38BDF8", marginTop: 8 }}
          />
        </Field>
        <Field label="Tingkat kesulitan">
          <select
            style={styles.select}
            value={diff}
            onChange={(e) => setDiff(e.target.value)}
          >
            {[
              "Mudah (C1-C2)",
              "Sedang (C3-C4)",
              "Sulit (C5-C6)",
              "Campuran",
            ].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
      </Grid>
      <Field label="">
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={kunci}
            onChange={(e) => setKunci(e.target.checked)}
            style={{ accentColor: "#38BDF8" }}
          />
          <span style={{ color: "#9CA3AF", fontSize: "0.85rem" }}>
            Sertakan kunci jawaban & penjelasan
          </span>
        </label>
      </Field>
      <button
        style={styles.btnPrimary}
        onClick={handle}
        disabled={loading || !materi.trim()}
      >
        📖 Buat {n} Soal
      </button>
      {loading && <LoadingSpinner />}
      <ErrorBox msg={error} />
      <ResultBox text={result} accentColor="#38BDF8" />
      {result && <CopyButton text={result} />}
    </div>
  );
}

function PageEmail({ apiKey }) {
  const { result, loading, error, run } = useAI(apiKey);
  const [jenis, setJenis] = useState("Email formal");
  const [namaMhs, setNamaMhs] = useState("");
  const [nim, setNim] = useState("");
  const [dosen, setDosen] = useState("");
  const [matkul, setMatkul] = useState("");
  const [keperluan, setKeperluan] = useState("");

  const handle = () => {
    if (!namaMhs || !dosen || !keperluan) return;
    const fmt = {
      "Email formal":
        "email formal (subjek, salam, isi, penutup, tanda tangan)",
      "Pesan WhatsApp": "pesan WhatsApp sopan 5–7 kalimat",
      "Surat resmi": "surat resmi format Indonesia",
    };
    run({
      prompt: `Buat ${fmt[jenis]} dari ${namaMhs}${nim ? " (NIM: " + nim + ")" : ""} ke ${dosen}, matkul: ${matkul || "tidak disebutkan"}, keperluan: ${keperluan}. Bahasa Indonesia formal, sopan, dan natural.`,
    });
  };

  return (
    <div>
      <PageHeader featureKey="email" />
      <Field label="Jenis pesan">
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["Email formal", "Pesan WhatsApp", "Surat resmi"].map((j) => (
            <button
              key={j}
              onClick={() => setJenis(j)}
              style={{
                padding: "0.45rem 0.9rem",
                borderRadius: 8,
                fontSize: "0.8rem",
                fontWeight: 600,
                border: `1px solid ${jenis === j ? "rgba(244,63,94,0.5)" : "rgba(255,255,255,0.08)"}`,
                background:
                  jenis === j ? "rgba(244,63,94,0.08)" : "transparent",
                color: jenis === j ? "#F43F5E" : "#9CA3AF",
                cursor: "pointer",
              }}
            >
              {j}
            </button>
          ))}
        </div>
      </Field>
      <Grid>
        <Field label="Nama kamu">
          <input
            style={styles.input}
            value={namaMhs}
            onChange={(e) => setNamaMhs(e.target.value)}
            placeholder="Nama lengkap"
          />
        </Field>
        <Field label="NIM (opsional)">
          <input
            style={styles.input}
            value={nim}
            onChange={(e) => setNim(e.target.value)}
            placeholder="123456789"
          />
        </Field>
        <Field label="Nama dosen">
          <input
            style={styles.input}
            value={dosen}
            onChange={(e) => setDosen(e.target.value)}
            placeholder="Prof. Dr. ..."
          />
        </Field>
        <Field label="Mata kuliah">
          <input
            style={styles.input}
            value={matkul}
            onChange={(e) => setMatkul(e.target.value)}
            placeholder="Metodologi Penelitian"
          />
        </Field>
      </Grid>
      <Field label="Keperluan">
        <textarea
          style={{ ...styles.textarea, minHeight: 90 }}
          value={keperluan}
          onChange={(e) => setKeperluan(e.target.value)}
          placeholder="Izin tidak hadir / Menanyakan jadwal bimbingan / Meminta perpanjangan deadline..."
        />
      </Field>
      <button
        style={styles.btnPrimary}
        onClick={handle}
        disabled={loading || !namaMhs || !dosen || !keperluan}
      >
        📧 Buat Pesan
      </button>
      {loading && <LoadingSpinner />}
      <ErrorBox msg={error} />
      <ResultBox text={result} accentColor="#F43F5E" />
      {result && <CopyButton text={result} />}
    </div>
  );
}

function PageActionitem({ apiKey }) {
  const { result, loading, error, run } = useAI(apiKey);
  const [notulensi, setNotulensi] = useState("");
  const [fmt, setFmt] = useState("To-Do per PIC");
  const [dl, setDl] = useState(true);

  const handle = () => {
    if (!notulensi.trim()) return;
    run({
      prompt: `Ekstrak semua action items dari notulensi, format ${fmt}. ${dl ? "Ekstrak deadline dari konteks." : "Tandai deadline [TBD]."} Beri prioritas (🔴/🟡/🟢) dan status ⬜.\n\nNOTULENSI:\n${notulensi}`,
      maxTokens: 2000,
    });
  };

  return (
    <div>
      <PageHeader featureKey="actionitem" />
      <Field label="Notulensi rapat">
        <textarea
          style={{ ...styles.textarea, minHeight: 180 }}
          value={notulensi}
          onChange={(e) => setNotulensi(e.target.value)}
          placeholder={
            "Rapat BEM, 10 Des 2024\nHadir: Andi (Ketua), Budi...\n\nPembahasan:\n1. Andi koordinasi venue minggu ini..."
          }
        />
      </Field>
      <Grid>
        <Field label="Format output">
          <select
            style={styles.select}
            value={fmt}
            onChange={(e) => setFmt(e.target.value)}
          >
            {[
              "To-Do per PIC",
              "To-Do per Deadline",
              "Tabel terstruktur",
              "Checklist",
            ].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="">
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              marginTop: 24,
            }}
          >
            <input
              type="checkbox"
              checked={dl}
              onChange={(e) => setDl(e.target.checked)}
              style={{ accentColor: "#F43F5E" }}
            />
            <span style={{ color: "#9CA3AF", fontSize: "0.85rem" }}>
              Ekstrak deadline otomatis
            </span>
          </label>
        </Field>
      </Grid>
      <button
        style={styles.btnPrimary}
        onClick={handle}
        disabled={loading || !notulensi.trim()}
      >
        ✅ Ekstrak Action Items
      </button>
      {loading && <LoadingSpinner />}
      <ErrorBox msg={error} />
      <ResultBox text={result} accentColor="#F43F5E" />
      {result && <CopyButton text={result} />}
    </div>
  );
}

function PageScript({ apiKey }) {
  const { result, loading, error, run } = useAI(apiKey);
  const [slide, setSlide] = useState("");
  const [dur, setDur] = useState("10 menit");
  const [gaya, setGaya] = useState("Formal akademik");
  const [aud, setAud] = useState("Dosen penguji");

  const handle = () => {
    if (!slide.trim()) return;
    run({
      prompt: `Buat naskah bicara presentasi, durasi ${dur}, gaya ${gaya}, audiens ${aud}. Sertakan [JEDA], [TUNJUK SLIDE], transisi antar slide, pembuka menarik, penutup berkesan, timing [0:00–x:xx].\n\nSLIDE:\n${slide}`,
      maxTokens: 3000,
    });
  };

  return (
    <div>
      <PageHeader featureKey="script" />
      <Field label="Poin-poin slide">
        <textarea
          style={{ ...styles.textarea, minHeight: 160 }}
          value={slide}
          onChange={(e) => setSlide(e.target.value)}
          placeholder={
            "Slide 1: Judul\nSlide 2: Latar Belakang — 85% mahasiswa...\nSlide 3: Metodologi — survei 200 responden..."
          }
        />
      </Field>
      <Grid cols={3}>
        <Field label="Durasi">
          <select
            style={styles.select}
            value={dur}
            onChange={(e) => setDur(e.target.value)}
          >
            {["5 menit", "10 menit", "15 menit", "20 menit", "30 menit"].map(
              (v) => (
                <option key={v}>{v}</option>
              ),
            )}
          </select>
        </Field>
        <Field label="Gaya bicara">
          <select
            style={styles.select}
            value={gaya}
            onChange={(e) => setGaya(e.target.value)}
          >
            {[
              "Formal akademik",
              "Sidang skripsi",
              "Semi-formal",
              "Presentasi bisnis",
            ].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="Audiens">
          <select
            style={styles.select}
            value={aud}
            onChange={(e) => setAud(e.target.value)}
          >
            {[
              "Dosen penguji",
              "Mahasiswa & dosen",
              "Umum",
              "Rekan mahasiswa",
            ].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
      </Grid>
      <button
        style={styles.btnPrimary}
        onClick={handle}
        disabled={loading || !slide.trim()}
      >
        🎤 Buat Naskah Presentasi
      </button>
      {loading && <LoadingSpinner />}
      <ErrorBox msg={error} />
      <ResultBox text={result} accentColor="#F43F5E" />
      {result && <CopyButton text={result} />}
    </div>
  );
}

function PageWellness({ apiKey }) {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const send = async (msg) => {
    if (!msg.trim() || !apiKey) return;
    const userMsg = { role: "user", content: msg };
    const newHistory = [...history, userMsg];
    setHistory(newHistory);
    setInput("");
    setLoading(true);
    try {
      const text = await callAI({
        apiKey,
        prompt: msg,
        system: WELLNESS_SYSTEM,
        history: history,
      });
      setHistory((prev) => [...prev, { role: "assistant", content: text }]);
    } catch (e) {
      setHistory((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ " + e.message },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "Cara atasi prokrastinasi?",
    "Tips belajar saat deadline numpuk",
    "Aku overwhelmed banget",
  ];

  return (
    <div>
      <PageHeader featureKey="wellness" />
      <div
        style={{
          background: "#0D1420",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.06)",
          minHeight: 300,
          maxHeight: 420,
          overflowY: "auto",
          padding: "1rem 1.25rem",
        }}
      >
        {history.length === 0 && (
          <div
            style={{ textAlign: "center", padding: "2rem", color: "#374151" }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>💚</div>
            <div style={{ fontSize: "0.85rem" }}>
              Hei! Aku di sini buat dengerin kamu. Cerita dulu yuk 😊
            </div>
          </div>
        )}
        {history.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: "0.75rem",
            }}
          >
            <div
              style={{
                maxWidth: "82%",
                padding: "0.75rem 1rem",
                borderRadius:
                  msg.role === "user"
                    ? "14px 14px 4px 14px"
                    : "4px 14px 14px 14px",
                background:
                  msg.role === "user" ? "rgba(245,158,11,0.12)" : "#1C2535",
                border: `1px solid ${msg.role === "user" ? "rgba(245,158,11,0.25)" : "rgba(255,255,255,0.07)"}`,
                fontSize: "0.85rem",
                lineHeight: 1.7,
                color: "#F3F4F6",
                whiteSpace: "pre-wrap",
              }}
            >
              <div
                style={{
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 4,
                  opacity: 0.5,
                }}
              >
                {msg.role === "user" ? "Kamu" : "💚 CampusMate"}
              </div>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "0.75rem",
            }}
          >
            <div
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "4px 14px 14px 14px",
                background: "#1C2535",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "#6B7280",
                fontSize: "0.85rem",
              }}
            >
              ✍️ Mengetik...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
        <input
          style={{ ...styles.input, flex: 1 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Ceritakan apa yang kamu rasakan..."
          disabled={loading}
        />
        <button
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
          style={{
            background: "linear-gradient(135deg, #10B981, #059669)",
            color: "white",
            border: "none",
            borderRadius: 10,
            padding: "0.6rem 1rem",
            cursor: "pointer",
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          Kirim
        </button>
        <button
          onClick={() => setHistory([])}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10,
            color: "#6B7280",
            padding: "0.6rem 0.75rem",
            cursor: "pointer",
          }}
        >
          🗑️
        </button>
      </div>
      <div
        style={{
          marginTop: "0.75rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.4rem",
        }}
      >
        {quickPrompts.map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            disabled={loading}
            style={{
              background: "rgba(16,185,129,0.06)",
              border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: 8,
              color: "#10B981",
              fontSize: "0.75rem",
              padding: "0.32rem 0.75rem",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════════════════════
function HomePage({ onNavigate }) {
  return (
    <div>
      {/* Hero */}
      <div style={{ paddingBottom: "1rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(245,158,11,0.10)",
            border: "1px solid rgba(245,158,11,0.25)",
            borderRadius: 99,
            padding: "4px 14px",
            marginBottom: "1.25rem",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              background: "#F59E0B",
              borderRadius: "50%",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: "0.7rem",
              color: "#F59E0B",
              fontWeight: 700,
              letterSpacing: "0.06em",
            }}
          >
            POWERED BY OPENROUTER
          </span>
        </div>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "2.4rem",
            fontWeight: 700,
            color: "#F3F4F6",
            lineHeight: 1.2,
            marginBottom: "0.75rem",
          }}
        >
          Semua yang kamu butuhkan
          <br />
          <span
            style={{
              background: "linear-gradient(90deg,#F59E0B,#10B981)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            untuk sukses akademik.
          </span>
        </h1>
        <p
          style={{
            fontSize: "0.95rem",
            color: "#9CA3AF",
            maxWidth: 520,
            lineHeight: 1.75,
          }}
        >
          19 tools AI dalam satu platform — dirancang khusus untuk mahasiswa
          Indonesia.
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0.75rem",
          margin: "1.5rem 0",
        }}
      >
        {[
          ["19", "Fitur Lengkap"],
          ["∞", "Tak Terbatas"],
          ["🇮🇩", "Bahasa Indonesia"],
          ["⚡", "Gemini 1.5 Flash"],
        ].map(([val, lbl]) => (
          <div
            key={lbl}
            style={{
              background: "#111827",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12,
              padding: "0.9rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.6rem",
                color: "#F59E0B",
                fontWeight: 700,
              }}
            >
              {val}
            </div>
            <div
              style={{ fontSize: "0.68rem", color: "#4B5563", marginTop: 2 }}
            >
              {lbl}
            </div>
          </div>
        ))}
      </div>

      {/* Feature Groups */}
      {HOME_GROUPS.map(({ name, keys }) => {
        const col = SECTION_COLORS[name] || SECTION_COLORS["Manipulasi Teks"];
        return (
          <div key={name} style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: "0.6rem",
              }}
            >
              <div
                style={{
                  width: 3,
                  height: 16,
                  background: col.accent,
                  borderRadius: 99,
                }}
              />
              <span
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: col.accent,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {name}
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${Math.min(keys.length, 4)}, 1fr)`,
                gap: "0.65rem",
              }}
            >
              {keys.map((k) => {
                const f = FEATURES[k];
                return (
                  <button
                    key={k}
                    onClick={() => onNavigate(k)}
                    style={{
                      background: col.bg,
                      border: `1px solid ${col.border}`,
                      borderRadius: 12,
                      padding: "0.9rem",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = `0 8px 24px ${col.bg}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.boxShadow = "";
                    }}
                  >
                    <div style={{ fontSize: "1.3rem", marginBottom: 6 }}>
                      {f.icon}
                    </div>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: "#F3F4F6",
                        lineHeight: 1.3,
                      }}
                    >
                      {f.label}
                    </div>
                    <div
                      style={{
                        fontSize: "0.68rem",
                        color: col.accent,
                        marginTop: 4,
                        fontWeight: 600,
                      }}
                    >
                      Buka →
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("home");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [testStatus, setTestStatus] = useState(""); // "ok" | "error" | "loading" | ""

  const testApiKey = async () => {
    if (!apiKey) return;
    setTestStatus("loading");
    try {
      await callAI({
        apiKey,
        prompt: "Balas dengan tepat satu kata: OK",
        maxTokens: 10,
      });
      setTestStatus("ok");
    } catch (e) {
      setTestStatus("error:" + e.message);
    }
  };

  const PAGE_COMPONENTS = {
    summarizer: <PageSummarizer apiKey={apiKey} />,
    paraphraser: <PageParaphraser apiKey={apiKey} />,
    grammar: <PageGrammar apiKey={apiKey} />,
    tone: <PageTone apiKey={apiKey} />,
    ideas: <PageIdeas apiKey={apiKey} />,
    outline: <PageOutline apiKey={apiKey} />,
    litreview: <PageLitreview apiKey={apiKey} />,
    argument: <PageArgument apiKey={apiKey} />,
    translator: <PageTranslator apiKey={apiKey} />,
    citation: <PageCitation apiKey={apiKey} />,
    data: <PageData apiKey={apiKey} />,
    keywords: <PageKeywords apiKey={apiKey} />,
    concept: <PageConcept apiKey={apiKey} />,
    exam: <PageExam apiKey={apiKey} />,
    email: <PageEmail apiKey={apiKey} />,
    actionitem: <PageActionitem apiKey={apiKey} />,
    script: <PageScript apiKey={apiKey} />,
    wellness: <PageWellness apiKey={apiKey} />,
  };

  // Group sections for sidebar
  const sections = {};
  Object.entries(FEATURES).forEach(([key, val]) => {
    if (key === "home") return;
    const s = val.section;
    if (!sections[s]) sections[s] = [];
    sections[s].push(key);
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Nunito:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0A0E1A; font-family: 'Nunito', sans-serif; }
        ::-webkit-scrollbar { width: 4px; background: #0A0E1A; }
        ::-webkit-scrollbar-thumb { background: #1C2535; border-radius: 99px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        select option { background: #1C2535; color: #F3F4F6; }
      `}</style>

      <div
        style={{
          display: "flex",
          height: "100vh",
          background: "#0A0E1A",
          color: "#F3F4F6",
          fontFamily: "'Nunito', sans-serif",
          overflow: "hidden",
        }}
      >
        {/* SIDEBAR */}
        <aside
          style={{
            width: sidebarOpen ? 256 : 0,
            minWidth: sidebarOpen ? 256 : 0,
            background: "#0D1420",
            borderRight: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            overflowX: "hidden",
            transition: "width 0.25s, min-width 0.25s",
            flexShrink: 0,
          }}
        >
          {/* Logo */}
          <div
            style={{
              padding: "1.25rem 1rem 0.75rem",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: "linear-gradient(135deg,#F59E0B,#D97706)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                🎓
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#F3F4F6",
                    lineHeight: 1.1,
                  }}
                >
                  CampusMate AI
                </div>
                <div
                  style={{
                    fontSize: "0.6rem",
                    color: "#374151",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginTop: 1,
                  }}
                >
                  Asisten Akademik
                </div>
              </div>
            </div>
          </div>

          {/* API Key */}
          <div
            style={{
              padding: "0.75rem 1rem",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <div
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#4B5563",
                marginBottom: "0.35rem",
              }}
            >
              🔑 OpenRouter API Key
            </div>
            <div style={{ position: "relative" }}>
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setTestStatus("");
                }}
                placeholder="sk-or-v1-..."
                style={{
                  ...styles.input,
                  fontSize: "0.78rem",
                  paddingRight: 36,
                }}
              />
              <button
                onClick={() => setShowKey((s) => !s)}
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#6B7280",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                {showKey ? "🙈" : "👁"}
              </button>
            </div>

            {/* Test button */}
            {apiKey && (
              <button
                onClick={testApiKey}
                disabled={testStatus === "loading"}
                style={{
                  width: "100%",
                  marginTop: 6,
                  padding: "0.35rem",
                  borderRadius: 7,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  color: "#9CA3AF",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                {testStatus === "loading"
                  ? "⏳ Mengetes..."
                  : "🔌 Test Koneksi API"}
              </button>
            )}

            {/* Status */}
            {testStatus === "ok" && (
              <div
                style={{
                  fontSize: "0.68rem",
                  color: "#10B981",
                  marginTop: 5,
                  background: "rgba(16,185,129,0.08)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  borderRadius: 6,
                  padding: "4px 8px",
                }}
              >
                ✅ Koneksi berhasil! API Key valid.
              </div>
            )}
            {testStatus.startsWith("error:") && (
              <div
                style={{
                  fontSize: "0.67rem",
                  color: "#F43F5E",
                  marginTop: 5,
                  background: "rgba(244,63,94,0.08)",
                  border: "1px solid rgba(244,63,94,0.2)",
                  borderRadius: 6,
                  padding: "4px 8px",
                  lineHeight: 1.5,
                }}
              >
                ❌ {testStatus.replace("error:", "")}
              </div>
            )}
            {!apiKey && (
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "#374151",
                  marginTop: 4,
                  lineHeight: 1.6,
                }}
              >
                1. Buka{" "}
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#F59E0B", textDecoration: "none" }}
                >
                  openrouter.ai/keys
                </a>
                <br />
                2. Daftar gratis (Google login OK)
                <br />
                3. Klik <strong style={{ color: "#9CA3AF" }}>
                  Create Key
                </strong>{" "}
                → copy
                <br />
                4. Paste di sini → Test Koneksi
              </div>
            )}
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "0.5rem 0.6rem", overflowY: "auto" }}>
            {/* Home */}
            <button
              onClick={() => setPage("home")}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "0.5rem 0.75rem",
                borderRadius: 8,
                background:
                  page === "home" ? "rgba(245,158,11,0.10)" : "transparent",
                border: "none",
                color: page === "home" ? "#F59E0B" : "#9CA3AF",
                fontSize: "0.82rem",
                fontWeight: page === "home" ? 700 : 500,
                cursor: "pointer",
                marginBottom: 4,
                fontFamily: "'Nunito', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              🏠 <span>Beranda</span>
            </button>

            {Object.entries(sections).map(([sec, keys]) => {
              const col =
                SECTION_COLORS[sec] || SECTION_COLORS["Manipulasi Teks"];
              return (
                <div key={sec} style={{ marginBottom: "0.5rem" }}>
                  <div
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "#374151",
                      padding: "0.6rem 0.75rem 0.2rem",
                    }}
                  >
                    {sec}
                  </div>
                  {keys.map((k) => {
                    const f = FEATURES[k];
                    const isActive = page === k;
                    return (
                      <button
                        key={k}
                        onClick={() => setPage(k)}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "0.42rem 0.75rem",
                          borderRadius: 8,
                          background: isActive ? col.bg : "transparent",
                          border: `1px solid ${isActive ? col.border : "transparent"}`,
                          color: isActive ? col.accent : "#6B7280",
                          fontSize: "0.8rem",
                          fontWeight: isActive ? 700 : 500,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                          fontFamily: "'Nunito', sans-serif",
                          transition: "all 0.15s",
                          marginBottom: 1,
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background =
                              "rgba(255,255,255,0.03)";
                            e.currentTarget.style.color = "#9CA3AF";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "#6B7280";
                          }
                        }}
                      >
                        <span style={{ fontSize: "0.9rem" }}>{f.icon}</span>
                        <span style={{ lineHeight: 1.2, fontSize: "0.78rem" }}>
                          {f.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div
            style={{
              padding: "0.75rem 1rem",
              borderTop: "1px solid rgba(255,255,255,0.04)",
              fontSize: "0.68rem",
              color: "#374151",
              lineHeight: 1.8,
              flexShrink: 0,
            }}
          >
            <span style={{ color: "#4B5563", fontWeight: 600 }}>
              Tim Pengembang
            </span>
            <br />
            Vincent · Vian · Jimmy · Reagan
            <br />
            <span style={{ color: "#F59E0B" }}>v3.0' </span> · OpenRouter
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Top bar */}
          <div
            style={{
              padding: "0.65rem 1.5rem",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(10,14,26,0.8)",
              backdropFilter: "blur(10px)",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <button
              onClick={() => setSidebarOpen((s) => !s)}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 8,
                color: "#6B7280",
                padding: "0.35rem 0.6rem",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              ☰
            </button>
            <div style={{ fontSize: "0.8rem", color: "#4B5563" }}>
              {page === "home"
                ? "🏠 Beranda"
                : `${FEATURES[page]?.icon} ${FEATURES[page]?.label}`}
            </div>
            {page !== "home" && (
              <button
                onClick={() => setPage("home")}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#F59E0B",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  marginLeft: "auto",
                  fontWeight: 600,
                }}
              >
                ← Beranda
              </button>
            )}
          </div>

          {/* Page Content */}
          <div
            style={{
              flex: 1,
              padding: "2rem",
              maxWidth: 900,
              width: "100%",
              margin: "0 auto",
              animation: "fadeIn 0.25s ease",
            }}
            key={page}
          >
            {!apiKey && page !== "home" && (
              <div
                style={{
                  background: "rgba(245,158,11,0.06)",
                  border: "1px solid rgba(245,158,11,0.2)",
                  borderRadius: 12,
                  padding: "1rem 1.25rem",
                  marginBottom: "1.25rem",
                  fontSize: "0.83rem",
                  color: "#9CA3AF",
                }}
              >
                🔑{" "}
                <strong style={{ color: "#F59E0B" }}>API Key diperlukan</strong>{" "}
                — Masukkan OpenRouter API Key di sidebar kiri. Dapatkan gratis
                di{" "}
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#10B981" }}
                >
                  openrouter.ai/keys
                </a>
              </div>
            )}
            {page === "home" ? (
              <HomePage onNavigate={setPage} />
            ) : (
              PAGE_COMPONENTS[page] || <div>Halaman tidak ditemukan</div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
