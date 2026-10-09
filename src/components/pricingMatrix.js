// src/components/pricingMatrix.js

const BASE_RATES = {
  design: { base: 1200 },
  print: { base: 650 },
  both: { base: 1850 },
  web: { base: 4500 },
  consulting: { base: 1500 }
};

const CATEGORY_MULTIPLIERS = {
  'Graphic Design': 1.0,
  'UX/UI Design': 1.5,
  'Digital Printing': 1.0,
  'Offset Manufacturing': 2.5,
  'UX Layout Architecture': 1.2,
  'Frontend Application Dev': 3.0,
  'Prepress Preflight Audit': 1.0,
  'Color Ingest Calibration': 1.4
};

// 🌟 ADDED A6 VALUE MULTIPLIER (COMPACT MODIFIER)
const ISO_PAPER_MULTIPLIERS = {
  'A3': 1.6,
  'A4': 1.0,
  'A5': 0.7,
  'A6': 0.4, // A6 price weighting factor
  'DL': 0.5
};

const FINISH_MODIFIERS = {
  standard: 0,
  gloss: 180,
  uv: 450,
  unsupported: 0
};

export function calculateEstimate(serviceType, category, quantityStr, finish, isoSize = 'A4', pagesCount = '1') {
  const service = BASE_RATES[serviceType] || { base: 0 };
  const multiplier = CATEGORY_MULTIPLIERS[category] || 1.0;
  const finishCost = FINISH_MODIFIERS[finish] || 0;
  const paperMultiplier = ISO_PAPER_MULTIPLIERS[isoSize] || 1.0;

  let quantity = 1;
  if (quantityStr && typeof quantityStr === 'string') {
    quantity = parseInt(quantityStr.replace(/[^0-9]/g, ''), 10) || 1;
  } else if (typeof quantityStr === 'number') {
    quantity = quantityStr;
  }

  const pages = parseInt(pagesCount, 10) || 1;
  let subtotal = service.base * multiplier;

  if (serviceType === 'print') {
    let unitCostPerPage = 0.45;
    
    if (quantity > 1000) unitCostPerPage = 0.15;
    else if (quantity > 500) unitCostPerPage = 0.25;
    else if (quantity > 100) unitCostPerPage = 0.35;

    subtotal += (quantity * pages * paperMultiplier * unitCostPerPage) + finishCost;
  }

  const lowEstimate = Math.round(subtotal * 0.85);
  const highEstimate = Math.round(subtotal * 1.15);

  return {
    low: lowEstimate,
    high: highEstimate,
    isValid: subtotal > 0
  };
}
