// src/utils/pricingMatrix.js

// 1. Base Setup & Configuration Rates
const BASE_RATES = {
  design: { base: 1200, unitLabel: "Layout Design Asset Suite" },
  print: { base: 650, unitLabel: "Manufacturing Press Setup" },
  web: { base: 4500, unitLabel: "System Deployment Architecture" },
  consulting: { base: 850, unitLabel: "Prepress Flight Audit Profile" }
};

// 2. Deliverable Multipliers
const CATEGORY_MULTIPLIERS = {
  'Business Cards & Stationery': 1.0,
  'Banners & Large Format': 2.2,
  'Custom Apparel & Merch': 1.8,
  'Web Landing Pages': 1.0,
  'Full-Stack Web Apps': 3.5,
  'Prepress Preflight Audit': 1.0
};

// 3. Premium Material Finish Modifiers
const FINISH_MODIFIERS = {
  standard: 0,
  gloss: 180,
  uv: 450,
  unsupported: 0
};

/**
 * Main calculation engine to compute approximate budget brackets
 */
export function calculateEstimate(serviceType, category, quantityStr, finish) {
  const service = BASE_RATES[serviceType] || { base: 0 };
  const multiplier = CATEGORY_MULTIPLIERS[category] || 1.0;
  const finishCost = FINISH_MODIFIERS[finish] || 0;

  // Safe integer parsing for manufacturing volumes
  const quantity = parseInt(quantityStr.replace(/[^0-9]/g, ''), 10) || 1;

  // Base workflow calculation
  let subtotal = service.base * multiplier;

  // Apply printing production volume tiers if active
  if (serviceType === 'print' || serviceType === 'both') {
    let unitCost = 2.50; // Base cost per print impression
    
    // Volume tier brackets (Higher quantities lower the unit price)
    if (quantity > 1000) unitCost = 0.85;
    else if (quantity > 500) unitCost = 1.20;
    else if (quantity > 100) unitCost = 1.75;

    subtotal += (quantity * unitCost) + finishCost;
  }

  // Generate an approximate bracket range (±15% safety buffer)
  const lowEstimate = Math.round(subtotal * 0.85);
  const highEstimate = Math.round(subtotal * 1.15);

  return {
    low: lowEstimate,
    high: highEstimate,
    isValid: subtotal > 0
  };
}
