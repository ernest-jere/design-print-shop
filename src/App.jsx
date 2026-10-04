import React from 'react'
import QuoteForm from './components/QuoteForm'
import { Paintbrush, ShieldCheck, Clock3 } from 'lucide-react'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* MINIMAL HEADER FRAME */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Paintbrush className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              DesignPrint Studio
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <a href="#quote-section" className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-slate-800 shadow-sm">
              Get Started
            </a>
          </nav>
        </div>
      </header>

      {/* CORE CONTENT HERO GRID */}
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* LEFT VALUE BLUEPRINT */}
          <div className="space-y-6 lg:col-span-6 text-center lg:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.1]">
              Custom Print & Design Layouts <br />
              <span className="text-blue-600">Built to Specification.</span>
            </h1>
            <p className="mx-auto lg:mx-0 max-w-md text-base sm:text-lg text-slate-600 leading-relaxed">
              Submit your project constraints, conceptual files, or specific dimensions below. I review every single specification request manually to build an accurate production quote blueprint straight to your inbox.
            </p>
            
            {/* VALUE BULLETS */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-md mx-auto lg:mx-0">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 rounded-md bg-blue-50 p-1 text-blue-600"><Clock3 className="h-4 w-4" /></div>
                <div><h4 className="text-xs font-bold text-slate-900">24h Evaluation</h4><p className="text-[11px] text-slate-500">Quick scope breakdowns.</p></div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 rounded-md bg-emerald-50 p-1 text-emerald-600"><ShieldCheck className="h-4 w-4" /></div>
                <div><h4 className="text-xs font-bold text-slate-900">Material Advice</h4><p className="text-[11px] text-slate-500">Finishes matched to target use.</p></div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 rounded-md bg-purple-50 p-1 text-purple-600"><Paintbrush className="h-4 w-4" /></div>
                <div><h4 className="text-xs font-bold text-slate-900">Custom Proofs</h4><p className="text-[11px] text-slate-500">Vector layouts included.</p></div>
              </div>
            </div>
          </div>

          {/* RIGHT INTERACTIVE CONTAINER FOR QUOTEFORM */}
          <div id="quote-section" className="lg:col-span-6 w-full drop-shadow-sm">
            <QuoteForm />
          </div>

        </div>
      </main>

      {/* MINIMAL FOOTER OUTLINE */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs text-slate-500 sm:px-6">
          &copy; {new Date().getFullYear()} DesignPrint Studio. All rights reserved. Evaluation processing powered securely by Web3Forms.
        </div>
      </footer>

    </div>
  )
}
