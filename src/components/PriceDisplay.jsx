// src/components/PriceDisplay.jsx
import React from 'react';
import { calculateEstimate } from "./pricingMatrix";
import { Calculator, Info, ShieldCheck } from 'lucide-react';

export default function PriceDisplay({ formData }) {
  const { serviceType, productCategory, quantity, paperFinish } = formData;

  const estimate = calculateEstimate(serviceType, productCategory, quantity, paperFinish);

  if (!estimate.isValid) return null;

  return (
    <div className="mt-4 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/40 to-white p-4 shadow-sm space-y-3">
      <div className="flex items-center gap-2 text-blue-700">
        <Calculator className="h-4 w-4" />
        <span className="text-xs font-bold uppercase tracking-wider">Target Budget Approximation</span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900">
          R {estimate.low.toLocaleString()} - R {estimate.high.toLocaleString()}
        </span>
        <span className="text-xs text-slate-500 font-medium">ZAR Est.</span>
      </div>

      <div className="pt-2 border-t border-slate-100 space-y-2">
        <div className="flex items-start gap-2 text-[11px] text-slate-600 leading-normal">
          <Info className="h-3.5 w-3.5 mt-0.5 text-slate-400 shrink-0" />
          <p>
            This estimation balances base configuration setup rates and volume material tiers. It represents a typical project scope matching your constraints.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50/50 p-1.5 rounded-lg w-fit">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Manual review requested below to lock exact price configuration sheets.</span>
        </div>
      </div>
    </div>
  );
}
