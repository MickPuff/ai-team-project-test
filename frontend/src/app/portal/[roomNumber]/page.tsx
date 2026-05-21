"use client";

import { useState, use } from "react";
import { Camera, Send, CheckCircle2, AlertCircle, Wrench, CreditCard, FileText, ChevronRight } from "lucide-react";

export default function TenantPortal({ params }: { params: Promise<{ roomNumber: string }> }) {
  const { roomNumber } = use(params);
  const [language, setLanguage] = useState<"zh" | "en" | "th">("zh");
  const [activeTab, setActiveTab] = useState<"maintenance" | "payment">("maintenance");
  
  // Maintenance State
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  
  // Payment State
  const [slip, setSlip] = useState<File | null>(null);
  const [amount, setAmount] = useState("");
  
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const content = {
    zh: {
      title: "博通公寓 - 租户服务",
      room: "房间号",
      tabMaintenance: "报修",
      tabPayment: "缴费/合同",
      categoryLabel: "问题类型",
      categories: ["空调", "电力", "水管/厕所", "家具", "其他"],
      descLabel: "描述问题",
      descPlaceholder: "请详细描述您遇到的问题...",
      photoLabel: "拍摄/上传照片",
      submit: "提交报告",
      paymentLabel: "上传付款凭证",
      amountLabel: "金额 (THB)",
      contractLabel: "租赁合同",
      signContract: "签署合同",
      successTitle: "提交成功",
      successDesc: "管理处已收到您的请求。",
      errorTitle: "提交失败",
      errorDesc: "抱歉，提交时出现错误。请重试或联系管理处。",
    },
    en: {
      title: "Bo Thong - Tenant Service",
      room: "Room Number",
      tabMaintenance: "Repair",
      tabPayment: "Payment/Contract",
      categoryLabel: "Problem Category",
      categories: ["Aircon", "Electrical", "Plumbing", "Furniture", "Other"],
      descLabel: "Description",
      descPlaceholder: "Describe your problem in detail...",
      photoLabel: "Take/Upload Photo",
      submit: "Submit Report",
      paymentLabel: "Upload Payment Slip",
      amountLabel: "Amount (THB)",
      contractLabel: "Lease Contract",
      signContract: "Sign Contract",
      successTitle: "Submitted Successfully",
      successDesc: "Management has received your request.",
      errorTitle: "Submission Failed",
      errorDesc: "Sorry, an error occurred. Please try again or contact management.",
    },
    th: {
      title: "บ่อทอง - บริการผู้เช่า",
      room: "เลขห้อง",
      tabMaintenance: "แจ้งซ่อม",
      tabPayment: "ชำระเงิน/สัญญา",
      categoryLabel: "ประเภทปัญหา",
      categories: ["แอร์", "ไฟฟ้า", "ประปา/ห้องน้ำ", "เฟอร์นิเจอร์", "อื่นๆ"],
      descLabel: "รายละเอียด",
      descPlaceholder: "กรุณาระบุรายละเอียดปัญหา...",
      photoLabel: "ถ่ายภาพ/แนบรูป",
      submit: "ส่งข้อมูล",
      paymentLabel: "แนบสลิปการโอน",
      amountLabel: "จำนวนเงิน (บาท)",
      contractLabel: "สัญญาเช่า",
      signContract: "ลงนามสัญญา",
      successTitle: "ส่งข้อมูลสำเร็จ",
      successDesc: "ฝ่ายบริหารจัดการได้รับข้อมูลของคุณแล้ว",
      errorTitle: "เกิดข้อผิดพลาด",
      errorDesc: "ขออภัย เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งหรือติดต่อเจ้าหน้าที่",
    }
  };

  const t = content[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    
    try {
      const formData = new FormData();
      formData.append("room_number", roomNumber);
      
      if (activeTab === "maintenance") {
        formData.append("type", "maintenance");
        formData.append("category", category);
        formData.append("description", description);
        if (photo) formData.append("photo", photo);
      } else {
        formData.append("type", "payment");
        formData.append("amount", amount);
        if (slip) formData.append("slip", slip);
      }

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
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
        <button 
          onClick={() => {
            setStatus("idle");
            setCategory("");
            setDescription("");
            setPhoto(null);
            setSlip(null);
            setAmount("");
          }}
          className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-full font-medium"
        >
          OK
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-blue-700 text-white p-6 pt-10 shadow-lg sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">{t.title}</h1>
          <div className="flex bg-blue-800 rounded-lg p-1">
            {["zh", "en", "th"].map((lang) => (
              <button 
                key={lang}
                onClick={() => setLanguage(lang as any)}
                className={`px-3 py-1 rounded-md text-xs transition-all ${language === lang ? 'bg-white text-blue-800 font-bold shadow' : 'text-blue-200'}`}
              >
                {lang === 'zh' ? '中' : lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-blue-600/50 p-3 rounded-lg border border-blue-400/30">
          <span className="text-blue-100 text-sm">{t.room}:</span>
          <span className="text-2xl font-mono font-bold">{roomNumber}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-4 space-x-2">
        <button 
          onClick={() => setActiveTab("maintenance")}
          className={`flex-1 py-3 rounded-xl flex items-center justify-center space-x-2 border transition-all ${activeTab === 'maintenance' ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-500 border-gray-200'}`}
        >
          <Wrench className="w-4 h-4" />
          <span className="text-sm font-bold">{t.tabMaintenance}</span>
        </button>
        <button 
          onClick={() => setActiveTab("payment")}
          className={`flex-1 py-3 rounded-xl flex items-center justify-center space-x-2 border transition-all ${activeTab === 'payment' ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-500 border-gray-200'}`}
        >
          <CreditCard className="w-4 h-4" />
          <span className="text-sm font-bold">{t.tabPayment}</span>
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="px-4 space-y-6">
        {activeTab === "maintenance" ? (
          <>
            <section>
              <label className="block text-sm font-semibold text-gray-700 mb-3">{t.categoryLabel}</label>
              <div className="grid grid-cols-3 gap-2">
                {t.categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-3 px-2 text-[10px] rounded-xl border transition-all ${
                      category === cat 
                        ? "bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-sm" 
                        : "bg-white border-gray-200 text-gray-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t.descLabel}</label>
              <textarea
                required
                className="w-full h-24 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 text-sm"
                placeholder={t.descPlaceholder}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </section>

            <section>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t.photoLabel}</label>
              <div className="relative h-32 w-full border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50 overflow-hidden">
                {photo ? (
                  <div className="relative w-full h-full">
                    <img src={URL.createObjectURL(photo)} className="w-full h-full object-cover" alt="Preview" />
                    <button onClick={() => setPhoto(null)} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full text-xs">✕</button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center">
                    <Camera className="w-8 h-8 text-gray-400 mb-1" />
                    <span className="text-[10px] text-gray-500">Tap to Capture</span>
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
                  </label>
                )}
              </div>
            </section>
          </>
        ) : (
          <>
            {/* Contract Section */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{t.contractLabel}</h4>
                  <p className="text-[10px] text-gray-500 italic">Required for first-time tenants</p>
                </div>
              </div>
              <button type="button" className="text-orange-600 font-bold text-xs flex items-center">
                {t.signContract} <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Payment Section */}
            <section className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t.amountLabel}</label>
                <input 
                  type="number" 
                  className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t.paymentLabel}</label>
                <div className="relative h-48 w-full border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50 overflow-hidden">
                  {slip ? (
                    <div className="relative w-full h-full">
                      <img src={URL.createObjectURL(slip)} className="w-full h-full object-cover" alt="Slip" />
                      <button onClick={() => setSlip(null)} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full text-xs">✕</button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center">
                      <CreditCard className="w-10 h-10 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500 italic">Attach Transfer Receipt</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => setSlip(e.target.files?.[0] || null)} />
                    </label>
                  )}
                </div>
              </div>
            </section>
          </>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "submitting" || (activeTab === "maintenance" && (!category || !description)) || (activeTab === "payment" && (!slip || !amount))}
          className="fixed bottom-6 left-4 right-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-2 active:scale-95 z-20"
        >
          {status === "submitting" ? (
             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>{t.submit}</span>
            </>
          )}
        </button>

        {status === "error" && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{t.errorDesc}</span>
          </div>
        )}
      </form>
    </div>
  );
}
