"use client";

import { useEffect, useState } from "react";
import { RefreshCw, List as ListIcon, Search, Info, MapPin, ZoomIn, ChevronRight, X, Navigation } from "lucide-react";
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
    // Simple 2-color system: Occupied (Blue) vs Vacant (White)
    if (status === "occupied") return "bg-blue-600 text-white border-blue-700 shadow-sm";
    return "bg-white text-slate-900 border-slate-200";
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
            <Link href="/admin" className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-2xl transition-all font-bold text-sm" title="View Maintenance Tickets">
              <ListIcon className="w-5 h-5 text-slate-600" />
              <span>Maintenance Log</span>
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
                  <Column start={2021} count={10} series="2000" />
               </div>
            </div>

          </div>
        </div>

        {/* Legend Overlay */}
        <div className="flex flex-wrap items-center justify-center gap-12 py-6 bg-white rounded-3xl shadow-lg border border-slate-200">
           <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 border-2 border-blue-700 rounded-lg shadow-sm" />
              <span className="text-sm font-black uppercase text-slate-600 tracking-widest">Occupied</span>
           </div>
           <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-white border-2 border-slate-200 rounded-lg shadow-sm" />
              <span className="text-sm font-black uppercase text-slate-600 tracking-widest">Vacant</span>
           </div>
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
                <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedRoom.status === 'occupied' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                  {selectedRoom.status}
                </div>
                <h2 className="text-5xl font-black text-slate-900 mt-2 tracking-tighter">Room {selectedRoom.room_number}</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Series {selectedRoom.room_number.substring(0, 1)}000 • Floor {selectedRoom.room_number.charAt(0)}</p>
              </header>

              <div className="h-40 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
                 <MapPin className="w-8 h-8 text-slate-300" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=13.435759,101.168537`, '_blank')}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-black text-xs uppercase shadow-lg shadow-blue-200 flex items-center justify-center space-x-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Locate Room</span>
                </button>
                <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-xl font-bold text-xs uppercase">Edit</button>
              </div>

              <div className="bg-blue-50 p-6 rounded-[2.5rem] border-2 border-blue-100 shadow-inner">
                 <div className="flex items-center space-x-2 mb-2">
                    <Navigation className="w-4 h-4 text-blue-600" />
                    <p className="text-blue-700 font-black uppercase text-[10px] tracking-widest">Wayfinding Directions</p>
                 </div>
                 <p className="text-slate-700 text-sm leading-relaxed">
                   This room is in the <strong>{selectedRoom.room_number.startsWith('5') ? 'West Wing' : 'Main Block'}</strong>. 
                   Take <strong>Elevator {selectedRoom.room_number.startsWith('5') ? 'B' : 'A'}</strong> to Floor {selectedRoom.room_number.charAt(0)}. 
                   Follow the blue floor markers to the end of the hall.
                 </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
