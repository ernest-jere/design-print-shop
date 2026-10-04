import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Printer, Paintbrush, Layers } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function QuoteForm() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("");
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({
    serviceType: '',
    productCategory: '',
    quantity: '',
    paperFinish: 'standard',
    description: '',
    clientName: '',
    clientEmail: '',
    clientPhone: ''
  });

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? 100 : -100, opacity: 0 })
  };

  const nextStep = () => { setDirection(1); setStep((prev) => prev + 1); };
  const prevStep = () => { setDirection(-1); setStep((prev) => prev - 1); };

  const handleSelectService = (type) => {
    setFormData({ ...formData, serviceType: type });
    nextStep();
  };

  const handleSelectCategory = (category) => {
    setFormData({ ...formData, productCategory: category });
    nextStep();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    const submissionData = new FormData();
    submissionData.append("access_key", import.meta.env.VITE_WEB3FORMS_KEY);
    
    Object.keys(formData).forEach(key => {
      submissionData.append(key, formData[key]);
    });

    try {
      const response = await fetch("https://web3forms.com", {
        method: "POST",
        body: submissionData
      });
      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setStep(5);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 relative min-h-[520px]">
      <AnimatePresence mode="wait" custom={direction}>
        
        {/* STEP 1: SERVICE TYPE CHOICE */}
        {step === 1 && (
          <motion.div key="step1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
            <Card className="border border-slate-200 shadow-md bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">What do you need help with?</CardTitle>
                <CardDescription>Select the option that best fits your project parameters.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-3">
                <button type="button" onClick={() => handleSelectService('design')} className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${formData.serviceType === 'design' ? 'border-blue-600 bg-blue-50/40' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Paintbrush className="h-6 w-6" /></div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Design Only</h4>
                    <p className="text-xs text-slate-500">Logos, visual branding identity guidelines, or digital art layouts.</p>
                  </div>
                </button>
                <button type="button" onClick={() => handleSelectService('print')} className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${formData.serviceType === 'print' ? 'border-blue-600 bg-blue-50/40' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Printer className="h-6 w-6" /></div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Print Only</h4>
                    <p className="text-xs text-slate-500">You already have print-ready artwork, you just need high-end printing production.</p>
                  </div>
                </button>
                <button type="button" onClick={() => handleSelectService('both')} className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${formData.serviceType === 'both' ? 'border-blue-600 bg-blue-50/40' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Layers className="h-6 w-6" /></div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Full Design & Print Suite</h4>
                    <p className="text-xs text-slate-500">We create your layouts from scratch, handle raw proofing, and manufacture items.</p>
                  </div>
                </button>
              </CardContent>
            </Card>
          </motion.div>
        )}
                {/* STEP 2: CATEGORY SELECTION */}
        {step === 2 && (
          <motion.div key="step2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
            <Card className="border border-slate-200 shadow-md bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-900">Select Product Category</CardTitle>
                <CardDescription>What kind of tangible or visual physical medium are we creating?</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                {['Business Cards', 'Banners & Signs', 'Custom Apparel', 'Flyers & Menus', 'Packaging', 'Other Custom Item'].map((cat) => (
                  <Button key={cat} variant={formData.productCategory === cat ? "default" : "outline"} className="h-16 justify-start text-left px-4 rounded-xl text-wrap text-xs sm:text-sm font-medium" onClick={() => handleSelectCategory(cat)}>
                    {cat}
                  </Button>
                ))}
              </CardContent>
              <CardFooter className="flex justify-between border-t border-slate-100 pt-4 bg-slate-50/50 rounded-b-xl">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900" onClick={prevStep}><ChevronLeft className="mr-1 h-4 w-4" /> Back</Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* STEP 3: TECHNICAL BRIEF SPECIFICATIONS */}
        {step === 3 && (
          <motion.div key="step3" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
            <Card className="border border-slate-200 shadow-md bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-900">Describe the Vision</CardTitle>
                <CardDescription>Provide descriptions to help compute item costs and design workflow parameters accurately.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.serviceType !== 'design' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Estimated Quantity</label>
                      <input type="text" placeholder="e.g. 500 units" className="w-full mt-1 p-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 outline-none focus:border-blue-500" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Finish Requirement</label>
                      <select className="w-full mt-1 p-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 outline-none focus:border-blue-500" value={formData.paperFinish} onChange={(e) => setFormData({...formData, paperFinish: e.target.value})}>
                        <option value="standard">Standard Matte</option>
                        <option value="gloss">Premium High-Gloss</option>
                        <option value="uv">Spot UV / Foil Accents</option>
                        <option value="unsupported">Not sure / Need Advice</option>
                      </select>
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Project Description & Dimensions</label>
                  <textarea rows={4} placeholder="Describe dimensions, structural color palettes, design aesthetics..." className="w-full mt-1 p-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 outline-none focus:border-blue-500 resize-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-slate-100 pt-4 bg-slate-50/50 rounded-b-xl">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900" onClick={prevStep}><ChevronLeft className="mr-1 h-4 w-4" /> Back</Button>
                <Button disabled={!formData.description.trim()} onClick={nextStep} className="bg-slate-900 text-white hover:bg-slate-800">Next Step <ChevronRight className="ml-1 h-4 w-4" /></Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* STEP 4: CLIENT CONTACT INFORMATION */}
        {step === 4 && (
          <motion.div key="step4" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
            <form onSubmit={handleSubmit}>
              <Card className="border border-slate-200 shadow-md bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-900">Contact Verification</CardTitle>
                  <CardDescription>Where should we dispatch your optimized pricing configuration outline?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Full Name</label>
                    <input type="text" required className="w-full mt-1 p-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:border-blue-500" value={formData.clientName} onChange={(e) => setFormData({...formData, clientName: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Email Address</label>
                    <input type="email" required className="w-full mt-1 p-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:border-blue-500" value={formData.clientEmail} onChange={(e) => setFormData({...formData, clientEmail: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Phone Number (Optional)</label>
                    <input type="tel" className="w-full mt-1 p-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:border-blue-500" value={formData.clientPhone} onChange={(e) => setFormData({...formData, clientPhone: e.target.value})} />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-slate-100 pt-4 bg-slate-50/50 rounded-b-xl">
                  <Button type="button" variant="ghost" className="text-slate-600 hover:text-slate-900" onClick={prevStep}><ChevronLeft className="mr-1 h-4 w-4" /> Back</Button>
                  <Button type="submit" disabled={status === "submitting" || !formData.clientName || !formData.clientEmail} className={`text-white transition-all ${status === "submitting" ? "bg-slate-400" : "bg-blue-600 hover:bg-blue-700"}`}>
                    {status === "submitting" ? "Sending..." : "Request Manual Quote"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </motion.div>
        )}

        {/* STEP 5: SUCCESS INTERACTION CARD */}
        {step === 5 && (
          <motion.div key="step5" variants={slideVariants} initial="enter" animate="center" transition={{ duration: 0.3 }}>
            <Card className="border border-emerald-200 bg-emerald-50/30 text-center py-8 shadow-sm">
              <CardContent className="space-y-3 pt-6">
                <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                  <Check className="h-6 w-6" />
                </div>
                <CardTitle className="text-emerald-900 text-xl font-bold">Brief Received Successfully!</CardTitle>
                <p className="text-sm text-emerald-700 max-w-sm mx-auto px-4 leading-relaxed">
                  Thank you, <strong>{formData.clientName}</strong>. I am reviewing your requirements for <strong>{formData.productCategory}</strong> and will email your manual calculation layout outline to <strong>{formData.clientEmail}</strong> shortly.
                </p>
                <div className="pt-4">
                  <Button variant="outline" className="border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-100/50" onClick={() => { setStep(1); setFormData({ serviceType:'', productCategory:'', quantity:'', paperFinish:'standard', description:'', clientName:'', clientEmail:'', clientPhone:'' }); setStatus(""); }}>
                    Submit Alternative Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

