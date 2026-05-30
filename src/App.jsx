import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useApiStore } from './store/apiStore'
import AppShell from './components/layout/AppShell'
import OnboardingModal from './components/OnboardingModal'
import Home from './pages/Home'
import History from './pages/History'
import Settings from './pages/Settings'

// Import 20 Fitur Akademik
import SmartSummarizer from './pages/features/SmartSummarizer'
import AcademicParaphraser from './pages/features/AcademicParaphraser'
import GrammarFixer from './pages/features/GrammarFixer'
import ToneTransformer from './pages/features/ToneTransformer'
import ResearchIdeaGenerator from './pages/features/ResearchIdeaGenerator'
import AutomaticOutline from './pages/features/AutomaticOutline'
import LiteratureReviewHelper from './pages/features/LiteratureReviewHelper'
import ArgumentBuilder from './pages/features/ArgumentBuilder'
import AbstractTranslator from './pages/features/AbstractTranslator'
import CitationFormatter from './pages/features/CitationFormatter'
import DataExplainer from './pages/features/DataExplainer'
import ReferenceKeywords from './pages/features/ReferenceKeywords'
import ConceptSimplifier from './pages/features/ConceptSimplifier'
import ExamPrepQuestioner from './pages/features/ExamPrepQuestioner'
import DosenEmailDrafter from './pages/features/DosenEmailDrafter'
import ActionItemExtractor from './pages/features/ActionItemExtractor'
import PresentationScript from './pages/features/PresentationScript'
import MotivationWellness from './pages/features/MotivationWellness'
import ThesisProgressTracker from './pages/features/ThesisProgressTracker'
import StudyScheduleGenerator from './pages/features/StudyScheduleGenerator'

function App() {
  const { theme } = useApiStore()

  // Sinkronisasi tema aktif ke documentElement root (HTML)
  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return (
    <BrowserRouter>
      <OnboardingModal />
      <Routes>
        {/* Seluruh rute dibungkus dalam AppShell layout */}
        <Route element={<AppShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />

          {/* 1. Manipulasi Teks */}
          <Route path="/features/smart-summarizer" element={<SmartSummarizer />} />
          <Route path="/features/academic-paraphraser" element={<AcademicParaphraser />} />
          <Route path="/features/grammar-fixer" element={<GrammarFixer />} />
          <Route path="/features/tone-transformer" element={<ToneTransformer />} />

          {/* 2. Riset & Struktur */}
          <Route path="/features/research-idea-generator" element={<ResearchIdeaGenerator />} />
          <Route path="/features/automatic-outline" element={<AutomaticOutline />} />
          <Route path="/features/literature-review-helper" element={<LiteratureReviewHelper />} />
          <Route path="/features/argument-builder" element={<ArgumentBuilder />} />

          {/* 3. Penulisan Ilmiah */}
          <Route path="/features/abstract-translator" element={<AbstractTranslator />} />
          <Route path="/features/citation-formatter" element={<CitationFormatter />} />
          <Route path="/features/data-explainer" element={<DataExplainer />} />
          <Route path="/features/reference-keywords" element={<ReferenceKeywords />} />

          {/* 4. Belajar & Studi */}
          <Route path="/features/concept-simplifier" element={<ConceptSimplifier />} />
          <Route path="/features/exam-prep-questioner" element={<ExamPrepQuestioner />} />

          {/* 5. Produktivitas */}
          <Route path="/features/dosen-email-drafter" element={<DosenEmailDrafter />} />
          <Route path="/features/action-item-extractor" element={<ActionItemExtractor />} />
          <Route path="/features/presentation-script" element={<PresentationScript />} />

          {/* 6. Kesejahteraan */}
          <Route path="/features/motivation-wellness" element={<MotivationWellness />} />

          {/* 7. Manajemen Akademik */}
          <Route path="/features/thesis-progress-tracker" element={<ThesisProgressTracker />} />
          <Route path="/features/study-schedule-generator" element={<StudyScheduleGenerator />} />
        </Route>
      </Routes>
      
      {/* Notifikasi toast global dengan sonner */}
      <Toaster 
        position="bottom-right" 
        richColors 
        theme={theme === 'dark' ? 'dark' : 'light'} 
      />
    </BrowserRouter>
  )
}

export default App
