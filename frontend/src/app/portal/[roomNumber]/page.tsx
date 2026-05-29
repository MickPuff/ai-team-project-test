"use client";

import { useState, use, useEffect } from "react";
import { Camera, Send, CheckCircle2, AlertCircle, Wrench, ChevronRight, User, ShieldCheck, History } from "lucide-react";

interface MaintenanceRequest {
  id: number;
  category: string;
  thai_description: string;
  status: string;
  created_at: string;
}

export default function TenantPortal({ params }: { params: Promise<{ roomNumber: string }> }) {
  const { roomNumber } = use(params);
  const [language, setLanguage] = useState<"zh" | "en" | "th">("zh");
  const [role, setRole] = useState<"tenant" | "staff">("tenant");
  
  // Maintenance State (Tenant)
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  
  // Staff State
  const [activeTickets, setActiveTickets] = useState<MaintenanceRequest[]>([]);
  const [repairPhoto, setRepairPhoto] = useState<File | null>(null);
  
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const content = {
    zh: {
      title: "博通公寓 - 维修服务",
      room: "房间号",
      tenantTitle: "报告维修",
      staffTitle: "维修人员入口",
      categoryLabel: "问题类型",
      categories: ["空调", "电力", "水管/厕所", "家具", "其他"],
      descLabel: "描述问题",
      descPlaceholder: "请详细描述您遇到的问题...",
      photoLabel: "拍摄/上传照片",
      submit: "提交报告",
      staffAction: "标记为已修复",
      staffUpload: "上传修复后的照片",
      successTitle: "提交成功",
      successDesc: "管理处已收到您的请求。",
      errorTitle: "提交失败",
      errorDesc: "抱歉，提交时出现错误。",
      catMap: {
        "Aircon": "空调", "Electrical": "电力", "Plumbing": "水管/厕所", "Furniture": "家具", "Other": "其他",
        "空调": "空调", "电力": "电力", "水管/厕所": "水管/厕所", "家具": "家具", "其他": "其他",
        "แอร์": "空调", "ไฟฟ้า": "电力", "ประปา/ห้องน้ำ": "水管/厕所", "เฟอร์นิเจอร์": "家具", "อื่นๆ": "其他"
      }
    },
    en: {
      title: "Bo Thong - Maintenance",
      room: "Room Number",
      tenantTitle: "Report Repair",
      staffTitle: "Handyman Access",
      categoryLabel: "Problem Category",
      categories: ["Aircon", "Electrical", "Plumbing", "Furniture", "Other"],
      descLabel: "Description",
      descPlaceholder: "Describe your problem in detail...",
      photoLabel: "Take/Upload Photo",
      submit: "Submit Report",
      staffAction: "Mark as Fixed",
      staffUpload: "Upload Completion Photo",
      successTitle: "Submitted Successfully",
      successDesc: "Management has received your request.",
      errorTitle: "Submission Failed",
      errorDesc: "Sorry, an error occurred.",
      catMap: {
        "Aircon": "Aircon", "Electrical": "Electrical", "Plumbing": "Plumbing", "Furniture": "Furniture", "Other": "Other",
        "空调": "Aircon", "电力": "Electrical", "水管/厕所": "Plumbing", "家具": "Furniture", "其他": "Other",
        "แอร์": "Aircon", "ไฟฟ้า": "Electrical", "ประปา/ห้องน้ำ": "Plumbing", "เฟอร์นิเจอร์": "Furniture", "อื่นๆ": "Other"
      }
    },
    th: {
      title: "บ่อทอง - แจ้งซ่อม",
      room: "เลขห้อง",
      tenantTitle: "แจ้งซ่อม",
      staffTitle: "สำหรับช่าง/เจ้าหน้าที่",
      categoryLabel: "ประเภทปัญหา",
      categories: ["แอร์", "ไฟฟ้า", "ประปา/ห้องน้ำ", "เฟอร์นิเจอร์", "อื่นๆ"],
      descLabel: "รายละเอียด",
      descPlaceholder: "กรุณาระบุรายละเอียดปัญหา...",
      photoLabel: "ถ่ายภาพ/แนบรูป",
      submit: "ส่งข้อมูล",
      staffAction: "ยืนยันการซ่อมเสร็จ",
      staffUpload: "ถ่ายภาพยืนยันการซ่อม",
      successTitle: "ส่งข้อมูลสำเร็จ",
      successDesc: "ฝ่ายบริหารจัดการได้รับข้อมูลของคุณแล้ว",
      errorTitle: "เกิดข้อผิดพลาด",
      errorDesc: "ขออภัย เกิดข้อผิดพลาด",
      catMap: {
        "Aircon": "แอร์", "Electrical": "ไฟฟ้า", "Plumbing": "ประปา/ห้องน้ำ", "Furniture": "เฟอร์นิเจอร์", "Other": "อื่นๆ",
        "空调": "แอร์", "电力": "ไฟฟ้า", "水管/厕所": "ประปา/ห้องน้ำ", "家具": "เฟอร์นิเจอร์", "其他": "อื่นๆ",
        "แอร์": "แอร์", "ไฟฟ้า": "ไฟฟ้า", "ประปา/ห้องน้ำ": "ประปา/ห้องน้ำ", "เฟอร์นิเจอร์": "เฟอร์นิเจอร์", "อื่นๆ": "อื่นๆ"
      }
    }
  };

  const t = content[language];

  const translateCategory = (cat: string) => {
    return (t.catMap as any)[cat] || cat;
  };

  const fetchRoomTickets = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/portal/rooms/${roomNumber}/tickets`);
      const data = await response.json();
      setActiveTickets(data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    }
  };

  useEffect(() => {
    if (role === "staff") fetchRoomTickets();
  }, [role, roomNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    
    try {
      const formData = new FormData();
      
      if (role === "tenant") {
        formData.append("room_number", roomNumber);
        formData.append("category", category);
        formData.append("description", description);
        if (photo) formData.append("photo", photo);
        
        const response = await fetch("http://localhost:8000/api/portal/report", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) throw new Error("Failed to submit report");
      } else {
        // Handyman resolution - assuming we resolve the first active ticket for the demo
        if (activeTickets.length === 0) return;
        if (repairPhoto) formData.append("photo", repairPhoto);
        
        const response = await fetch(`http://localhost:8000/api/portal/resolve/${activeTickets[0].id}`, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) throw new Error("Failed to resolve ticket");
      }

      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-white p-6 flex flex-col items-center justify-center text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.successTitle}</h1>
        <p className="text-gray-600">{t.successDesc}</p>
        <button onClick={() => setStatus("idle")} className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold">OK</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32 font-sans">
      {/* Role Switcher (Hidden in production, used for demo) */}
      <div className="bg-slate-900 text-[10px] p-2 flex justify-center space-x-4 sticky top-0 z-30">
        <button onClick={() => setRole("tenant")} className={`uppercase font-black tracking-widest ${role === 'tenant' ? 'text-blue-400' : 'text-slate-500'}`}>[ Tenant Mode ]</button>
        <button onClick={() => setRole("staff")} className={`uppercase font-black tracking-widest ${role === 'staff' ? 'text-orange-400' : 'text-slate-500'}`}>[ Staff/Handyman ]</button>
      </div>

      {/* Header */}
      <div className={`${role === 'staff' ? 'bg-orange-600' : 'bg-blue-700'} text-white p-6 pt-10 shadow-lg transition-colors`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-black italic">{t.title}</h1>
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mt-1">
              {role === 'staff' ? t.staffTitle : t.tenantTitle}
            </p>
          </div>
          <div className="flex bg-black/20 rounded-xl p-1 backdrop-blur-md border border-white/10">
            {["zh", "en", "th"].map((lang) => (
              <button 
                key={lang}
                onClick={() => setLanguage(lang as any)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${language === lang ? 'bg-white text-slate-900 shadow-md' : 'text-white/60'}`}
              >
                {lang === 'zh' ? '中' : lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between bg-black/10 p-4 rounded-2xl border border-white/10">
          <div className="flex items-center space-x-3">
             <div className="bg-white/20 p-2 rounded-lg"><Wrench className="w-5 h-5" /></div>
             <div>
                <span className="text-white/60 text-[10px] font-bold block uppercase tracking-tighter">{t.room}</span>
                <span className="text-2xl font-black tracking-tighter">{roomNumber}</span>
             </div>
          </div>
          {role === 'staff' && <ShieldCheck className="w-8 h-8 text-orange-200 opacity-50" />}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {role === "tenant" ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <section>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">{t.categoryLabel}</label>
              <div className="grid grid-cols-3 gap-2">
                {t.categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-4 px-2 text-[10px] rounded-2xl border-2 transition-all font-black uppercase ${
                      category === cat 
                        ? "bg-blue-50 border-blue-600 text-blue-700 shadow-md" 
                        : "bg-white border-slate-100 text-slate-500 shadow-sm"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{t.descLabel}</label>
              <textarea
                required
                className="w-full h-32 p-4 rounded-3xl border-2 border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-slate-700 text-sm font-medium shadow-inner"
                placeholder={t.descPlaceholder}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </section>

            <section>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{t.photoLabel}</label>
              <div className="relative h-48 w-full border-4 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center bg-white overflow-hidden shadow-sm transition-all hover:border-blue-400 group">
                {photo ? (
                  <div className="relative w-full h-full">
                    <img src={URL.createObjectURL(photo)} className="w-full h-full object-cover" alt="Preview" />
                    <button onClick={() => setPhoto(null)} className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full backdrop-blur-md">✕</button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center p-10 text-center">
                    <div className="bg-slate-50 p-4 rounded-full mb-3 group-hover:bg-blue-50 transition-colors">
                      <Camera className="w-10 h-10 text-slate-300 group-hover:text-blue-400" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tap to Snap Photo</span>
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
                  </label>
                )}
              </div>
            </section>

            <button
              type="submit"
              disabled={status === "submitting" || !category || !description}
              className="fixed bottom-8 left-4 right-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-blue-400/50 transition-all flex items-center justify-center space-x-3 active:scale-95 z-20 uppercase tracking-widest text-sm"
            >
              {status === "submitting" ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <><Send className="w-5 h-5" /><span>{t.submit}</span></>}
            </button>
          </form>
        ) : (
          /* Handyman Mode UI */
          <div className="space-y-6">
             <section className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                   <div className="bg-orange-100 p-2 rounded-lg"><History className="w-5 h-5 text-orange-600" /></div>
                   <h3 className="font-black text-slate-900 tracking-tight uppercase text-sm">Active Tickets for {roomNumber}</h3>
                </div>
                
                {activeTickets.length > 0 ? activeTickets.map(ticket => (
                  <div key={ticket.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
                     <div className="flex justify-between items-start mb-2">
                        <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-[10px] font-black uppercase">{translateCategory(ticket.category)}</span>
                        <span className="text-[10px] font-bold text-slate-400">{ticket.created_at}</span>
                     </div>
                     <p className="text-sm font-black text-slate-700">{ticket.thai_description}</p>
                  </div>
                )) : (
                   <p className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-widest italic">No pending tasks for this room</p>
                )}
             </section>

             <section className="space-y-4">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{t.staffUpload}</label>
                <div className="relative h-64 w-full border-4 border-dashed border-orange-200 rounded-[2rem] flex flex-col items-center justify-center bg-white overflow-hidden shadow-sm hover:border-orange-500 transition-all">
                  {repairPhoto ? (
                    <div className="relative w-full h-full">
                      <img src={URL.createObjectURL(repairPhoto)} className="w-full h-full object-cover" alt="Fixed" />
                      <button onClick={() => setRepairPhoto(null)} className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full">✕</button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center">
                      <div className="bg-orange-50 p-4 rounded-full mb-3">
                        <Camera className="w-10 h-10 text-orange-400" />
                      </div>
                      <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Take "Fix Complete" Photo</span>
                      <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => setRepairPhoto(e.target.files?.[0] || null)} />
                    </label>
                  )}
                </div>
             </section>

             <button
              onClick={handleSubmit}
              disabled={status === "submitting" || !repairPhoto}
              className="fixed bottom-8 left-4 right-4 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-orange-400/50 transition-all flex items-center justify-center space-x-3 active:scale-95 z-20 uppercase tracking-widest text-sm"
            >
              {status === "submitting" ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <><ShieldCheck className="w-5 h-5" /><span>{t.staffAction}</span></>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
