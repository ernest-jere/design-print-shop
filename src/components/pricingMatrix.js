// src/components/pricingMatrix.js

const BASE_RATES = {
  design: { base: 1200 }, print: { base: 650 }, both: { base: 1850 }, web: { base: 4500 }, consulting: { base: 1500 }
};

const CATEGORY_MULTIPLIERS = {
  'Graphic Design': 0.45,
  'UX/UI Design': 1.4,
  'Digital Printing': 1.0,
  'Offset Manufacturing': 1.8,
  'Industrial Screen Printing': 1.25,
  'Heat Press Branding Process': 1.30, 
  'UX Layout Architecture': 1.2,
  'Frontend Application Dev': 2.5,
  'Prepress Preflight Audit': 1.0,
  'Color Ingest Calibration': 1.3
};

const ISO_PAPER_MULTIPLIERS = {
  'A1': 2.2, 'A2': 1.6, 'A3': 1.3, 'A4': 1.0, 'A5': 0.7, 'A6': 0.4, 'DL': 0.5
};

const COLOR_MULTIPLIERS = { cmyk: 1.6, bw: 1.0, uv: 1.45, sublimation: 1.75 };

const FINISH_MODIFIERS = { standard: 0, gloss: 120, uv: 250, correx: 150, vinyl: 180, pack_board: 200, unsupported: 0 };

export function calculateEstimate(serviceType, category, quantityStr, finish, isoSize = 'A4', pagesCount = '1', printColor = 'cmyk') {
  const service = BASE_RATES[serviceType] || { base: 0 };
  let activeCategory = category;
  let workflowLabel = category || "Standard Evaluation Process";

  let quantity = 1;
  if (quantityStr && typeof quantityStr === 'string') {
    quantity = parseInt(quantityStr.replace(/[^0-9]/g, ''), 10) || 0;
  } else if (typeof quantityStr === 'number') {
    quantity = quantityStr;
  }

  const pages = parseInt(pagesCount, 10) || 0;
  const isBypassActive = quantity === 0 || pages === 0;

  if (serviceType === 'print' && !isBypassActive) {
    if (['A4', 'A5', 'A6', 'DL'].includes(isoSize)) {
      if (quantity >= 500 && activeCategory === 'Digital Printing') {
        activeCategory = 'Offset Manufacturing';
        workflowLabel = "Automated High-Speed Litho Press Routing (Volume Tier)";
      } else if (activeCategory === 'Digital Printing') {
        workflowLabel = "Digital Toner Press Production (Short-Run Optimized)";
      }
    }
    if (['A3', 'A2'].includes(isoSize)) {
      if (quantity >= 200 && activeCategory === 'Digital Printing') {
        activeCategory = 'Offset Manufacturing';
        workflowLabel = "Automated Commercial Litho Press Routing (Large Format Volume Tier)";
      } else if (activeCategory === 'Digital Printing') {
        workflowLabel = "Wide-Format Digital Inkjet Plotter Run (Short-Run Poster)";
      }
    }
    if (finish === 'correx' || finish === 'vinyl') {
      if (quantity >= 100) {
        activeCategory = 'Industrial Screen Printing';
        workflowLabel = `Industrial Silk Screen Printing Mesh Stencils (High-Volume ${finish.toUpperCase()})`;
      } else {
        workflowLabel = `Wide-Format UV Flatbed Digital Jetting (Short-Run Rigid ${finish.toUpperCase()} Board)`;
      }
    }
  }

  const multiplier = CATEGORY_MULTIPLIERS[activeCategory] || 1.0;
  const finishCost = FINISH_MODIFIERS[finish] || 0;
  const paperMultiplier = ISO_PAPER_MULTIPLIERS[isoSize] || 1.0;
  const colorMultiplier = COLOR_MULTIPLIERS[printColor] || 1.0;

  let baseRateCalculated = service.base * multiplier;
  if (serviceType === 'print' && activeCategory === 'Digital Printing' && quantity < 50 && !isBypassActive) {
    baseRateCalculated = (50 + (quantity * 2.5)) * multiplier;
  }

  let subtotal = baseRateCalculated;

  if (serviceType === 'print' && !isBypassActive) {
    let unitCostPerPage = 0.45;
    if (quantity >= 1000) unitCostPerPage = 0.12;
    else if (quantity >= 500) unitCostPerPage = 0.18;
    else if (quantity >= 200) unitCostPerPage = 0.24;
    else if (quantity >= 100) unitCostPerPage = 0.32;
    subtotal += (quantity * pages * paperMultiplier * colorMultiplier * unitCostPerPage) + finishCost;
  } else if (isBypassActive) {
    workflowLabel = "Administrative Parameter Bypass / Custom Scope Hand-Evaluation Mode";
    subtotal = baseRateCalculated + finishCost; 
  }

  return {
    low: Math.round(subtotal * 0.85), high: Math.round(subtotal * 1.15),
    routedWorkflow: workflowLabel, isValid: subtotal > 0
  };
}
