import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Printer, Paintbrush, ShieldCheck, Laptop } from 'lucide-react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import FileUploader from './FileUploader';
import PriceDisplay from './PriceDisplay';

export default function QuoteForm() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("");
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({
    serviceType: '', productCategory: '', quantity: '1',
    pagesCount: '1', isoSize: 'A4', pressEnvironment: 'litho',
    designOutput: 'vector-svg', paperFinish: 'standard', webScope: 'landing-page', 
    description: '', assetDownloadUrl: '', clientName: '', clientEmail: '', clientPhone: ''
  });

  const nextStep = () => { setDirection(1); setStep((prev) => prev + 1); };
  const prevStep = () => { setDirection(-1); setStep((prev) => prev - 1); };

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? 80 : -80, opacity: 0 })
  };

  const getDynamicCategories = () => {
    switch (formData.serviceType) {
      case 'design': return ['Graphic Design', 'UX/UI Design'];
      case 'print': return ['Digital Printing', 'Offset Manufacturing'];
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
    Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));

    try {
      const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: submissionData });
      const data = await response.json();
      if (data.success) { setStatus("success"); setStep(5); } 
      else { setStatus("error"); alert("Error: " + data.message); }
    } catch (err) { setStatus("error"); alert("Network error occurred."); }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 relative min-h-[520px]">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div key={step} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.15 }}>
          
          {step === 1 && (
            <Card className="border border-slate-200 shadow-md bg-white text-left">
              <CardHeader>
                <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Start Your Project with Impressions</CardTitle>
                <CardDescription>Select the specialized capability track matching your operational requirements.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-2.5">
                <button type="button" onClick={() => { setFormData({ ...formData, serviceType: 'design' }); nextStep(); }} className={`flex items-center gap-4 p-3.5 rounded-xl border text-left transition-all bg-white ${formData.serviceType === 'design' ? 'border-[#1b5e20] bg-emerald-50/10' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Paintbrush className="h-5 w-5" /></div>
                  <div><h4 className="font-semibold text-sm text-slate-900">Design</h4><p className="text-xs text-slate-500">Corporate branding suites, high-fidelity layouts, and vector assets.</p></div>
                </button>
                <button type="button" onClick={() => { setFormData({ ...formData, serviceType: 'print' }); nextStep(); }} className={`flex items-center gap-4 p-3.5 rounded-xl border text-left transition-all bg-white ${formData.serviceType === 'print' ? 'border-[#1b5e20] bg-emerald-50/10' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Printer className="h-5 w-5" /></div>
                  <div><h4 className="font-semibold text-sm text-slate-900">Digital & Offset Print Production</h4><p className="text-xs text-slate-500">High-volume manufacturing runs, signs, stationery, and premium materials.</p></div>
                </button>
                <button type="button" onClick={() => { setFormData({ ...formData, serviceType: 'web' }); nextStep(); }} className={`flex items-center gap-4 p-3.5 rounded-xl border text-left transition-all bg-white ${formData.serviceType === 'web' ? 'border-[#1b5e20] bg-emerald-50/10' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Laptop className="h-5 w-5" /></div>
                  <div><h4 className="font-semibold text-sm text-slate-900">Frontend Web Design & Dev</h4><p className="text-xs text-slate-500">High-converting React applications, modern UI kits, and landing pages.</p></div>
                </button>
                <button type="button" onClick={() => { setFormData({ ...formData, serviceType: 'consulting' }); nextStep(); }} className={`flex items-center gap-4 p-3.5 rounded-xl border text-left transition-all bg-white ${formData.serviceType === 'consulting' ? 'border-[#1b5e20] bg-emerald-50/10' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><ShieldCheck className="h-5 w-5" /></div>
                  <div><h4 className="font-semibold text-sm text-slate-900">Prepress Consultancy</h4><p className="text-xs text-slate-500">File preflights, transparencies, bleed checking, and print setups.</p></div>
                </button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="border border-slate-200 shadow-md bg-white text-left">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-900">Select Specific Specialization</CardTitle>
                <CardDescription>Choose the core requirement parameters matching your project scope.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {getDynamicCategories().map((cat) => (
                  <Button key={cat} variant={formData.productCategory === cat ? "default" : "outline"} className={`h-14 justify-start text-left px-3 rounded-xl text-wrap text-xs font-medium ${formData.productCategory === cat ? 'bg-[#1b5e20] hover:bg-[#124116]' : ''}`} onClick={() => { setFormData({ ...formData, productCategory: cat }); nextStep(); }}>
                    {cat}
                  </Button>
                ))}
              </CardContent>
              <CardFooter className="flex justify-between border-t border-slate-100 pt-4 bg-slate-50/50 rounded-b-xl">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900" onClick={prevStep}><ChevronLeft className="mr-1 h-4 w-4" /> Back</Button>
              </CardFooter>
            </Card>
          )}
                    {step === 3 && (
            <Card className="border border-slate-200 shadow-md bg-white text-left">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-900">Configure Scope Parameters</CardTitle>
                <CardDescription>Provide variables unique to your selected project type.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {formData.serviceType === 'consulting' && (
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="text-xs font-semibold uppercase text-slate-500">Target Press Production Environment</label>
                      <select className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 outline-none focus:border-emerald-600" value={formData.pressEnvironment} onChange={(e) => setFormData({...formData, pressEnvironment: e.target.value})}>
                        <option value="litho">Offset Lithography (High-Volume)</option>
                        <option value="flexo">Flexography (Packaging/Labels)</option>
                        <option value="gravure">Rotogravure (Commercial Publications)</option>
                        <option value="digital-press">High-Speed Digital Web Press</option>
                      </select>
                    </div>
                  </div>
                )}

                {formData.serviceType === 'print' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold uppercase text-slate-500">Print Volume Quantity</label>
                        <input type="text" placeholder="e.g. 500 units" className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 outline-none focus:border-emerald-600" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase text-slate-500">Number of Pages</label>
                        <input type="number" min="1" className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 outline-none focus:border-emerald-600" value={formData.pagesCount} onChange={(e) => setFormData({...formData, pagesCount: e.target.value})} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold uppercase text-slate-500">ISO Paper Standard Size</label>
                        <select className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 outline-none focus:border-emerald-600" value={formData.isoSize} onChange={(e) => setFormData({...formData, isoSize: e.target.value})}>
                          <option value="A3">A3 Large Format Poster</option>
                          <option value="A4">A4 Standard Sheet</option>
                          <option value="A5">A5 Compact Leaflet</option>
                          <option value="A6">A6 Pocket Size Flyer / Notebook</option>
                          <option value="DL">DL Envelope / Dimension</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase text-slate-500">Material Surface Finish</label>
                        <select className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 outline-none focus:border-emerald-600" value={formData.paperFinish} onChange={(e) => setFormData({...formData, paperFinish: e.target.value})}>
                          <option value="standard">Standard Matte Base</option>
                          <option value="gloss">Premium High-Gloss</option>
                          <option value="uv">Spot UV Accents</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {formData.serviceType === 'web' && (
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="text-xs font-semibold uppercase text-slate-500">Target Framework Scope</label>
                      <select className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 outline-none" value={formData.webScope} onChange={(e) => setFormData({...formData, webScope: e.target.value})}>
                        <option value="landing-page">Single Page Responsive UI</option>
                        <option value="full-stack">Multi-Route React Dashboard Application</option>
                        <option value="ecom">Custom Commerce Storefront</option>
                      </select>
                    </div>
                  </div>
                )}

                {formData.serviceType === 'design' && (
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="text-xs font-semibold uppercase text-slate-500">Required Design Output / Deliverable Format</label>
                      <select className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 outline-none focus:border-emerald-600" value={formData.designOutput} onChange={(e) => setFormData({...formData, designOutput: e.target.value})}>
                        <option value="vector-svg">Scalable Vector Graphic Layout (.SVG / .AI)</option>
                        <option value="print-pdf">Press-Ready Corporate Document (.PDF Blueprint)</option>
                        <option value="figma-ui">High-Fidelity UI/UX Prototype Core Template (Figma Link)</option>
                        <option value="raster-png">High-Res Production Branding Creative (.PNG / .JPG)</option>
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">
                    {formData.serviceType === 'web' ? 'Technical System Requirements & Integrations' : formData.serviceType === 'consulting' ? 'Describe Current File Errors & Requirements' : 'Visual Vision Requirements'}
                  </label>
                  <textarea rows={4} placeholder="Provide specific layout parameters, technical boundaries, or design briefs here..." className="w-full mt-1 p-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 outline-none resize-none focus:border-emerald-600" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="pt-2">
                  <FileUploader onUploadSuccess={(url) => setFormData(prev => ({ ...prev, assetDownloadUrl: url }))} />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-slate-100 pt-4 bg-slate-50/50 rounded-b-xl">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900" onClick={prevStep}><ChevronLeft className="mr-1 h-4 w-4" /> Back</Button>
                <Button disabled={!formData.description.trim()} onClick={nextStep} className="bg-slate-900 text-white hover:bg-slate-800">Next Step <ChevronRight className="ml-1 h-4 w-4" /></Button>
              </CardFooter>
              <div className="px-6 pb-4"><PriceDisplay formData={formData} /></div>
            </Card>
          )}
                    {step === 4 && (
            <form onSubmit={handleSubmit}>
              <Card className="border border-slate-200 shadow-md bg-white text-left">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-900">Contact Verification</CardTitle>
                  <CardDescription>Where should we dispatch your evaluation calculation analysis matrix?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Full Name</label>
                    <input type="text" required className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none" value={formData.clientName} onChange={(e) => setFormData({...formData, clientName: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Email Address</label>
                    <input type="email" required className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none" value={formData.clientEmail} onChange={(e) => setFormData({...formData, clientEmail: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Phone Number (Optional)</label>
                    <input type="tel" className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none" value={formData.clientPhone} onChange={(e) => setFormData({...formData, clientPhone: e.target.value})} />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-slate-100 pt-4 bg-slate-50/50 rounded-b-xl">
                  <Button type="button" variant="ghost" className="text-slate-600 hover:text-slate-900" onClick={prevStep}><ChevronLeft className="mr-1 h-4 w-4" /> Back</Button>
                  <Button type="submit" disabled={status === "submitting" || !formData.clientName || !formData.clientEmail} className={`text-white transition-all ${status === "submitting" ? "bg-slate-400" : "bg-[#1b5e20] hover:bg-[#124116]"}`}>
                    {status === "submitting" ? "Sending..." : "Request Manual Quote"}
                  </Button>
                </CardFooter>
                <div className="px-6 pb-4"><PriceDisplay formData={formData} /></div>
              </Card>
            </form>
          )}

          {step === 5 && (
            <Card className="border border-emerald-200 bg-emerald-50/30 text-center py-8 shadow-sm">
              <CardContent className="space-y-3 pt-6">
                <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2"><Check className="h-6 w-6" /></div>
                <CardTitle className="text-emerald-900 text-xl font-bold">Brief Logged Successfully!</CardTitle>
                <p className="text-sm text-emerald-700 max-w-sm mx-auto px-4 leading-relaxed">
                  Thank you, <strong>{formData.clientName}</strong>. Your setup parameters have been saved securely. An engineer will reach out to <strong>{formData.clientEmail}</strong> shortly.
                </p>
                <div className="pt-4">
                  <Button variant="outline" className="border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-100/50" onClick={() => { setStep(1); setStatus(""); setFormData({ serviceType:'', productCategory:'', quantity:'1', pagesCount:'1', isoSize:'A4', pressEnvironment:'litho', designOutput:'vector-svg', paperFinish:'standard', webScope:'landing-page', description:'', clientName:'', clientEmail:'', clientPhone:'', assetDownloadUrl:'' }); }}>
                    Submit Alternative Brief
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}


