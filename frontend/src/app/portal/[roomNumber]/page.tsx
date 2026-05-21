"use client";

import { useState, use } from "react";
import { Camera, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function TenantPortal({ params }: { params: Promise<{ roomNumber: string }> }) {
  const { roomNumber } = use(params);
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const content = {
    zh: {
      title: "博通公寓 - 租户服务",
      room: "房间号",
      categoryLabel: "问题类型",
      categories: ["空调", "电力", "水管/厕所", "家具", "其他"],
      descLabel: "描述问题",
      descPlaceholder: "请详细描述您遇到的问题...",
      photoLabel: "拍摄/上传照片",
      submit: "提交报告",
      successTitle: "提交成功",
      successDesc: "管理处已收到您的请求。我们会尽快安排维修。",
      errorTitle: "提交失败",
      errorDesc: "抱歉，提交时出现错误。请重试或联系管理处。",
    },
    en: {
      title: "Bo Thong - Tenant Service",
      room: "Room Number",
      categoryLabel: "Problem Category",
      categories: ["Aircon", "Electrical", "Plumbing", "Furniture", "Other"],
      descLabel: "Description",
      descPlaceholder: "Describe your problem in detail...",
      photoLabel: "Take/Upload Photo",
      submit: "Submit Report",
      successTitle: "Submitted Successfully",
      successDesc: "Management has received your request. We will arrange repairs soon.",
      errorTitle: "Submission Failed",
      errorDesc: "Sorry, an error occurred. Please try again or contact management.",
    },
  };

  const t = content[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    
    try {
      const formData = new FormData();
      formData.append("room_number", roomNumber);
      formData.append("category", category);
      formData.append("description", description);
      if (photo) {
        formData.append("photo", photo);
      }

      const response = await fetch("http://localhost:8000/api/portal/report", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to submit");
      
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
          onClick={() => setStatus("idle")}
          className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-full font-medium"
        >
          OK
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-blue-700 text-white p-6 pt-10 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">{t.title}</h1>
          <div className="flex bg-blue-800 rounded-lg p-1">
            <button 
              onClick={() => setLanguage("zh")}
              className={`px-3 py-1 rounded-md text-sm transition-all ${language === 'zh' ? 'bg-white text-blue-800 font-bold shadow' : 'text-blue-200'}`}
            >
              中
            </button>
            <button 
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 rounded-md text-sm transition-all ${language === 'en' ? 'bg-white text-blue-800 font-bold shadow' : 'text-blue-200'}`}
            >
              EN
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-blue-600/50 p-3 rounded-lg border border-blue-400/30">
          <span className="text-blue-100 text-sm">{t.room}:</span>
          <span className="text-2xl font-mono font-bold">{roomNumber}</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Category */}
        <section>
          <label className="block text-sm font-semibold text-gray-700 mb-3">{t.categoryLabel}</label>
          <div className="grid grid-cols-3 gap-2">
            {t.categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`py-3 px-2 text-xs rounded-xl border transition-all ${
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

        {/* Description */}
        <section>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t.descLabel}</label>
          <textarea
            required
            className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700"
            placeholder={t.descPlaceholder}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </section>

        {/* Photo Upload */}
        <section>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t.photoLabel}</label>
          <div className="relative h-40 w-full border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50 overflow-hidden">
            {photo ? (
              <div className="relative w-full h-full">
                <img 
                  src={URL.createObjectURL(photo)} 
                  className="w-full h-full object-cover" 
                  alt="Preview"
                />
                <button 
                  onClick={() => setPhoto(null)}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center">
                <Camera className="w-10 h-10 text-gray-400 mb-2" />
                <span className="text-xs text-gray-500">Tap to Capture</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment"
                  className="hidden" 
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                />
              </label>
            )}
          </div>
        </section>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "submitting" || !category || !description}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-95"
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
