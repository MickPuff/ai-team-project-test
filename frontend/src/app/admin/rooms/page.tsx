"use client";

import { useEffect, useState } from "react";
import { RefreshCw, List as ListIcon, Search, Info, MapPin, ZoomIn, ChevronRight, X } from "lucide-react";
import Link from "next/link";

interface Room {
  id: number;
  room_number: string;
  status: "available" | "occupied" | "maintenance" | "disabled";
}

export default function MasterPlanMap() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [searchTerm, setSearch] = useState("");

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/admin/rooms");
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const getStatusStyle = (status: string, series: string) => {
    const isYellowSeries = series === "5000" || series === "1000";
    
    // Base colors from the photo
    const yellowTag = "bg-[#FFD700] text-black border-[#E6C200]";
    const whiteTag = "bg-white text-black border-slate-300";
    
    // Status Overlays
    if (status === "maintenance") return "bg-orange-500 text-white border-orange-600 animate-pulse";
    if (status === "occupied") return isYellowSeries ? yellowTag : "bg-blue-100 text-blue-800 border-blue-200";
    if (status === "available") return whiteTag;
    
    return isYellowSeries ? yellowTag : whiteTag;
  };

  const RoomTag = ({ num, series }: { num: string, series: string }) => {
    const room = rooms.find(r => r.room_number === num) || { room_number: num, status: 'available' as const };
    const isSelected = selectedRoom?.room_number === num;

    return (
      <div
        onClick={() => setSelectedRoom(room as Room)}
        className={`
          relative w-full h-10 flex items-center justify-center text-[11px] font-black border-2 rounded-md cursor-pointer transition-all
          ${getStatusStyle(room.status, series)}
          ${isSelected ? 'ring-4 ring-blue-500/50 scale-110 z-10 shadow-2xl border-white' : 'hover:scale-105 hover:z-10 shadow-sm'}
        `}
      >
        {num}
        {room.status === 'occupied' && series !== "5000" && <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full border border-white shadow-sm" />}
      </div>
    );
  };

  const Column = ({ start, count, series, reverse = false }: { start: number, count: number, series: string, reverse?: boolean }) => {
    const nums = Array.from({ length: count }, (_, i) => (start + i).toString());
    if (reverse) nums.reverse();
    return (
      <div className="flex flex-col gap-1.5 w-full min-w-[50px]">
        {nums.map(n => <RoomTag key={n} num={n} series={series} />)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] p-4 md:p-6 font-sans text-slate-900 overflow-x-hidden">
      <div className="max-w-[1900px] mx-auto space-y-6">
        
        {/* Physical Board Style Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-md border border-slate-200">
          <div className="flex items-center space-x-4">
            <div className="bg-slate-900 p-4 rounded-2xl shadow-xl">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">BO THONG DIGITAL MASTER BOARD</h1>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.2em]">Scale: 1:1 Digital Twin</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search rooms..." 
                className="bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 pl-12 pr-6 text-sm font-bold focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none w-64 transition-all"
                value={searchTerm}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Link href="/admin" className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all" title="Back to Log">
              <ListIcon className="w-6 h-6 text-slate-600" />
            </Link>
            <button onClick={fetchRooms} className="flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-lg shadow-blue-200 active:scale-95">
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              <span>SYNC BOARD</span>
            </button>
          </div>
        </header>

        {/* THE BOARD CONTAINER */}
        <div className="bg-slate-800 border-[16px] border-slate-900 rounded-[3rem] p-10 shadow-2xl min-h-[900px]">
          
          <div className="grid grid-cols-[220px_1fr_300px] gap-12 h-full">
            
            {/* 1. 5000 Series (Left Vertical) */}
            <div className="bg-slate-700/30 p-6 rounded-3xl border-2 border-slate-600/50">
              <h3 className="text-center font-black text-slate-400 text-xs mb-6 tracking-widest uppercase">West Wing (5000)</h3>
              <div className="grid grid-cols-2 gap-3">
                <Column start={5055} count={18} series="5000" />
                <Column start={5037} count={18} series="5000" />
              </div>
            </div>

            {/* Middle Section (1000, 3000, 4000) */}
            <div className="flex flex-col gap-10">
              
              {/* 1000 Series Horizontal Header */}
              <div className="bg-slate-700/30 p-6 rounded-3xl border-2 border-slate-600/50">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="font-black text-slate-400 text-xs tracking-widest uppercase">North Wing (1000 Series)</h3>
                   <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black tracking-widest uppercase">Executive Tier</div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                   <div className="grid grid-cols-12 gap-1.5">
                      {Array.from({ length: 12 }, (_, i) => <RoomTag key={1001+i} num={(1001 + i).toString()} series="1000" />)}
                   </div>
                   <div className="grid grid-cols-12 gap-1.5">
                      {Array.from({ length: 12 }, (_, i) => <RoomTag key={1013+i} num={(1013 + i).toString()} series="1000" />)}
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-[1fr_2fr] gap-8">
                {/* 3000 Series */}
                <div className="bg-slate-700/30 p-6 rounded-3xl border-2 border-slate-600/50 flex flex-col gap-4">
                  <h3 className="font-black text-slate-400 text-xs tracking-widest uppercase">Central Block (3000)</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <Column start={3001} count={12} series="3000" />
                    <Column start={3015} count={12} series="3000" />
                    <Column start={3029} count={12} series="3000" />
                  </div>
                </div>

                {/* 4000 Series */}
                <div className="bg-slate-700/30 p-6 rounded-3xl border-2 border-slate-600/50 flex flex-col gap-4">
                  <h3 className="font-black text-slate-400 text-xs tracking-widest uppercase text-center">Main Complex (4000)</h3>
                  <div className="grid grid-cols-6 gap-2">
                     <Column start={4001} count={15} series="4000" />
                     <Column start={4021} count={15} series="4000" />
                     <Column start={4041} count={15} series="4000" />
                     <Column start={4061} count={15} series="4000" />
                     <Column start={4081} count={15} series="4000" />
                     <Column start={4101} count={15} series="4000" />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. 2000 Series (Right Block) */}
            <div className="bg-slate-700/30 p-6 rounded-3xl border-2 border-slate-600/50 flex flex-col gap-8">
               <h3 className="text-center font-black text-slate-400 text-xs tracking-widest uppercase">East Wing (2000)</h3>
               <div className="grid grid-cols-2 gap-3 h-full">
                  <Column start={2001} count={20} series="2000" />
                  <div className="flex flex-col gap-10">
                    <Column start={2021} count={10} series="2000" />
                    <div className="bg-slate-900/50 p-4 rounded-2xl border-2 border-slate-800 flex flex-col gap-2">
                       <p className="text-[10px] font-black text-slate-500 uppercase text-center">Utility Block</p>
                       <div className="grid grid-cols-2 gap-1.5">
                          <RoomTag num="M01" series="UT" />
                          <RoomTag num="M02" series="UT" />
                          <RoomTag num="M03" series="UT" />
                          <RoomTag num="M04" series="UT" />
                       </div>
                    </div>
                  </div>
               </div>
            </div>

          </div>
        </div>

        {/* Legend Overlay */}
        <div className="flex flex-wrap items-center justify-center gap-8 py-4 bg-white rounded-3xl shadow-lg border border-slate-200">
           <div className="flex items-center space-x-3"><div className="w-5 h-5 bg-[#FFD700] border-2 border-[#E6C200] rounded-lg shadow-sm" /><span className="text-xs font-black uppercase text-slate-600 tracking-wider">Residential Series</span></div>
           <div className="flex items-center space-x-3"><div className="w-5 h-5 bg-white border-2 border-slate-200 rounded-lg shadow-sm" /><span className="text-xs font-black uppercase text-slate-600 tracking-wider">Available</span></div>
           <div className="flex items-center space-x-3"><div className="w-5 h-5 bg-orange-500 border-2 border-orange-600 rounded-lg animate-pulse" /><span className="text-xs font-black uppercase text-slate-600 tracking-wider">Repair Required</span></div>
           <div className="flex items-center space-x-3"><div className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-md shadow-blue-200" /><span className="text-xs font-black uppercase text-slate-600 tracking-wider">Occupied (Live)</span></div>
        </div>
      </div>

      {/* Slide-over Detail Panel */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setSelectedRoom(null)} />
          <div className="relative w-full max-w-sm bg-white shadow-2xl p-8 flex flex-col slide-in-from-right duration-300">
            <button onClick={() => setSelectedRoom(null)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-all">
              <X className="w-5 h-5 text-slate-400" />
            </button>

            <div className="space-y-6 mt-6">
              <header>
                <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedRoom.status === 'maintenance' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                  {selectedRoom.status}
                </div>
                <h2 className="text-5xl font-black text-slate-900 mt-2 tracking-tighter">Room {selectedRoom.room_number}</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Series {selectedRoom.room_number.substring(0, 1)}000 • Floor {selectedRoom.room_number.charAt(0)}</p>
              </header>

              <div className="h-40 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
                 <MapPin className="w-8 h-8 text-slate-300" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-xs uppercase shadow-lg shadow-blue-200">History</button>
                <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-xl font-bold text-xs uppercase">Edit</button>
              </div>

              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                 <p className="text-emerald-700 font-black uppercase text-[10px]">Wayfinding Help</p>
                 <p className="text-emerald-600 text-xs mt-1">Located in the <strong>{selectedRoom.room_number.startsWith('5') ? 'West Wing' : 'Main Block'}</strong>. Take Elevator B to Floor {selectedRoom.room_number.charAt(0)}.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
