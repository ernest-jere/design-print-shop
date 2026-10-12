// src/components/PriceDisplay.jsx
import React from 'react';
import { calculateEstimate } from './pricingMatrix';
import { Calculator, Info, Settings2 } from 'lucide-react';

export default function PriceDisplay({ formData }) {
  const { serviceType, productCategory, quantity, paperFinish, isoSize, pagesCount, printColor } = formData;

  const estimate = calculateEstimate(serviceType, productCategory, quantity, paperFinish, isoSize, pagesCount, printColor);

  if (!estimate.isValid) return null;

  return (
    <div className="mt-4 rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/20 to-white p-4 shadow-xs space-y-3">
      <div className="flex items-center gap-2 text-emerald-800">
        <Calculator className="h-4 w-4" />
        <span className="text-xs font-bold uppercase tracking-wider">Target Budget Approximation</span>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black tracking-tight text-slate-900">
            R {estimate.low.toLocaleString()} - R {estimate.high.toLocaleString()}
          </span>
          <span className="text-xs text-slate-500 font-medium">ZAR Est.</span>
        </div>
        
        {/* 🌟 AUTOMATIC WORKFLOW RUNTIME DISPLAY SELECTION */}
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50/60 px-2 py-1 rounded-md w-fit font-sans tracking-wide">
          <Settings2 className="h-3.5 w-3.5 animate-spin-slow shrink-0" />
          <span>Engine Profile: {estimate.routedWorkflow}</span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 space-y-2">
        <div className="flex items-start gap-2 text-[11px] text-slate-600 leading-normal">
          <Info className="h-3.5 w-3.5 mt-0.5 text-slate-400 shrink-0" />
          <p>This approximation factors page count volumes, ink color modes (Full CMYK vs. B/W), paper sizing multipliers, and finishes.</p>
        </div>
      </div>
    </div>
  );
}
