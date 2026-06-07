import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import VocabPage from './pages/VocabPage'
import GrammarPage from './pages/GrammarPage'
import LesenPage from './pages/LesenPage'
import SpeakingPage from './pages/SpeakingPage'
import DiaryPage from './pages/DiaryPage'
import React from 'react';
//import Dashboard from './components/Dashboard';
import APIUsageTracker from '../APIUsageTracker';

// ↑ ส่วนนี้


export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen pb-16 relative" style={{
        backgroundImage: 'url(/bg-ge.png)',
        backgroundSize: '70%',
        backgroundPosition: 'center 75%',
        backgroundRepeat: 'no-repeat',
      }}>
        <div className="absolute inset-0 bg-white/80 pointer-events-none" />
        <header className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
          <h1 className="text-lg font-bold text-gray-800">🇩🇪 DeutschMeister</h1>
          <p className="text-xs text-gray-400">เตรียมสอบ Goethe B1</p>
        </header>
        {/* ← ใส่ APIUsageTracker ตรงนี้ 
        <APIUsageTracker />*/} 
        <main className="relative z-10">
          <Routes>
            <Route path="/"         element={<VocabPage />} />
            <Route path="/grammar"  element={<GrammarPage />} />
            <Route path="/reading"  element={<LesenPage />} />
            <Route path="/schreiben" element={<SpeakingPage />} />
            <Route path="/diary"    element={<DiaryPage />} />
          </Routes>
        </main>

        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
