"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Clock, AlertTriangle, RefreshCw, Undo2, DollarSign, Users, Activity, LayoutGrid, Wrench } from "lucide-react";
import Link from "next/link";

interface MaintenanceRequest {
  id: number;
  room_number: string;
  category: string;
  thai_description: string;
  chinese_description: string;
  status: string;
  created_at: string;
  is_portal: boolean;
}

export default function AdminDashboard() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/admin/requests");
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const markDone = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/api/admin/requests/${id}/done`, {
        method: "POST",
      });
      setConfirmingId(null);
      fetchRequests();
    } catch (error) {
      console.error("Error marking as done:", error);
    }
  };

  const reopenRequest = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/api/admin/requests/${id}/reopen`, {
        method: "POST",
      });
      fetchRequests();
    } catch (error) {
      console.error("Error reopening request:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 30000); // Auto refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Maintenance Command Center</h1>
            <p className="text-slate-500 font-medium">Issue Tracking & Operations Control</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link 
              href="/admin/rooms" 
              className="flex items-center space-x-2 bg-white px-5 py-2.5 rounded-xl shadow-sm border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              <LayoutGrid className="w-4 h-4 text-blue-500" />
              <span>Go to Room Map</span>
            </Link>
            <button 
              onClick={fetchRequests}
              className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="font-bold">Refresh System</span>
            </button>
          </div>
        </header>

        {/* Operational Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Monthly Revenue", value: "฿1,733,229", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
            { label: "Occupancy Rate", value: "91.5%", icon: Users, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
            { label: "Pending Tickets", value: requests.filter(r => r.status !== 'completed').length, icon: Wrench, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
            { label: "Daily Activity", value: "High", icon: Activity, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
          ].map((m, idx) => (
            <div key={idx} className={`bg-white p-6 rounded-2xl shadow-sm border ${m.border} flex items-center space-x-4`}>
              <div className={`${m.bg} p-3 rounded-xl`}>
                <m.icon className={`w-6 h-6 ${m.color}`} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{m.label}</p>
                <p className="text-2xl font-black text-slate-900">{m.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Maintenance Intelligence Log */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
              <Wrench className="w-5 h-5 text-slate-400" />
              <span>Real-time Maintenance Intelligence Log</span>
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Room</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Details (TH/CN)</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5 whitespace-nowrap text-sm font-black text-slate-900">
                      {req.room_number}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className="px-3 py-1 text-[10px] font-black rounded-full bg-slate-100 text-slate-600 uppercase border border-slate-200">
                        {req.category}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm">
                      <div className="font-bold text-slate-800">{req.thai_description}</div>
                      <div className="text-xs text-slate-400 font-medium italic">{req.chinese_description}</div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm">
                      {req.status === 'completed' ? (
                        <span className="flex items-center text-emerald-600 font-bold">
                          <CheckCircle className="w-4 h-4 mr-1.5" /> Resolved
                        </span>
                      ) : (
                        <span className="flex items-center text-orange-500 font-bold">
                          <Clock className="w-4 h-4 mr-1.5" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm">
                      {req.status !== 'completed' ? (
                        confirmingId === req.id ? (
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => markDone(req.id)}
                              className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-black transition-all shadow-md shadow-emerald-100 hover:bg-emerald-700"
                            >
                              Confirm Fix
                            </button>
                            <button 
                              onClick={() => setConfirmingId(null)}
                              className="bg-slate-200 text-slate-600 px-4 py-1.5 rounded-lg text-xs font-black transition-all hover:bg-slate-300"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setConfirmingId(req.id)}
                            className="bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs font-black transition-all hover:bg-emerald-600 shadow-sm active:scale-95"
                          >
                            Mark Done
                          </button>
                        )
                      ) : (
                        <button 
                          onClick={() => reopenRequest(req.id)}
                          className="flex items-center space-x-2 text-slate-300 hover:text-blue-600 transition-all font-bold text-xs group"
                        >
                          <Undo2 className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                          <span>Re-open Issue</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400">
                      <div className="flex flex-col items-center">
                        <AlertTriangle className="w-12 h-12 mb-4 opacity-10" />
                        <p className="text-lg font-bold">No Maintenance Tickets</p>
                        <p className="text-sm font-medium">All systems operational.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
