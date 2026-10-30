import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Printer, Paintbrush, ShieldCheck, Laptop, UploadCloud, FileText } from 'lucide-react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import FileUploader from './FileUploader';

export default function QuoteForm() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("");
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({
    serviceType: '', productCategory: '', quantity: '1',
    pagesCount: '1', isoSize: 'A4', printColor: 'cmyk', pressEnvironment: 'litho',
    designOutput: 'unspecified', paperFinish: 'standard', webScope: 'landing-page', 
    description: '', assetDownloadUrl: '', clientName: '', clientEmail: '', clientPhone: ''
  });

  const nextStep = () => { setDirection(1); setStep((prev) => prev + 1); };
  const prevStep = () => { setDirection(-1); setStep((prev) => prev - 1); };

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? 80 : -80, opacity: 0 })
  };

  const handleFieldUpdate = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceSelect = (type) => {
    setFormData({
      serviceType: type, productCategory: '', quantity: type === 'consulting' ? 'litho' : '1',
      pagesCount: '1', isoSize: 'A4', printColor: 'cmyk', pressEnvironment: 'litho',
      designOutput: 'unspecified', paperFinish: 'standard', webScope: 'landing-page', 
      description: '', assetDownloadUrl: formData.assetDownloadUrl, clientName: formData.clientName, 
      clientEmail: formData.clientEmail, clientPhone: formData.clientPhone
    });
    nextStep();
  };

   // 🌟 DYNAMIC CATEGORIES: Mapped with bulletproof fallbacks
    // 🌟 REBALANCED CATEGORIES: Explicitly separated Toner sheets from Wide-Format Inkjet runs
  const getDynamicCategories = () => {
    switch (formData.serviceType) {
      case 'design': return ['Graphic Design', 'UX/UI Design'];
      case 'print': return [
        'Digital Toner Press (Short-Run Sheets)', 
        'Wide-Format Digital Inkjet Production', 
        'Offset Manufacturing', 
        'Industrial Screen Printing', 
        'Heat Press Branding Process'
      ];
      case 'web': return ['UX Layout Architecture', 'Frontend Application Dev'];
      case 'consulting': return ['Prepress Preflight Audit', 'Color Ingest Calibration'];
      default: return [];
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const raw = localStorage.getItem('design_print_orders');
      let orderList = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(orderList)) orderList = [];

      const freshEntry = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString(),
        status: 'New / Unreviewed',
        ...formData
      };
      orderList.unshift(freshEntry);
      localStorage.setItem('design_print_orders', JSON.stringify(orderList));
    } catch (err) {
      console.error(err);
    }

    const submissionData = new FormData();
    submissionData.append("access_key", import.meta.env.VITE_WEB3FORMS_KEY);
    submissionData.append("Client_Name", formData.clientName);
    submissionData.append("Client_Email", formData.clientEmail);
    submissionData.append("Client_Phone", formData.clientPhone || "N/A");
    submissionData.append("Operational_Service_Track", formData.serviceType);
    submissionData.append("Specialization_Category", formData.productCategory);
    submissionData.append("Project_Brief_Description", formData.description);
    submissionData.append("Cloudinary_Asset_Link", formData.assetDownloadUrl || "No File Attached");

    if (formData.serviceType === 'print') {
      submissionData.append("Print_Quantity_Run", formData.quantity);
      submissionData.append("Total_Pages_Count", formData.pagesCount);
      submissionData.append("ISO_Paper_Dimension", formData.isoSize);
      submissionData.append("Ink_Color_Profile", formData.printColor);
      submissionData.append("Substrate_Surface_Finish", formData.paperFinish);
    } else if (formData.serviceType === 'web') {
      submissionData.append("React_Web_Scope_Tier", formData.webScope);
    } else if (formData.serviceType === 'consulting') {
      submissionData.append("Press_Production_Environment", formData.pressEnvironment);
    } else if (formData.serviceType === 'design') {
      submissionData.append("Required_Design_Output_Format", formData.designOutput);
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: submissionData });
      const data = await response.json();
      if (data.success) { setStatus("success"); setStep(5); } 
      else { setStatus("error"); alert("Error: " + data.message); }
    } catch (err) { setStatus("error"); alert("Network error occurred."); }
  };
   return (
    <div className="w-full max-w-lg mx-auto p-4 relative min-h-[520px]">
      {/* 🌟 ACCESSIBILITY CALLOUT BANNER FOR NON-TECHNICAL USERS */}
      <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2.5 shadow-2xs">
        <div className="p-1 bg-blue-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider px-1.5 shrink-0">HELP</div>
        <p className="text-xs text-blue-800 leading-normal font-medium">
          Not sure which print or file parameters to select? Don't worry! Enter your best guess, or if you need immediate assistance, call or WhatsApp our studio helpdesk directly at <a href="tel:+27632985713" className="font-bold underline hover:text-blue-900">+27 63 298 5713</a>. We will manually refine your quote specifications during our preflight audit.
        </p>
      </div>
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div key={step} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.15 }}>
          
          {/* Step 1: Capability Core Selection */}
          {step === 1 && (
            <Card className="border border-slate-200 shadow-md bg-white text-left">
              <CardHeader>
                <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Start Your Project with Impressions</CardTitle>
                <CardDescription>Select the specialized capability track matching your requirements.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-2.5">
                <button type="button" onClick={() => handleServiceSelect('design')} className="flex items-center gap-4 p-3.5 rounded-xl border text-left transition-all bg-white border-slate-200 hover:border-slate-300 w-full cursor-pointer">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Paintbrush className="h-5 w-5" /></div>
                  <div><h4 className="font-semibold text-sm text-slate-900">Design</h4><p className="text-xs text-slate-500">Corporate branding suites, high-fidelity layouts, and vector assets.</p></div>
                </button>
                <button type="button" onClick={() => handleServiceSelect('print')} className="flex items-center gap-4 p-3.5 rounded-xl border text-left transition-all bg-white border-slate-200 hover:border-slate-300 w-full cursor-pointer">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Printer className="h-5 w-5" /></div>
                  <div><h4 className="font-semibold text-sm text-slate-900">Print Production Suite</h4><p className="text-xs text-slate-500">High-volume manufacturing, screens, vinyl layouts, and heat presses.</p></div>
                </button>
                <button type="button" onClick={() => handleServiceSelect('web')} className="flex items-center gap-4 p-3.5 rounded-xl border text-left transition-all bg-white border-slate-200 hover:border-slate-300 w-full cursor-pointer">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Laptop className="h-5 w-5" /></div>
                  <div><h4 className="font-semibold text-sm text-slate-900">Frontend Web Design & Dev</h4><p className="text-xs text-slate-500">High-converting React applications, modern UI kits, and landing pages.</p></div>
                </button>
                <button type="button" onClick={() => handleServiceSelect('consulting')} className="flex items-center gap-4 p-3.5 rounded-xl border text-left transition-all bg-white border-slate-200 hover:border-slate-300 w-full cursor-pointer">
                  <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><ShieldCheck className="h-5 w-5" /></div>
                  <div><h4 className="font-semibold text-sm text-slate-900">Prepress Consultancy</h4><p className="text-xs text-slate-500">File preflights, production calibrations, and audit reviews.</p></div>
                </button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Custom Parameter Setup Dropdowns */}
          {step === 2 && (
            <Card className="border border-slate-200 shadow-md bg-white text-left">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900">Configure Specifications</CardTitle>
                <CardDescription>Tailor project properties below to build an accurate calculation profile.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Specialization Category</label>
                  <select value={formData.productCategory} onChange={(e) => handleFieldUpdate('productCategory', e.target.value)} className="w-full rounded-xl border border-slate-200 p-2.5 text-sm bg-white text-slate-800">
                    <option value="">-- Choose Category --</option>
                    {getDynamicCategories().map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {formData.serviceType === 'print' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Quantity / Volume</label>
                        <input 
                          type="number" 
                          min="1" 
                          value={formData.quantity} 
                          onChange={(e) => handleFieldUpdate('quantity', Math.max(1, parseInt(e.target.value, 10) || 1))} 
                          className="w-full rounded-xl border border-slate-200 p-2 text-sm text-slate-800" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Total Pages</label>
                        <input 
                          type="number" 
                          min="1" 
                          value={formData.pagesCount} 
                          onChange={(e) => handleFieldUpdate('pagesCount', Math.max(1, parseInt(e.target.value, 10) || 1))} 
                          className="w-full rounded-xl border border-slate-200 p-2 text-sm text-slate-800" 
                        />
                      </div>
                    </div>

                    {/* 🌟 RE-INTEGRATED: ISO Paper Size Dimension Options Panel */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">ISO Paper Sizing Layout</label>
                      <select value={formData.isoSize} onChange={(e) => handleFieldUpdate('isoSize', e.target.value)} className="w-full rounded-xl border border-slate-200 p-2.5 text-sm bg-white text-slate-800">
                        <option value="A4">A4 Layout Standard Sheet</option>
                        <option value="A1">A1 Massive Industrial Display</option>
                        <option value="A2">A2 Large Format Brand Poster</option>
                        <option value="A3">A3 Medium Production Layout</option>
                        <option value="A5">A5 Compact Leaflet Handout</option>
                        <option value="A6">A6 Pocket Pamphlet Cards</option>
                        <option value="DL">DL Envelope Slip Format</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Ink Profile Setup</label>
                      <select value={formData.printColor} onChange={(e) => handleFieldUpdate('printColor', e.target.value)} className="w-full rounded-xl border border-slate-200 p-2.5 text-sm bg-white text-slate-800">
                        <option value="cmyk">CMYK Dynamic Full Color</option>
                        <option value="bw">Monochromatic High-Contrast Black & White</option>
                        <option value="uv">UV Gel Specialized Commercial Matte Curing Ink</option>
                        <option value="sublimation">Dye Sublimation Thermal Dispersal Ink Profile</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Substrate Base Material / Finish</label>
                      <select 
                        value={formData.paperFinish} 
                        onChange={(e) => handleFieldUpdate('paperFinish', e.target.value)} 
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-sm bg-white text-slate-800"
                      >
                        <option value="standard">Standard Matte Paper Base</option>
                        <option value="gloss">Gloss Coating Varnish</option>
                        <option value="uv">UV High-Gloss Protection Shield</option>
                        <option value="correx">Correx Board Rigid Core Flute</option>
                        <option value="vinyl">Premium Flexible Signage Vinyl</option>
                        <option value="pack_board">Industrial Packaging Box Board</option>
                        {/* 🌟 NEW BRANDING SUBSTRATES */}
                        <option value="heat_transfer">Heat Transfer Paper (Inkjet Media)</option>
                        <option value="sub_paper">Sublimation Carrier Paper Sheets</option>
                        <option value="dtf_film">Direct to Film (DTF Premium PET Film)</option>
                      </select>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4 bg-slate-50/50">
                <Button variant="outline" onClick={prevStep} className="rounded-xl text-xs cursor-pointer"><ChevronLeft className="h-4 w-4 mr-1" /> Back</Button>
                <Button onClick={nextStep} disabled={!formData.productCategory} className="rounded-xl text-xs bg-slate-900 text-white hover:bg-slate-800 cursor-pointer">Continue <ChevronRight className="h-4 w-4 ml-1" /></Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 3: Local drop-zone Asset Ingest Engine */}
          {step === 3 && (
            <Card className="border border-slate-200 shadow-md bg-white text-left">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900">Project Brief & Artwork Upload</CardTitle>
                <CardDescription>Provide operational criteria and supply design file assets directly.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Scope Brief Requirements</label>
                  <textarea value={formData.description} onChange={(e) => handleFieldUpdate('description', e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 text-sm min-h-[90px] text-slate-800" placeholder="Outline sizes, visual styling descriptions or technical constraints..." />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Production-Ready File (Optional)</label>
                  <FileUploader onUploadSuccess={(url) => handleFieldUpdate('assetDownloadUrl', url)} />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4 bg-slate-50/50">
                <Button variant="outline" onClick={prevStep} className="rounded-xl text-xs cursor-pointer"><ChevronLeft className="h-4 w-4 mr-1" /> Back</Button>
                <Button onClick={nextStep} disabled={!formData.description} className="rounded-xl text-xs bg-slate-900 text-white hover:bg-slate-800 cursor-pointer">Continue <ChevronRight className="h-4 w-4 ml-1" /></Button>
              </CardFooter>
            </Card>
          )}
                    {/* Step 4: Core Contact Data Ingest Form */}
          {step === 4 && (
            <Card className="border border-slate-200 shadow-md bg-white text-left">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900">Contact Specifications</CardTitle>
                <CardDescription>Supply contact variables to map out dispatch destinations.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Full Name</label>
                    <input type="text" required value={formData.clientName} onChange={(e) => handleFieldUpdate('clientName', e.target.value)} className="w-full rounded-xl border border-slate-200 p-2 text-sm text-slate-800" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Email Address</label>
                    <input type="email" required value={formData.clientEmail} onChange={(e) => handleFieldUpdate('clientEmail', e.target.value)} className="w-full rounded-xl border border-slate-200 p-2 text-sm text-slate-800" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Phone Number</label>
                    <input type="text" value={formData.clientPhone} onChange={(e) => handleFieldUpdate('clientPhone', e.target.value)} className="w-full rounded-xl border border-slate-200 p-2 text-sm text-slate-800" placeholder="e.g. +27 63 298 5713" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4 bg-slate-50/50">
                  <Button type="button" variant="outline" onClick={prevStep} disabled={status === "submitting"} className="rounded-xl text-xs cursor-pointer"><ChevronLeft className="h-4 w-4 mr-1" /> Back</Button>
                  <Button type="submit" disabled={status === "submitting" || !formData.clientName || !formData.clientEmail} className="rounded-xl text-xs bg-emerald-600 text-white hover:bg-emerald-700 font-bold px-5 cursor-pointer">
                    {status === "submitting" ? "Processing..." : "Submit Project Intake"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {/* Step 5: Success Banner Confirmation Card */}
          {step === 5 && (
            <Card className="border border-slate-200 shadow-md bg-white text-center py-6">
              <CardContent className="space-y-3">
                <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm"><Check className="h-6 w-6" /></div>
                <CardTitle className="text-xl font-bold text-slate-900">Project Intaken Successfully!</CardTitle>
                <CardDescription className="max-w-xs mx-auto text-sm text-slate-500">Your specifications are successfully securely cached inside our workspace ledger matrix. Our engineering team is currently running a preflight audit.</CardDescription>
              </CardContent>
              <CardFooter className="justify-center border-t pt-4">
                <Button onClick={() => { setStep(1); setFormData({ serviceType: '', productCategory: '', quantity: '1', pagesCount: '1', isoSize: 'A4', printColor: 'cmyk', pressEnvironment: 'litho', designOutput: 'unspecified', paperFinish: 'standard', webScope: 'landing-page', description: '', assetDownloadUrl: '', clientName: '', clientEmail: '', clientPhone: '' }); setStatus(""); }} className="rounded-xl text-xs bg-slate-900 text-white hover:bg-slate-800 cursor-pointer">Log Another Intake</Button>
              </CardFooter>
            </Card>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}



