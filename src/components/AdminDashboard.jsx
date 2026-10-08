// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { getLocalOrders, updateLocalOrder } from '../utils/orderStorage';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Briefcase, FileText, CheckCircle2, Clock, Mail, Phone, ListFilter } from 'lucide-react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setOrders(getLocalOrders());
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    updateLocalOrder(orderId, { status: newStatus });
    setOrders(getLocalOrders()); // Re-flush state
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === "All" || order.status === filterStatus;
    const matchesSearch = 
      order.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Order & Lead Management Workspace</h2>
          <p className="text-xs text-slate-500">Track incoming client parameters, design scopes, and prepress briefs locally.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search client or pipeline..." 
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* METRIC ANALYSIS CAROUSEL BANNER */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader className="py-3 flex flex-row items-center justify-between"><CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Requests</CardTitle><Briefcase className="h-4 w-4 text-blue-600" /></CardHeader>
          <CardContent><p className="text-2xl font-black text-slate-900">{orders.length}</p></CardContent>
        </Card>
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader className="py-3 flex flex-row items-center justify-between"><CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Review</CardTitle><Clock className="h-4 w-4 text-amber-500" /></CardHeader>
          <CardContent><p className="text-2xl font-black text-slate-900">{orders.filter(o => o.status === 'New / Unreviewed').length}</p></CardContent>
        </Card>
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader className="py-3 flex flex-row items-center justify-between"><CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">Locked / Active</CardTitle><CheckCircle2 className="h-4 w-4 text-emerald-500" /></CardHeader>
          <CardContent><p className="text-2xl font-black text-slate-900">{orders.filter(o => o.status === 'In Production' || o.status === 'Quoted').length}</p></CardContent>
        </Card>
      </div>

      {/* STATUS CONTROLLERS FILTER ROW */}
      <div className="flex flex-wrap gap-1.5 items-center bg-white p-2 border border-slate-200 rounded-xl w-fit shadow-sm">
        <ListFilter className="h-3.5 w-3.5 mx-2 text-slate-400" />
        {["All", "New / Unreviewed", "Quoted", "In Production", "Completed"].map((status) => (
          <Button 
            key={status} 
            variant={filterStatus === status ? "default" : "ghost"} 
            className="text-[11px] h-7 px-3 rounded-lg"
            onClick={() => setFilterStatus(status)}
          >
            {status}
          </Button>
        ))}
      </div>

      {/* LEAD MONITOR CARDS STACK */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-xl bg-white text-slate-400 text-xs">
            No active client briefs match your current filter parameters.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              <div className="lg:col-span-4 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {order.id}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(order.timestamp).toLocaleDateString('en-ZA')}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{order.clientName}</h3>
                <div className="space-y-1 text-xs text-slate-500 pt-1">
                  <p className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 shrink-0" /> {order.clientEmail}</p>
                  {order.clientPhone && <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 shrink-0" /> {order.clientPhone}</p>}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {order.serviceType}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    {order.productCategory}
                  </span>
                  {order.quantity && (
                    <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md font-medium">
                      Qty: {order.quantity}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic leading-relaxed">
                  "{order.description}"
                </p>
                {order.assetDownloadUrl && (
                  <a 
                    href={order.assetDownloadUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 underline hover:text-blue-800"
                  >
                    <FileText className="h-3.5 w-3.5" /> View Cloudinary Asset Brief
                  </a>
                )}
              </div>

              <div className="lg:col-span-3 lg:text-right space-y-2 lg:ml-auto w-full">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Pipeline Status</label>
                <select 
                  className="w-full lg:w-48 text-xs p-2 border border-slate-200 rounded-lg bg-white font-medium outline-none focus:border-blue-500"
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="New / Unreviewed">New / Unreviewed</option>
                  <option value="Quoted">Quoted & Sent</option>
                  <option value="In Production">In Production</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
