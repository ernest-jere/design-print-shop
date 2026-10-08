import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Printer, Paintbrush, Layers, ShieldCheck, Laptop } from 'lucide-react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import FileUploader from './FileUploader';
import PriceDisplay from './PriceDisplay';

export default function QuoteForm() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("");
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({
    serviceType: '', productCategory: '', quantity: '',
    paperFinish: 'standard', description: '', assetDownloadUrl: '',
    clientName: '', clientEmail: '', clientPhone: ''
  });

  const nextStep = () => { setDirection(1); setStep((prev) => prev + 1); };
  const prevStep = () => { setDirection(-1); setStep((prev) => prev - 1); };

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? 80 : -80, opacity: 0 })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    // 🌟 LOCAL STORAGE FORCED WRITER LAYER
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
      console.log("Logged item successfully inside browser storage:", freshEntry);
    } catch (err) {
      console.error("Local tracking bypass:", err);
    }

    // WEB3FORMS NETWORKING STACK
    const submissionData = new FormData();
    submissionData.append("access_key", import.meta.env.VITE_WEB3FORMS_KEY);
    Object.keys(formData).forEach(key => {
      submissionData.append(key, formData[key]);
    });

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: submissionData
      });
      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setStep(5);
      } else {
        setStatus("error");
        alert("Submission failed: " + data.message);
      }
    } catch (err) {
      setStatus("error");
      alert("A network error occurred. Please verify your internet connection.");
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 relative min-h-[520px]">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div key={step} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.15 }}>
          
          {step === 1 && (
            <Card className="border border-slate-200 shadow-md bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">What do you need help with?</CardTitle>
                <CardDescription>Select the specialized engine required for your project parameters.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-2.5">
                <button type="button" onClick={() => { setFormData({ ...formData, serviceType: 'design' }); nextStep(); }} className={`flex items-center gap-4 p-3.5 rounded-xl border text-left transition-all bg-white ${formData.serviceType === 'design' ? 'border-blue-600 bg-blue-50/20' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Paintbrush className="h-5 w-5" /></div>
                  <div><h4 className="font-semibold text-sm text-slate-900">Graphic Design Only</h4><p className="text-xs text-slate-500">Logos, visual branding layout guides, and vector asset creation.</p></div>
                </button>
                <button type="button" onClick={() => { setFormData({ ...formData, serviceType: 'print' }); nextStep(); }} className={`flex items-center gap-4 p-3.5 rounded-xl border text-left transition-all bg-white ${formData.serviceType === 'print' ? 'border-blue-600 bg-blue-50/20' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Printer className="h-5 w-5" /></div>
                  <div><h4 className="font-semibold text-sm text-slate-900">Print Only Production</h4><p className="text-xs text-slate-500">You supply print-ready artwork assets, we execute manufacturing tasks.</p></div>
                </button>
                <button type="button" onClick={() => { setFormData({ ...formData, serviceType: 'web' }); nextStep(); }} className={`flex items-center gap-4 p-3.5 rounded-xl border text-left transition-all bg-white ${formData.serviceType === 'web' ? 'border-blue-600 bg-blue-50/40' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Laptop className="h-5 w-5" /></div>
                  <div><h4 className="font-semibold text-sm text-slate-900">Web Design & Development</h4><p className="text-xs text-slate-500">High-converting landing pages, custom React platforms, or web stores.</p></div>
                </button>
                <button type="button" onClick={() => { setFormData({ ...formData, serviceType: 'consulting' }); nextStep(); }} className={`flex items-center gap-4 p-3.5 rounded-xl border text-left transition-all bg-white ${formData.serviceType === 'consulting' ? 'border-blue-600 bg-blue-50/40' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className="p-2 bg-rose-100 text-rose-600 rounded-lg"><ShieldCheck className="h-5 w-5" /></div>
                  <div><h4 className="font-semibold text-sm text-slate-900">Prepress Consultancy</h4><p className="text-xs text-slate-500">File preflights, transparencies, bleed checking, and print setups.</p></div>
                </button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="border border-slate-200 shadow-md bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-900">Select Deliverable Type</CardTitle>
                <CardDescription>What target media structure are we setting up?</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                {['Business Cards & Stationery', 'Banners & Large Format', 'Custom Apparel & Merch', 'Web Landing Pages', 'Full-Stack Web Apps', 'Prepress Preflight Audit'].map((cat) => (
                  <Button key={cat} variant={formData.productCategory === cat ? "default" : "outline"} className="h-14 justify-start text-left px-3 rounded-xl text-wrap text-xs font-medium" onClick={() => { setFormData({ ...formData, productCategory: cat }); nextStep(); }}>
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
            <Card className="border border-slate-200 shadow-md bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-900">Project Scope Details</CardTitle>
                <CardDescription>Provide metrics to compute parameters and workflow hours accurately.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(formData.serviceType === 'print' || formData.serviceType === 'both') && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold uppercase text-slate-500">Quantity</label>
                      <input type="text" placeholder="e.g. 500 units" className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 outline-none focus:border-blue-500" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase text-slate-500">Material Finish</label>
                      <select className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 outline-none focus:border-blue-500" value={formData.paperFinish} onChange={(e) => setFormData({...formData, paperFinish: e.target.value})}>
                        <option value="standard">Standard Matte</option>
                        <option value="gloss">Premium High-Gloss</option>
                        <option value="uv">Spot UV / Foil Accents</option>
                        <option value="unsupported">Not sure / Need advice</option>
                      </select>
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">
                    {formData.serviceType === 'web' ? 'Features, Pages & System Goals' : formData.serviceType === 'consulting' ? 'Current Issues & Target Press House Specs' : 'Visual Vision & Dimensions'}
                  </label>
                  <textarea rows={4} placeholder={formData.serviceType === 'web' ? "Describe custom integrations, UI components, or logic frameworks required..." : "Describe file dimensions, page layouts, print criteria, or bleeding bounds..."} className="w-full mt-1 p-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 outline-none focus:border-blue-500 resize-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
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
              <Card className="border border-slate-200 shadow-md bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-900">Contact Verification</CardTitle>
                  <CardDescription>Where should we dispatch your custom operational calculation matrix?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Full Name</label>
                    <input type="text" required className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:border-blue-500" value={formData.clientName} onChange={(e) => setFormData({...formData, clientName: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Email Address</label>
                    <input type="email" required className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:border-blue-500" value={formData.clientEmail} onChange={(e) => setFormData({...formData, clientEmail: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Phone Number (Optional)</label>
                    <input type="tel" className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:border-blue-500" value={formData.clientPhone} onChange={(e) => setFormData({...formData, clientPhone: e.target.value})} />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-slate-100 pt-4 bg-slate-50/50 rounded-b-xl">
                  <Button type="button" variant="ghost" className="text-slate-600 hover:text-slate-900" onClick={prevStep}><ChevronLeft className="mr-1 h-4 w-4" /> Back</Button>
                  <Button type="submit" disabled={status === "submitting" || !formData.clientName || !formData.clientEmail} className={`text-white transition-all ${status === "submitting" ? "bg-slate-400" : "bg-blue-600 hover:bg-blue-700"}`}>
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
                  Thank you, <strong>{formData.clientName}</strong>. Your setup requirements for <strong>{formData.productCategory}</strong> have been saved. A manual review analysis layout will reach <strong>{formData.clientEmail}</strong> shortly.
                </p>
                <div className="pt-4">
                  <Button variant="outline" className="border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-100/50" onClick={() => { setStep(1); setStatus(""); setFormData({ serviceType:'', productCategory:'', quantity:'', paperFinish:'standard', description:'', clientName:'', clientEmail:'', clientPhone:'', assetDownloadUrl:'' }); }}>
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

