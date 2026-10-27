const BASE_RATES = {
  design: { base: 1200 },
  print: { base: 650 },
  both: { base: 1850 },
  web: { base: 4500 },
  consulting: { base: 1500 }
};

// Rebalanced pricing scalar tiers to create clear value gaps between visual branding and layout architectures
const CATEGORY_MULTIPLIERS = {
  'Graphic Design': 0.45,         // Adjusted down from 1.0 to make simple design tasks much more competitive
  'UX/UI Design': 1.4,            // Maintained for high-complexity application wireframing
  'Digital Printing': 1.0,
  'Offset Manufacturing': 1.8,
  'Correx Board Printing': 1.15,
  'Industrial Screen Printing': 1.25,
  'Dye Sublimation Process': 1.35,
  'UX Layout Architecture': 1.2,
  'Frontend Application Dev': 2.5,
  'Prepress Preflight Audit': 1.0,
  'Color Ingest Calibration': 1.3
};

const ISO_PAPER_MULTIPLIERS = {
  'A1': 2.2, 'A2': 1.6, 'A3': 1.3, 'A4': 1.0, 'A5': 0.7, 'A6': 0.4, 'DL': 0.5
};

const COLOR_MULTIPLIERS = { cmyk: 1.6, bw: 1.0 };

const FINISH_MODIFIERS = {
  standard: 0, gloss: 120, uv: 250, correx: 150, pack_board: 200, unsupported: 0
};
export function calculateEstimate(serviceType, category, quantityStr, finish, isoSize = 'A4', pagesCount = '1', printColor = 'cmyk') {
  const service = BASE_RATES[serviceType] || { base: 0 };
  let activeCategory = category;
  let workflowLabel = category || "Standard Evaluation Process";
  
  let quantity = 1;
  if (quantityStr && typeof quantityStr === 'string') {
    quantity = parseInt(quantityStr.replace(/[^0-9]/g, ''), 10) || 1;
  } else if (typeof quantityStr === 'number') {
    quantity = quantityStr;
  }
  
  const pages = parseInt(pagesCount, 10) || 1;

  // Auto-routing framework for manufacturing lines based on sheet limits
  if (serviceType === 'print') {
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
    
    if (finish === 'correx' || activeCategory === 'Correx Board Printing') {
      if (quantity >= 100) {
        activeCategory = 'Industrial Screen Printing';
        workflowLabel = "Industrial Silk Screen Printing Mesh Stencils (High-Volume Boards)";
      } else {
        activeCategory = 'Correx Board Printing';
        workflowLabel = "Wide-Format UV Flatbed Digital Jetting (Short-Run Rigid Board)";
      }
    }
  }

  const multiplier = CATEGORY_MULTIPLIERS[activeCategory] || 1.0;
  const finishCost = FINISH_MODIFIERS[finish] || 0;
  const paperMultiplier = ISO_PAPER_MULTIPLIERS[isoSize] || 1.0;
  const colorMultiplier = COLOR_MULTIPLIERS[printColor] || 1.0;

  // 🛠️ SMART FIX: Prevent short-run digital sheets from inheriting industrial setup charges
  let calculatedBase = service.base * multiplier;
  if (serviceType === 'print' && activeCategory === 'Digital Printing' && quantity < 50) {
    // Replace heavy machine configuration base (R650) with an agile short-run handling rate
    calculatedBase = (50 + (quantity * 2.5)) * multiplier; 
  }

  let subtotal = calculatedBase;

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
