import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Search, Briefcase, FileText, CheckCircle2, Clock, Mail, Phone, ListFilter, Download, Trash2, Edit3, Send, XCircle } from 'lucide-react';
import { calculateEstimate } from './pricingMatrix';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // 🌟 NATIVE SELF-CONTAINED DATA RETRIEVAL HOOK
  useEffect(() => {
    try {
      const stored = localStorage.getItem('design_print_orders');
      setOrders(stored ? JSON.parse(stored) : []);
    } catch (e) {
      setOrders([]);
    }
  }, []);

  // 🌟 INTERACTIVE CORE FIELD MANIPULATION ENGINE (For Real-time Price & Description Edits)
  const handleLocalFieldChange = (orderId, field, value) => {
    const updated = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, [field]: value };
      }
      return order;
    });
    setOrders(updated);
    localStorage.setItem('design_print_orders', JSON.stringify(updated));
  };
    // 🌟 INITIALIZE REVIEW: Loads calculated baseline estimates into fully editable text input fields
  const handleInitiateReview = (orderId) => {
    const updated = orders.map(order => {
      if (order.id === orderId) {
        const est = calculateEstimate(
          order.serviceType, order.productCategory, order.quantity, 
          order.paperFinish, order.isoSize, order.pagesCount, order.printColor
        );
        return {
          ...order,
          status: "Under Review",
          overridePriceLow: order.overridePriceLow ?? est.low,
          overridePriceHigh: order.overridePriceHigh ?? est.high,
          routedWorkflow: est.routedWorkflow ?? "Standard Evaluation Process"
        };
      }
      return order;
    });
    setOrders(updated);
    localStorage.setItem('design_print_orders', JSON.stringify(updated));
  };

  // 🌟 UPGRADED STATUS RE-MUTATION ENGINE WITH AUTOMATED WEBHOOK GATE
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const stored = localStorage.getItem('design_print_orders');
      const currentOrders = stored ? JSON.parse(stored) : [];
      const targetedOrder = currentOrders.find(order => order.id === orderId);
      
      const updatedOrders = currentOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      localStorage.setItem('design_print_orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);

      if (newStatus === "Quoted" && targetedOrder) {
        const baselineEst = calculateEstimate(
          targetedOrder.serviceType, targetedOrder.productCategory, targetedOrder.quantity, 
          targetedOrder.paperFinish, targetedOrder.isoSize, targetedOrder.pagesCount, targetedOrder.printColor
        );

        const finalLow = targetedOrder.overridePriceLow ?? baselineEst.low;
        const finalHigh = targetedOrder.overridePriceHigh ?? baselineEst.high;
        const finalWorkflow = targetedOrder.routedWorkflow ?? baselineEst.routedWorkflow;
        const finalDescription = targetedOrder.description || "";

        await fetch("https://hook.eu1.make.com/3b36jxpauh4wuqy3yaiqnl1ukezphytl", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_type: "quote_approved",
            order_id: targetedOrder.id,
            timestamp: new Date().toISOString(),
            client_name: targetedOrder.clientName || targetedOrder.client_name || "Client Name Missing",
            
            // 🌟 CRITICAL FIX: Direct fallback support for both snake_case and camelCase parameters
            client_email: targetedOrder.clientEmail || targetedOrder.client_email || "", 
            
            client_phone: targetedOrder.clientPhone || targetedOrder.client_phone || "N/A",
            service_pillar: targetedOrder.serviceType,
            specialization_category: targetedOrder.productCategory,
            quantity: String(targetedOrder.quantity || "1"),
            pages: String(targetedOrder.pagesCount || "1"),
            paper_size: targetedOrder.isoSize || "A4",
            ink_profile: targetedOrder.printColor || "cmyk",
            material_finish: targetedOrder.paperFinish || "standard",
            brief_description: finalDescription, 
            asset_url: targetedOrder.assetDownloadUrl || "No File Attached",
            final_price_low: Number(finalLow),   
            final_price_high: Number(finalHigh), 
            selected_workflow: finalWorkflow
          })
        });

        alert(`🌟 Quote generated! PDF document template built and emailed to ${targetedOrder.clientEmail} successfully via Impressions automated cloud servers.`);
      }
    } catch (e) {
      console.error("Critical webhook bridge failure:", e);
      alert("❌ Critical System Error: Failed to dispatch data payload.");
    }
  };
    const safeOrders = Array.isArray(orders) ? orders : [];

  const filteredOrders = safeOrders.filter(order => {
    if (!order) return false;
    const matchesStatus = filterStatus === "All" || order.status === filterStatus;
    const matchesSearch = 
      (order.clientName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.productCategory || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.clientEmail || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const exportToCSV = () => {
    if (safeOrders.length === 0) {
      alert("No order logs available to export.");
      return;
    }
    const headers = [
      "Order ID", "Date Created", "Client Name", "Email Address", "Phone Number",
      "Service Pillar", "Category Deliverable", "Estimated Quantity", "Material Finish",
      "Project Requirements Brief", "Cloudinary Asset Download URL", "Pipeline Status"
    ];
    const csvRows = safeOrders.map(order => {
      const cleanDesc = (order.description || "").replace(/"/g, '""');
      return [
        `"${order.id || ''}"`,
        `"${order.timestamp ? new Date(order.timestamp).toLocaleDateString('en-ZA') : ''}"`,
        `"${(order.clientName || '').replace(/"/g, '""')}"`,
        `"${order.clientEmail || ''}"`,
        `"${order.clientPhone || ''}"`,
        `"${order.serviceType || ''}"`,
        `"${order.productCategory || ''}"`,
        `"${order.quantity || ''}"`,
        `"${order.paperFinish || ''}"`,
        `"${cleanDesc}"`,
        `"${order.assetDownloadUrl || ''}"`,
        `"${order.status || 'New / Unreviewed'}"`
      ].join(",");
    });
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...csvRows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", encodedUri);
    downloadLink.setAttribute("download", `DesignPrint_Orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
    return (    
    <div className="w-full space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Order & Lead Management Workspace</h2>
          <p className="text-xs text-slate-500">Track incoming client parameters, design scopes, and prepress briefs locally.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button onClick={exportToCSV} variant="outline" className="text-xs font-semibold rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 h-9 flex items-center gap-1.5 shadow-sm shrink-0 cursor-pointer">
            <Download className="h-4 w-4 text-blue-600" /> Export to Excel (.CSV)
          </Button>  
          <Button onClick={() => {
            if (window.confirm("⚠️ WARNING: This will permanently delete ALL client briefs and order logs. Proceed?")) {
              localStorage.removeItem('design_print_orders');
              setOrders([]);
              alert("Workspace ledger cleared successfully!");
            }
          }} variant="outline" className="text-xs font-semibold rounded-xl border-red-200 bg-white hover:bg-red-50 text-red-600 h-9 flex items-center gap-1.5 shadow-sm shrink-0 cursor-pointer">
            <Trash2 className="h-4 w-4" /> Clear Ledger
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Search by client name, email or deliverable category..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400" />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <ListFilter className="h-4 w-4 text-slate-400 hidden sm:block shrink-0" />
          {["All", "Pending", "Under Review", "Quoted"].map((status) => (
            <button key={status} onClick={() => setFilterStatus(status)} className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all shrink-0 cursor-pointer ${filterStatus === status ? "bg-slate-900 border-slate-900 text-white shadow-sm" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"}`}>{status}</button>
          ))}
        </div>
      </div>
            <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-100 shadow-inner">
            <Clock className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600">No active work orders match your sorting parameters.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="bg-white border-slate-200 shadow-sm overflow-hidden transition-all hover:border-slate-300">
              <div className="border-b border-slate-100 bg-slate-50/50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-slate-400 bg-white border px-1.5 py-0.5 rounded shadow-sm">{order.id ? order.id.substring(0, 8).toUpperCase() : "LEAD"}</span>
                    <h3 className="font-bold text-slate-900 text-base">{order.clientName}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-slate-400" />{order.clientEmail}</span>
                    {order.clientPhone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-slate-400" />{order.clientPhone}</span>}
                  </div>
                </div>
                <span className={`text-2xs font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border shadow-sm ${order.status === "Quoted" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : order.status === "Under Review" ? "bg-amber-50 border-amber-200 text-amber-700 animate-pulse" : "bg-blue-50 border-blue-200 text-blue-700"}`}>{order.status || "Pending"}</span>
              </div>

              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50/40 border border-slate-100 p-3 rounded-xl text-xs text-slate-700 shadow-2xs">
                  <div><p className="text-slate-400 font-medium">Service Pillar</p><p className="font-bold text-slate-800 capitalize flex items-center gap-1"><Briefcase className="h-3 w-3 text-blue-500" />{order.serviceType}</p></div>
                  <div><p className="text-slate-400 font-medium">Deliverable Class</p><p className="font-bold text-slate-800 truncate">{order.productCategory}</p></div>
                  <div><p className="text-slate-400 font-medium">Quantity Volume</p><p className="font-bold text-slate-800">{order.quantity} units</p></div>
                  <div><p className="text-slate-400 font-medium">Specifications Setup</p><p className="font-bold text-slate-800 uppercase tracking-tight">{order.isoSize || "A4"} • {order.printColor || "CMYK"} • {order.paperFinish || "Standard"}</p></div>
                </div>

                {order.status === "Under Review" ? (
                  <div className="bg-amber-50/40 border border-amber-200 rounded-xl p-4 space-y-4 shadow-3xs">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Project Requirements Brief Description (Editable)</label>
                      <textarea value={order.description || ""} onChange={(e) => handleLocalFieldChange(order.id, 'description', e.target.value)} className="w-full text-sm p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 min-h-[90px] shadow-2xs text-slate-800" placeholder="Refine and articulate final delivery conditions..." />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Target Lower Bounds Price Estimate (ZAR R)</label>
                        <div className="relative"><span className="absolute left-3 top-2 text-sm font-semibold text-slate-400">R</span><input type="number" value={order.overridePriceLow ?? ""} onChange={(e) => handleLocalFieldChange(order.id, 'overridePriceLow', parseInt(e.target.value, 10) || 0)} className="w-full pl-7 pr-3 py-1.5 text-sm bg-white border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-2xs font-bold text-slate-800" /></div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Target Upper Bounds Price Estimate (ZAR R)</label>
                        <div className="relative"><span className="absolute left-3 top-2 text-sm font-semibold text-slate-400">R</span><input type="number" value={order.overridePriceHigh ?? ""} onChange={(e) => handleLocalFieldChange(order.id, 'overridePriceHigh', parseInt(e.target.value, 10) || 0)} className="w-full pl-7 pr-3 py-1.5 text-sm bg-white border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-2xs font-bold text-slate-800" /></div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 border-t border-amber-100 text-2xs text-slate-500">
                      <p className="italic">Estimated Process Flow: <span className="font-bold text-amber-800">{order.routedWorkflow}</span></p>
                      <div className="flex gap-2 w-full sm:w-auto justify-end">
                        <Button onClick={() => handleStatusChange(order.id, "Pending")} variant="outline" className="text-xs rounded-xl h-8 border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-medium px-3 flex items-center gap-1 shadow-3xs cursor-pointer"><XCircle className="h-3.5 w-3.5 text-slate-400" /> Cancel Review</Button>
                        <Button onClick={() => handleStatusChange(order.id, "Quoted")} className="text-xs font-bold rounded-xl h-8 bg-emerald-600 hover:bg-emerald-700 text-white px-4 flex items-center gap-1 shadow-sm cursor-pointer"><Send className="h-3.5 w-3.5" /> Approve & Send Quote</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-2xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><FileText className="h-3 w-3 text-slate-400" />Project Ingest Brief Description</p>
                      <p className="text-sm text-slate-700 bg-slate-50/30 border border-slate-100 p-3 rounded-xl italic">"{order.description || "No specific design specifications provided."}"</p>
                    </div>
                    {order.assetDownloadUrl && order.assetDownloadUrl !== "No File Attached" && (
                      <div className="flex items-center gap-2 pt-1">
                        <a href={order.assetDownloadUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200/60 px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-3xs transition-all w-fit cursor-pointer"><Download className="h-3.5 w-3.5" /> Review Uploaded Customer Artwork</a>
                      </div>
                    )}
                    {order.status !== "Quoted" && (
                      <div className="flex justify-end pt-2 border-t border-slate-100">
                        <Button onClick={() => handleInitiateReview(order.id)} className="text-xs font-bold rounded-xl h-8.5 bg-blue-600 hover:bg-blue-700 text-white px-4 flex items-center gap-1 shadow-sm transition-all cursor-pointer"><Edit3 className="h-3.5 w-3.5" /> Review Details & Prices</Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}




