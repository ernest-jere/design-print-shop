// src/App.jsx
import React, { useState } from 'react'
import QuoteForm from './components/QuoteForm'
import PortfolioGrid from './components/PortfolioGrid'
import AdminDashboard from './components/AdminDashboard'
import TestimonialSlider from './components/TestimonialSlider'
import { ShieldCheck, Layers, Printer, Laptop } from 'lucide-react'

// 🌟 NATIVE IMPORT FOR YOUR LOGO ASSET
import LogoAsset from './assets/Impressions.png'

export default function App() {
  const [isAdminView, setIsAdminView] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white">
      
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* 🌟 BRAND LOGO UPGRADE: REPLACED OLD CSS DRAWING WITH IMPRESSIONS.PNG */}
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 border border-slate-100 shadow-xs">
              <img 
                src={LogoAsset} 
                alt="Impressions Branding Layout Logo" 
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              Impressions
            </span>
          </div>
          <nav>
            <a href="#quote-section" className="rounded-xl bg-[#1b5e20] px-4 py-2 text-xs font-semibold text-white hover:bg-[#124116] transition-all shadow-sm">
              Get Started
            </a>
          </nav>
        </div>
      </header>

      {/* CORE DYNAMIC MAIN VIEW ENGINE */}
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {isAdminView ? (
          <div className="w-full space-y-6 pt-4 animate-in fade-in duration-200">
            <button 
              type="button"
              onClick={() => setIsAdminView(false)} 
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
            >
              ← Return to Public Portfolio View
            </button>
            <AdminDashboard />
          </div>
        ) : (
          <div className="space-y-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
              
              {/* BRAND VALUE BANNER */}
              <div className="space-y-6 lg:col-span-6 text-center lg:text-left lg:sticky lg:top-24">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.1]">
                  <span className="text-green-700">Digital & Print Products,</span> <span className="text-red-700">Frontend Design <br />& Development</span> <br />&  
                  <span className="text-[#00c853]"> Prepress Consultancy.</span>
                </h1>
                <p className="mx-auto lg:mx-0 max-w-md text-base text-slate-600 leading-relaxed">
                  Submit your technical requirements, source files, or system specs to start your project. We evaluate custom web code configurations and execute rigid prepress preflights manually to ensure absolute layout precision before deployment.
                </p>
                
                {/* VALUE MATRIX METRICS */}
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-md mx-auto lg:mx-0">
                  <div className="flex items-start gap-2.5">ss
                    <div className="mt-0.5 rounded-md bg-emerald-50 p-1 text-[#1b5e20]"><Laptop className="h-4 w-4" /></div>
                    <div><h4 className="text-xs font-bold text-slate-900">Web Frontend</h4><p className="text-[10px] text-slate-500">React architectures.</p></div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 rounded-md bg-rose-50 p-1 text-rose-600"><ShieldCheck className="h-4 w-4" /></div>
                    <div><h4 className="text-xs font-bold text-slate-900">Prepress Flight</h4><p className="text-[10px] text-slate-500">Zero template bleeding errors.</p></div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 rounded-md bg-blue-50 p-1 text-blue-600"><Printer className="h-4 w-4" /></div>
                    <div><h4 className="text-xs font-bold text-slate-900">Digital Print</h4><p className="text-[10px] text-slate-500">Premium material finishes.</p></div>
                  </div>
                </div>
              </div>

              {/* DYNAMIC FORMS MOUNT CONTAINER */}
              <div id="quote-section" className="lg:col-span-6 w-full">
                <QuoteForm />
              </div>
            </div>

            {/* WORK CARD PORTFOLIO GALLERY SECTION */}
            <div className="border-t border-slate-200 pt-12 space-y-6">
              <div className="text-center lg:text-left space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Proven Project Case Studies</h2>
                <p className="text-sm text-slate-500">Filter previous deployment works across design, code, and manufacturing parameters.</p>
              </div>
              <PortfolioGrid />
            </div>

            {/* RESTORED TESTIMONIALS SLIDER SECTION */}
            <div className="border-t border-slate-200 pt-16 space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">What Our Clients Say</h2>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">Read honest feedback from companies who trust Impressions with design, code, and manufacturing.</p>
              </div>
              <TestimonialSlider />
            </div>

          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs text-slate-500 sm:px-6 flex items-center justify-center flex-wrap gap-2">
          <span>&copy; {new Date().getFullYear()} Impressions Studio. All evaluation assets processed securely.</span>
          <button 
            type="button"
            onClick={() => setIsAdminView(!isAdminView)} 
            className="text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer text-[10px] font-mono uppercase tracking-wider ml-2"
          >
            [Studio Control Log]
          </button>
        </div>
      </footer>

    </div>
  )
}
