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
  const [language, setLanguage] = useState<"en" | "th">("en");

  const content = {
    en: {
      title: "Maintenance Command Center",
      subtitle: "Issue Tracking & Operations Control",
      btnRoomMap: "Go to Room Map",
      btnRefresh: "Refresh System",
      metricActive: "Active Repair Requests",
      metricTotal: "Total History Records",
      tableTitle: "Full Maintenance Ticket History",
      colRoom: "Room",
      colType: "Type",
      colDetails: "Details (TH/CN)",
      colStatus: "Status",
      colAction: "Action",
      statusResolved: "Resolved",
      statusPending: "Pending",
      statusInProgress: "Handyman Done",
      btnConfirm: "Confirm Fix",
      btnCancel: "Cancel",
      btnMarkDone: "Mark Done",
      btnReopen: "Re-open Issue",
      emptyTitle: "No Maintenance Tickets",
      emptyDesc: "All systems operational.",
      categories: {
        "Aircon": "Aircon",
        "Electrical": "Electrical",
        "Plumbing": "Plumbing",
        "Furniture": "Furniture",
        "Other": "Other",
        "空调": "Aircon",
        "电力": "Electrical",
        "水管/厕所": "Plumbing",
        "家具": "Furniture",
        "其他": "Other",
        "แอร์": "Aircon",
        "ไฟฟ้า": "Electrical",
        "ประปา/ห้องน้ำ": "Plumbing",
        "เฟอร์นิเจอร์": "Furniture",
        "อื่นๆ": "Other"
      }
    },
    th: {
      title: "ศูนย์ควบคุมการแจ้งซ่อม",
      subtitle: "การติดตามปัญหาและควบคุมการดำเนินงาน",
      btnRoomMap: "ไปยังแผนผังห้อง",
      btnRefresh: "รีเฟรชระบบ",
      metricActive: "รายการที่กำลังดำเนินการ",
      metricTotal: "ประวัติการซ่อมทั้งหมด",
      tableTitle: "ประวัติการแจ้งซ่อมทั้งหมด",
      colRoom: "เลขห้อง",
      colType: "ประเภท",
      colDetails: "รายละเอียด (ไทย/จีน)",
      colStatus: "สถานะ",
      colAction: "ดำเนินการ",
      statusResolved: "เสร็จสิ้น",
      statusPending: "รอการแก้ไข",
      statusInProgress: "ช่างแก้ไขแล้ว",
      btnConfirm: "ยืนยันการซ่อม",
      btnCancel: "ยกเลิก",
      btnMarkDone: "เสร็จสิ้น",
      btnReopen: "เปิดงานใหม่",
      emptyTitle: "ไม่มีรายการแจ้งซ่อม",
      emptyDesc: "ระบบทำงานปกติทุกส่วน",
      categories: {
        "Aircon": "แอร์",
        "Electrical": "ไฟฟ้า",
        "Plumbing": "ประปา/ห้องน้ำ",
        "Furniture": "เฟอร์นิเจอร์",
        "Other": "อื่นๆ",
        "空调": "แอร์",
        "电力": "ไฟฟ้า",
        "水管/厕所": "ประปา/ห้องน้ำ",
        "家具": "เฟอร์นิเจอร์",
        "其他": "อื่นๆ",
        "แอร์": "แอร์",
        "ไฟฟ้า": "ไฟฟ้า",
        "ประปา/ห้องน้ำ": "ประปา/ห้องน้ำ",
        "เฟอร์นิเจอร์": "เฟอร์นิเจอร์",
        "อื่นๆ": "อื่นๆ"
      }
    }
  };

  const t = content[language];

  const translateCategory = (cat: string) => {
    return (t.categories as any)[cat] || cat;
  };

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
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{t.title}</h1>
            <p className="text-slate-500 font-medium">{t.subtitle}</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Language Toggle */}
            <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm mr-2">
              <button 
                onClick={() => setLanguage("en")}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${language === 'en' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage("th")}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${language === 'th' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}
              >
                TH
              </button>
            </div>

            <Link 
              href="/admin/rooms" 
              className="flex items-center space-x-2 bg-white px-5 py-2.5 rounded-xl shadow-sm border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              <LayoutGrid className="w-4 h-4 text-blue-500" />
              <span>{t.btnRoomMap}</span>
            </Link>
            <button 
              onClick={fetchRequests}
              className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="font-bold">{t.btnRefresh}</span>
            </button>
          </div>
        </header>

        {/* Operational Metrics (Maintenance Only) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex items-center space-x-4 transition-all hover:shadow-md">
            <div className="bg-orange-50 p-3 rounded-xl">
              <Wrench className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.metricActive}</p>
              <p className="text-2xl font-black text-slate-900">{requests.filter(r => r.status !== 'completed').length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex items-center space-x-4 transition-all hover:shadow-md">
            <div className="bg-emerald-50 p-3 rounded-xl">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.metricTotal}</p>
              <p className="text-2xl font-black text-slate-900">{requests.length}</p>
            </div>
          </div>
        </div>

        {/* Maintenance History Log */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
              <Wrench className="w-5 h-5 text-slate-400" />
              <span>{t.tableTitle}</span>
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.colRoom}</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.colType}</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.colDetails}</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.colStatus}</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.colAction}</th>
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
                        {translateCategory(req.category)}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm">
                      <div className="font-bold text-slate-800">{req.thai_description}</div>
                      <div className="text-xs text-slate-400 font-medium italic">{req.chinese_description}</div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm">
                      {req.status === 'completed' ? (
                        <span className="flex items-center text-emerald-600 font-bold">
                          <CheckCircle className="w-4 h-4 mr-1.5" /> {t.statusResolved}
                        </span>
                      ) : req.status === 'in_progress' ? (
                        <span className="flex items-center text-blue-500 font-bold animate-pulse">
                          <Activity className="w-4 h-4 mr-1.5" /> {t.statusInProgress}
                        </span>
                      ) : (
                        <span className="flex items-center text-orange-500 font-bold">
                          <Clock className="w-4 h-4 mr-1.5" /> {t.statusPending}
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
                              {t.btnConfirm}
                            </button>
                            <button 
                              onClick={() => setConfirmingId(null)}
                              className="bg-slate-200 text-slate-600 px-4 py-1.5 rounded-lg text-xs font-black transition-all hover:bg-slate-300"
                            >
                              {t.btnCancel}
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setConfirmingId(req.id)}
                            className={`px-5 py-2 rounded-xl text-xs font-black transition-all shadow-sm active:scale-95 ${
                              req.status === 'in_progress' ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                          >
                            {t.btnMarkDone}
                          </button>
                        )
                      ) : (
                        <button 
                          onClick={() => reopenRequest(req.id)}
                          className="flex items-center space-x-2 text-slate-300 hover:text-blue-600 transition-all font-bold text-xs group"
                        >
                          <Undo2 className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                          <span>{t.btnReopen}</span>
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
                        <p className="text-lg font-bold">{t.emptyTitle}</p>
                        <p className="text-sm font-medium">{t.emptyDesc}</p>
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
