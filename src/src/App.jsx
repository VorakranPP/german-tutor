import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import VocabPage from './pages/VocabPage'
import GrammarPage from './pages/GrammarPage'
import ReadingPage from './pages/ReadingPage'
import SpeakingPage from './pages/SpeakingPage'
import DiaryPage from './pages/DiaryPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 pb-16">
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <h1 className="text-lg font-bold text-gray-800">🇩🇪 DeutschMeister</h1>
          <p className="text-xs text-gray-400">เตรียมสอบ Goethe B1</p>
        </header>

        <main>
          <Routes>
            <Route path="/"         element={<VocabPage />} />
            <Route path="/grammar"  element={<GrammarPage />} />
            <Route path="/reading"  element={<ReadingPage />} />
            <Route path="/speaking" element={<SpeakingPage />} />
            <Route path="/diary"    element={<DiaryPage />} />
          </Routes>
        </main>

        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
