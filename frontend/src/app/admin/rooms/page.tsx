"use client";

import { useEffect, useState } from "react";
import { RefreshCw, LayoutGrid, List as ListIcon, MapPin, Search, X, Activity } from "lucide-react";
import Link from "next/link";

interface Room {
  id: number;
  room_number: string;
  status: "available" | "occupied" | "maintenance" | "disabled";
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function HighFidelityRoomMap() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/rooms`);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-white border-slate-200 text-slate-800";
      case "occupied": return "bg-[#FFD700] border-[#E6C200] text-slate-900"; // Physical yellow sticker
      case "maintenance": return "bg-orange-500 border-orange-600 text-white animate-pulse";
      case "disabled": return "bg-slate-300 border-slate-400 text-slate-500";
      default: return "bg-white";
    }
  };

  const RoomTag = ({ num, series }: { num: string, series: string }) => {
    const room = rooms.find(r => r.room_number === num) || { status: 'available' };
    const isSelected = selectedRoom?.room_number === num;
    const matchesSearch = searchTerm && num.includes(searchTerm);

    return (
      <div
        onClick={() => setSelectedRoom(room as Room)}
        className={`
          relative h-8 w-full flex items-center justify-center rounded-md border-2 text-[10px] font-black cursor-pointer transition-all
          ${getStatusColor(room.status)}
          ${isSelected ? 'ring-4 ring-blue-500/50 scale-110 z-10 shadow-2xl border-white' : 'hover:scale-105 hover:z-10 shadow-sm'}
          ${matchesSearch ? 'ring-4 ring-pink-500 z-20' : ''}
        `}
      >
        {num}
        {room.status === 'occupied' && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-600 rounded-full border border-white shadow-sm" />}
      </div>
    );
  };

  const Column = ({ start, count, series, reverse = false }: { start: number, count: number, series: string, reverse?: boolean }) => {
    const nums = Array.from({ length: count }, (_, i) => (start + i).toString());
    if (reverse) nums.reverse();
    return (
      <div className="flex flex-col gap-1 w-full min-w-[45px]">
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
              <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.2em] mt-1">Scale: 1:1 Digital Twin of Physical Board</p>
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
                onChange={(e) => setSearchTerm(e.target.value)}
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

          <div className="grid grid-cols-[180px_1fr_260px] gap-8 h-full">
 
            {/* 1. 5000 Series (Left Vertical - West Wing) */}
            <div className="bg-slate-700/30 p-4 rounded-3xl border-2 border-slate-600/50">
              <h3 className="text-center font-black text-slate-400 text-[10px] mb-4 tracking-widest uppercase">West Wing (5000)</h3>
              <div className="grid grid-cols-2 gap-2">
                <Column start={5001} count={20} series="5000" />
                <Column start={5021} count={20} series="5000" />
              </div>
            </div>

            {/* Middle Section (1000, 3000, 4000) */}
            <div className="flex flex-col gap-8">

              {/* 1000 Series Horizontal Header (North Wing) */}
              <div className="bg-slate-700/30 p-6 rounded-3xl border-2 border-slate-600/50">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="font-black text-slate-400 text-[10px] tracking-widest uppercase">North Wing (1000 Series)</h3>
                   <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[9px] font-black tracking-widest uppercase">Executive Tier</div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                   <div className="grid grid-cols-16 gap-1.5">
                      {Array.from({ length: 16 }, (_, i) => <RoomTag key={1001+i} num={(1001 + i).toString()} series="1000" />)}
                   </div>
                   <div className="grid grid-cols-16 gap-1.5">
                      {Array.from({ length: 16 }, (_, i) => <RoomTag key={1017+i} num={(1017 + i).toString()} series="1000" />)}
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-[1fr_2fr] gap-6">
                {/* 3000 Series (Central Block) */}
                <div className="bg-slate-700/30 p-5 rounded-3xl border-2 border-slate-600/50 flex flex-col gap-4">
                  <h3 className="font-black text-slate-400 text-[10px] tracking-widest uppercase">Central Block (3000)</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <Column start={3001} count={15} series="3000" />
                    <Column start={3016} count={15} series="3000" />
                    <Column start={3031} count={13} series="3000" />
                  </div>
                </div>

                {/* 4000 Series (Main Complex) */}
                <div className="bg-slate-700/30 p-5 rounded-3xl border-2 border-slate-600/50 flex flex-col gap-4">
                  <h3 className="font-black text-slate-400 text-[10px] tracking-widest uppercase text-center">Main Complex (4000)</h3>
                  <div className="grid grid-cols-6 gap-2">
                     <Column start={4001} count={22} series="4000" />
                     <Column start={4023} count={22} series="4000" />
                     <Column start={4045} count={22} series="4000" />
                     <Column start={4067} count={22} series="4000" />
                     <Column start={4089} count={22} series="4000" />
                     <Column start={4111} count={22} series="4000" />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. 2000 Series (Right Block - East Wing) */}
            <div className="bg-slate-700/30 p-4 rounded-3xl border-2 border-slate-600/50 flex flex-col gap-6">
               <h3 className="text-center font-black text-slate-400 text-[10px] tracking-widest uppercase">East Wing (2000)</h3>
               <div className="grid grid-cols-2 gap-2 h-full">
                  <Column start={2001} count={29} series="2000" />
                  <div className="flex flex-col gap-6">
                    <Column start={2030} count={20} series="2000" />
                    <div className="bg-slate-900/50 p-3 rounded-2xl border-2 border-slate-800 flex flex-col gap-2">
                       <p className="text-[9px] font-black text-slate-500 uppercase text-center">Utility Block</p>
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
           <div className="flex items-center space-x-3"><div className="w-5 h-5 bg-[#FFD700] border-2 border-[#E6C200] rounded-lg shadow-sm" /><span className="text-xs font-black uppercase text-slate-600 tracking-wider">Occupied (Sticker)</span></div>
           <div className="flex items-center space-x-3"><div className="w-5 h-5 bg-white border-2 border-slate-200 rounded-lg shadow-sm" /><span className="text-xs font-black uppercase text-slate-600 tracking-wider">Available</span></div>
           <div className="flex items-center space-x-3"><div className="w-5 h-5 bg-orange-500 border-2 border-orange-600 rounded-lg animate-pulse" /><span className="text-xs font-black uppercase text-slate-600 tracking-wider">Repair Required</span></div>
           <div className="flex items-center space-x-3"><div className="w-5 h-5 bg-blue-600 rounded-full border-2 border-white shadow-md shadow-blue-200" /><span className="text-xs font-black uppercase text-slate-600 tracking-wider">Active Selection</span></div>
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
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
                  {selectedRoom.room_number.startsWith('M') ? 'Utility / Management Block' : `Series ${selectedRoom.room_number.substring(0, 1)}000`}
                </p>
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
                 <p className="text-emerald-600 text-xs mt-1">
                   {selectedRoom.room_number.startsWith('5') ? 'Located in the West Wing.' : 
                    selectedRoom.room_number.startsWith('2') ? 'Located in the East Wing.' :
                    selectedRoom.room_number.startsWith('1') ? 'Located in the North Wing (Top).' :
                    'Located in the Main Central Block.'}
                 </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
