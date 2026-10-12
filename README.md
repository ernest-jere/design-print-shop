# Impressions – Smart Print Engineering, Design & Web Studio Hub

▶️ **Live Production Link:** [https://design-print-shop.vercel.app/](https://vercel.app)

Welcome to **Impressions**, a highly performant, accessible multi-step storefront, calculation matrix, and lead management hub built using a modern **React 19, Vite 8, Framer Motion, and Tailwind CSS v4** architecture. 

This platform acts as an intelligent routing engine that bridges digital cloud uploads, automated manufacturing calculations, secure serverless email transfers, and a protected local lead tracking dashboard.

---

## 🚀 Core Features Matrix

### 1. Smart Volume Cross-Over Routing
The system features a deterministic background calculation algorithm (`pricingMatrix.js`) that automatically switches printing processes based on real-world commercial cost efficiency crossover points:
*   **Small Format Paper Sheets (A4, A5, A6, DL):** Automatically upgrades from *Digital Toner Press* to *High-Speed Offset Lithography (Litho)* at **500 units** or more.
*   **Large Format Posters (A3, A2):** Automatically upgrades from *Wide-Format Digital Inkjet* to *Commercial Litho Press* at **200 units** or more.
*   **Rigid Substrates (Correx Boards):** Automatically routes multi-color work below **100 units** to a *UV Flatbed Digital* setup, and automatically switches to *Industrial Silk Screen Printing Mesh Stencils* at 100+ boards.

### 2. Live Engine Profile  Badges
Directly beneath the ZAR price approximation bracket range (±15% safety buffer), an inline green badge dynamically materializes to reveal the active manufacturing profile being used (e.g., `Engine Profile: Automated High-Speed Litho Press Routing (Volume Tier)`).

### 3. File Size & Format Inline Validator
The drop zone features strict, localized client validations:
*   **Size Cap:** Bounded firmly at **10MB**. Rejects and throws an inline rose-colored banner for heavy video files.
*   **Format Verification:** Safely restricts input strictly to print-ready or layer design layouts (`.pdf`, `.png`, `.jpg`, `.jpeg`, `.ai`, `.psd`, `.eps`).

### 4. Local Lead Management Dashboard & CSV Exporter
Clicking the secure `[STUDIO CONTROL LOG]` button inside the page footer dynamically renders a hidden studio panel tracking all incoming requests. 
*   Includes total request metric analysis cards, pipeline status modifiers, and active description blocks.
*   Features a one-click **Export to Excel (.CSV)** utility engine that parses client profiles, descriptions, price calculations, and Cloudinary upload links into flat download sheets.
*   Features a prompt-guarded **Clear Workspace Ledger** tool to flush local sandboxes fresh.

---

## 📂 Refactored File Tree Map
To prevent relative directory transversal failures or path aliasing issues, all primary application workflow files have been unified cleanly into a flat component space:

```text
src/
├── assets/
│   └── Impressions.png        <-- Physical Branding Logo Asset
├── components/
│   ├── ui/
│   │   ├── button.jsx         <-- Shadcn UI Button Element
│   │   └── card.jsx           <-- Shadcn UI Card Framework Elements
│   ├── AdminDashboard.jsx     <-- Workspace Grid, Metric Cards, CSV Engine
│   ├── FileUploader.jsx       <-- Cloudinary Intake, Format Validator Banner
│   ├── PriceDisplay.jsx       <-- Budget Range, Dynamic Engine Profile Badge
│   ├── pricingMatrix.js       <-- Smart Substrate Routing Logic (ZAR)
│   ├── QuoteForm.jsx          <-- Adaptive Step Engine, Value State Matrix
│   ├── TestimonialSlider.jsx  <-- Animated Client Reviews Slider
│   └── testimonialData.js     <-- Verified South African Review Metadata
├── data/
│   └── portfolioItems.js      <-- Case Studies Project Grid Metadata
├── App.jsx                    <-- Header layout, Global View Routing Toggle
└── main.jsx                   <-- Application Root Bootloader Mount
```

---

## ⚙️ Environment Variables Setup

Create a file named `.env` in your absolute outermost root folder (at the same directory level as your `package.json` and `index.html`) and paste your keys exactly like this:

```text
VITE_WEB3FORMS_KEY=your_exact_web3forms_key_here
VITE_CLOUDINARY_CLOUD_NAME=your_lowercase_cloud_name
VITE_CLOUDINARY_PRESET=your_unsigned_upload_preset_name
```
*Note: Ensure there are no spaces, quotation marks, or semicolons around your values.*

### 🛠️ Production Vercel Dashboard Sync
To ensure your live `.vercel.app` site connects to your cloud layers, navigate to your **Vercel Project Settings > Environment Variables** and add all three variables, ticking the checkboxes for **Production, Preview, and Development**. Run a **Redeploy** on your deployments tab to bake them into your compressed JavaScript file bundles.

---

## 🏁 Development & Deployment Cheat Sheet

Use these quick MINGW64 / Git Bash terminal scripts to safely build, audit, and launch updates:

```bash
# 1. Force Vite to dump optimization caches and reload directory parameters
npx vite --force

# 2. Run the production compiler to bundle slim client distribution assets
npm run build

# 3. Commit layout modifications and deploy live upstream to Vercel
git add .
git commit -m "feat: complete automated print pricing and local admin tracking ecosystem"
git push origin main
```

---
*Maintained securely via Web3Forms API routing framework. All commercial budget calculations optimized for ZAR market scales.*
