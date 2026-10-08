// src/App.jsx
import React from 'react'
import QuoteForm from './components/QuoteForm'
import PortfolioGrid from './components/PortfolioGrid'
import { Paintbrush, ShieldCheck, Clock3, Layers, Printer } from 'lucide-react'
import AdminDashboard from './components/AdminDashboard';


export default function App() {
  const [isAdminView, setIsAdminView] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Layers className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              DesignPrint Studio
            </span>
          </div>
          <nav>
            <a href="#quote-section" className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-all shadow-sm">
              Get Started
            </a>
          </nav>
        </div>
      </header>

      {/* CORE HERO WRAPPER GRID */}
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16 space-y-20">
        {isAdminView ? (
          <div className="space-y-4">
            <Button variant="outline" className="text-xs rounded-xl" onClick={() => setIsAdminView(false)}>
              ← Return to Public Portfolio View
            </Button>
            <AdminDashboard />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
              {/* VALUE PROPOSITION AREA */}
              <div className="space-y-6 lg:col-span-6 text-center lg:text-left lg:sticky lg:top-24">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.1]">
                  Digital Products, Print Engineering & <br />
                  <span className="text-blue-600">Prepress Consultancy.</span>
                </h1>
                <p className="mx-auto lg:mx-0 max-w-md text-base text-slate-600 leading-relaxed">
                  Submit your project scope parameters, structural file assets, or system deployment goals below. I evaluate custom web development requests and execute rigorous prepress file preflights manually to protect your production budgets.
                </p>
                
                {/* VALUE MATRIX METRICS */}
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-md mx-auto lg:mx-0">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 rounded-md bg-blue-50 p-1 text-blue-600"><Layers className="h-4 w-4" /></div>
                    <div><h4 className="text-xs font-bold text-slate-900">Web Engineering</h4><p className="text-[10px] text-slate-500">React SPAs & storefronts.</p></div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 rounded-md bg-rose-50 p-1 text-rose-600"><ShieldCheck className="h-4 w-4" /></div>
                    <div><h4 className="text-xs font-bold text-slate-900">Prepress Preflight</h4><p className="text-[10px] text-slate-500">Zero bleeding production errors.</p></div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 rounded-md bg-emerald-50 p-1 text-emerald-600"><Printer className="h-4 w-4" /></div>
                    <div><h4 className="text-xs font-bold text-slate-900">Print Production</h4><p className="text-[10px] text-slate-500">Premium material finishes.</p></div>
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
          </>
        )}
      </main>
      
      {/* FOOTER BASICS OUTLINE */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs text-slate-500 sm:px-6">
          &copy; {new Date().getFullYear()} DesignPrint Studio. Evaluation processing managed securely via Web3Forms API framework.
          
          <button 
            onClick={() => setIsAdminView(!isAdminView)} 
            className="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer text-[10px] ml-4 font-mono uppercase tracking-wider"
          >
            [Studio Control Log]
          </button>

        </div>
      </footer>

    </div>
  )
}
