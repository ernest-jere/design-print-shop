// src/components/TestimonialSlider.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { testimonialData } from './testimonialData';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Card, CardContent } from "./ui/card";

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? 100 : -100, opacity: 0 })
  };

  const handleNext = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1 === testimonialData.length ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? testimonialData.length - 1 : prev - 1));
  };

  const item = testimonialData[current];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 space-y-6 text-left relative">
      <div className="overflow-hidden relative min-h-[220px] flex items-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={item.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="w-full font-sans"
          >
            <Card className="border border-slate-200 shadow-sm bg-white rounded-2xl relative overflow-hidden">
              {/* Decorative Quote Icon Background */}
              <Quote className="absolute right-6 top-6 h-24 w-24 text-slate-50 stroke-[0.5] pointer-events-none select-none" />
              
              <CardContent className="p-6 sm:p-8 space-y-4 relative z-10">
                {/* Star Ratings Row */}
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500" />
                  ))}
                </div>

                {/* Testimonial Quote String Text */}
                <p className="text-slate-700 text-sm sm:text-base font-medium italic leading-relaxed pr-6">
                  "{item.text}"
                </p>

                {/* Client Profile Details Section */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{item.company}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md w-fit">
                    {item.service}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* COMPONENT CAROUSEL CONTROLLER CONTROLS ROW */}
      <div className="flex items-center justify-between px-2 pt-2">
        {/* Pagination Dot Navigation Indicators */}
        <div className="flex gap-1.5">
          {testimonialData.map((_, index) => (
            <button
              key={index}
              onClick={() => { setDirection(index > current ? 1 : -1); setCurrent(index); }}
              className={`h-2 rounded-full transition-all cursor-pointer ${current === index ? "w-6 bg-blue-600" : "w-2 bg-slate-200 hover:bg-slate-300"}`}
            />
          ))}
        </div>

        {/* Arrow Buttons Navigation Pair */}
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            className="p-2 border border-slate-200 rounded-xl hover:bg-white bg-slate-50 text-slate-600 hover:text-slate-900 shadow-sm transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 border border-slate-200 rounded-xl hover:bg-white bg-slate-50 text-slate-600 hover:text-slate-900 shadow-sm transition-colors cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
