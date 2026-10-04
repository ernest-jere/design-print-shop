// src/components/PortfolioGrid.jsx
import React, { useState } from 'react';
import { portfolioItems } from '../data/portfolioItems';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PortfolioGrid() {
  const [filter, setFilter] = useState("All");
  
  const categories = ["All", "Graphic Design Only", "Print Only Production", "Web Design & Development", "Prepress Consultancy"];

  const filteredItems = filter === "All" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === filter);

  return (
    <div className="w-full space-y-8">
      {/* FILTER BUTTON ROW */}
      <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
        {categories.map((cat) => (
          <Button 
            key={cat} 
            variant={filter === cat ? "default" : "outline"}
            className="text-xs rounded-xl"
            onClick={() => setFilter(cat)}
          >
            {cat === "All" ? "View All Works" : cat.replace(" Only", "").replace(" Production", "")}
          </Button>
        ))}
      </div>

      {/* PORTFOLIO MAPPING GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="border border-slate-200 bg-white hover:shadow-md transition-all flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {item.category}
                </span>
              </div>
              <CardTitle className="text-lg font-bold text-slate-900">{item.title}</CardTitle>
              <CardDescription className="text-xs text-slate-600 leading-relaxed pt-1">
                {item.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-4 flex flex-wrap gap-1.5">
              {item.tags.map(tag => (
                <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                  #{tag}
                </span>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
