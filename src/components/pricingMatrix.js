// src/components/pricingMatrix.js

// src/components/pricingMatrix.js

const BASE_RATES = {
  design: { base: 1200 },
  print: { base: 650 },
  both: { base: 1850 },
  web: { base: 4500 },
  consulting: { base: 1500 }
};

// Calibrated category multipliers to separate digital toner sheets from heavy setup inkjet production
const CATEGORY_MULTIPLIERS = {
  'Graphic Design': 0.45,
  'UX/UI Design': 1.4,
  'Digital Toner Press (Short-Run Sheets)': 0.15, // Drastically lowers base for short-run digital sheets
  'Wide-Format Digital Inkjet Production': 1.0,   // Maintained for high-density poster plotters
  'Offset Manufacturing': 1.8,
  'Industrial Screen Printing': 1.25,
  'Heat Press Branding Process': 0.55,           // Scaled down significantly from 1.30 to fix the high ZAR base
  'UX Layout Architecture': 1.2,
  'Frontend Application Dev': 2.5,
  'Prepress Preflight Audit': 1.0,
  'Color Ingest Calibration': 1.3
};

const ISO_PAPER_MULTIPLIERS = {
  'A1': 2.2, 'A2': 1.6, 'A3': 1.3, 'A4': 1.0, 'A5': 0.7, 'A6': 0.4, 'DL': 0.5
};

const COLOR_MULTIPLIERS = {
  cmyk: 1.6,
  bw: 1.0,
  uv: 1.45,
  sublimation: 1.75
};

// src/components/pricingMatrix.js

const FINISH_MODIFIERS = {
  standard: 0,
  gloss: 120,
  uv: 250,
  correx: 150,    
  vinyl: 180,        
  pack_board: 200, 
  // 🌟 NEW HEAT PRESS TRANSFER MEDIUM SUBSTRATES
  heat_transfer: 45,   // Base material setup cost for Light/Dark Heat Transfer Paper sheets
  sub_paper: 35,       // Material cost for Sublimation Transfer Carrier sheets
  dtf_film: 95,        // Premium Direct to Film (DTF) pet film roll/sheet base
  unsupported: 0
};


export function calculateEstimate(serviceType, category, quantityStr, finish, isoSize = 'A4', pagesCount = '1', printColor = 'cmyk') {
  const service = BASE_RATES[serviceType] || { base: 0 };
  let activeCategory = category;
  let workflowLabel = category || "Standard Evaluation Process";

  // Parse strings into clean numbers with an absolute fallback minimum of 1
  let quantity = 1;
  if (quantityStr && typeof quantityStr === 'string') {
    quantity = parseInt(quantityStr.replace(/[^0-9]/g, ''), 10) || 1;
  } else if (typeof quantityStr === 'number') {
    quantity = quantityStr > 0 ? quantityStr : 1;
  }

  const pages = parseInt(pagesCount, 10) || 1;

  if (serviceType === 'print') {
    // Tier 1: Small Format Paper Sheets
    if (['A4', 'A5', 'A6', 'DL'].includes(isoSize)) {
      if (quantity >= 500 && activeCategory === 'Digital Toner Press (Short-Run Sheets)') {
        activeCategory = 'Offset Manufacturing';
        workflowLabel = "Automated High-Speed Litho Press Routing (Volume Tier)";
      } else if (activeCategory === 'Digital Toner Press (Short-Run Sheets)') {
        workflowLabel = "Digital Toner Press Production (Short-Run Sheet Optimized)";
      }
    }
    
    // Tier 2: Large Format Posters
    if (['A3', 'A2'].includes(isoSize)) {
      if (quantity >= 200 && activeCategory === 'Wide-Format Digital Inkjet Production') {
        activeCategory = 'Offset Manufacturing';
        workflowLabel = "Automated Commercial Litho Press Routing (Large Format Volume Tier)";
      } else if (activeCategory === 'Wide-Format Digital Inkjet Production') {
        workflowLabel = "Wide-Format Digital Inkjet Plotter Run (Short-Run Poster)";
      }
    }

    // Tier 3: Substrate Material Routing (Correx, Vinyl, or Heat Press Mediums)
    if (finish === 'correx' || finish === 'vinyl' || ['heat_transfer', 'sub_paper', 'dtf_film'].includes(finish)) {
      if (quantity >= 100) {
        activeCategory = 'Industrial Screen Printing';
        workflowLabel = `Industrial Commercial Run (High-Volume ${finish.toUpperCase().replace('_', ' ')})`;
      } else {
        workflowLabel = `Specialized Graphic Transfer Execution (${finish.toUpperCase().replace('_', ' ')})`;
      }
    }

  }

  const multiplier = CATEGORY_MULTIPLIERS[activeCategory] || 1.0;
  const finishCost = FINISH_MODIFIERS[finish] || 0;
  const paperMultiplier = ISO_PAPER_MULTIPLIERS[isoSize] || 1.0;
  const colorMultiplier = COLOR_MULTIPLIERS[printColor] || 1.0;

  // Prevent short-run toner sheets from picking up heavy structural minimum setup fees
  let baseRateCalculated = service.base * multiplier;
  if (serviceType === 'print' && activeCategory === 'Digital Toner Press (Short-Run Sheets)' && quantity < 50) {
    baseRateCalculated = (15 + (quantity * 1.5)) * multiplier;
  }

  let subtotal = baseRateCalculated;

  if (serviceType === 'print') {
    let unitCostPerPage = 0.45;
    if (quantity >= 1000) unitCostPerPage = 0.12;
    else if (quantity >= 500) unitCostPerPage = 0.18;
    else if (quantity >= 200) unitCostPerPage = 0.24;
    else if (quantity >= 100) unitCostPerPage = 0.32;

    subtotal += (quantity * pages * paperMultiplier * colorMultiplier * unitCostPerPage) + finishCost;
  }

  return {
    low: Math.round(subtotal * 0.85),
    high: Math.round(subtotal * 1.15),
    routedWorkflow: workflowLabel,
    isValid: subtotal > 0
  };
}


