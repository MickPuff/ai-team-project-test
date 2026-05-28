"use client";

import { useEffect, useState, useMemo } from "react";
import { RefreshCw, List as ListIcon, Map as MapIcon, Navigation, CircleUser, Building2, Info } from "lucide-react";
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

  // Building Island Grouping (Building Topology)
  const buildings = useMemo(() => {
    if (!Array.isArray(rooms)) return {};
    return {
      "Building 1 (North)": rooms.filter(r => r.room_number.startsWith("1")),
      "Building 5 (West)": rooms.filter(r => r.room_number.startsWith("5")),
      "Building 3 (Central-L)": rooms.filter(r => r.room_number.startsWith("3")),
      "Building 2 (Central-R)": rooms.filter(r => r.room_number.startsWith("2")),
      "Building 4 (South)": rooms.filter(r => r.room_number.startsWith("4") && parseInt(r.room_number) < 4119),
      "Annex (SE)": rooms.filter(r => r.room_number.startsWith("4") && parseInt(r.room_number) >= 4119),
    };
  }, [rooms]);

  const getStatusStyles = (status: string, isSelected: boolean) => {
    if (isSelected) return "bg-blue-600 text-white border-blue-400 scale-110 shadow-lg z-30 ring-2 ring-white";
    switch (status) {
      case "available": return "bg-white text-slate-800 border-slate-200";
      case "occupied": return "bg-yellow-400 text-slate-900 border-yellow-600 shadow-[2px_2px_0px_rgba(0,0,0,0.1)]"; // Mimic sticker
      case "maintenance": return "bg-red-500 text-white border-red-700 animate-pulse";
      default: return "bg-slate-100 text-slate-400 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 font-sans p-4 lg:p-6 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-600 p-2.5 rounded-xl">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none">Bo Thong Residence</h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-1">Main Command Dashboard v4.1</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
           <Link href="/admin" className="flex items-center space-x-2 px-4 py-2 bg-slate-50 text-slate-500 hover:text-blue-600 transition-all hover:bg-blue-50 rounded-xl border border-slate-200 text-xs font-bold uppercase">
            <ListIcon className="w-4 h-4" />
            <span>Maintenance Log</span>
          </Link>
          <button 
            onClick={fetchRooms}
            className={`p-2 rounded-lg transition-all ${loading ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
        
        {/* Sidebar Panel */}
        <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {/* Legend */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Site Key</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-white border border-slate-300"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Vacant</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-yellow-400 border border-yellow-600"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Occupied</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-red-500 border border-red-700"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Repair</span>
              </div>
              <div className="flex items-center space-x-2">
                <Info className="w-3 h-3 text-blue-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Selected</span>
              </div>
            </div>
          </div>

          {/* Navigation/Selected Info */}
          {selectedRoom ? (
            <div className="bg-white rounded-2xl border-2 border-blue-500 shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                <div className="flex items-center space-x-2">
                   <Navigation className="w-5 h-5" />
                   <span className="text-sm font-black uppercase">Navigation</span>
                </div>
                <button onClick={() => setSelectedRoom(null)} className="text-blue-200 hover:text-white">✕</button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter">RM {selectedRoom.room_number}</h2>
                  <div className="flex items-center mt-1">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${getStatusStyles(selectedRoom.status, false)}`}>
                      {selectedRoom.status}
                    </span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-100 space-y-3">
                   <div className="flex space-x-3">
                      <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 text-[10px] font-bold flex items-center justify-center shrink-0">1</div>
                      <p className="text-xs text-slate-600">Start at **Main Entrance** (Bottom Center).</p>
                   </div>
                   <div className="flex space-x-3">
                      <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 text-[10px] font-bold flex items-center justify-center shrink-0">2</div>
                      <p className="text-xs text-slate-600">
                        Proceed to **Building {selectedRoom.room_number[0]}** area.
                      </p>
                   </div>
                   <div className="flex space-x-3">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center shrink-0">3</div>
                      <p className="text-xs text-slate-600">Locate door labeled **{selectedRoom.room_number}**.</p>
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/50 border-2 border-dashed border-slate-300 p-8 rounded-2xl text-center">
               <CircleUser className="w-10 h-10 text-slate-300 mx-auto mb-2" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Room<br/>to Navigate</p>
            </div>
          )}
        </div>

        {/* Map Canvas */}
        <div className="lg:col-span-3 bg-white rounded-[2rem] border border-slate-200 shadow-inner relative overflow-hidden flex flex-col">
          
          {/* Whiteboard Surface / Background */}
          <div className="absolute inset-0 bg-[#f8fafc] pattern-grid z-0"></div>
          
          <div className="relative z-10 w-full h-full p-6 lg:p-10 flex flex-col gap-10 overflow-auto custom-scrollbar">
            
            {/* Building 1 (Top) */}
            <div className="w-full flex justify-center">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-w-[300px]">
                <h4 className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">Building 1 (North)</h4>
                <div className="grid grid-cols-10 gap-1.5">
                  {buildings["Building 1 (North)"]?.map(r => (
                    <button 
                      key={r.id}
                      onClick={() => setSelectedRoom(r)}
                      className={`w-10 h-6 flex items-center justify-center rounded border text-[9px] font-black transition-all ${getStatusStyles(r.status, selectedRoom?.id === r.id)}`}
                    >
                      {r.room_number}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle Layer (Buildings 5, 3, 2) */}
            <div className="flex flex-wrap lg:flex-nowrap justify-between items-start gap-8">
              {/* Building 5 (Left) */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h4 className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">Building 5 (West)</h4>
                <div className="grid grid-cols-4 gap-1.5">
                  {buildings["Building 5 (West)"]?.map(r => (
                    <button 
                      key={r.id}
                      onClick={() => setSelectedRoom(r)}
                      className={`w-10 h-6 flex items-center justify-center rounded border text-[9px] font-black transition-all ${getStatusStyles(r.status, selectedRoom?.id === r.id)}`}
                    >
                      {r.room_number}
                    </button>
                  ))}
                </div>
              </div>

              {/* Building 3 & 2 (Central) */}
              <div className="flex gap-4">
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h4 className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">Building 3</h4>
                    <div className="grid grid-cols-3 gap-1.5">
                      {buildings["Building 3 (Central-L)"]?.map(r => (
                        <button 
                          key={r.id}
                          onClick={() => setSelectedRoom(r)}
                          className={`w-10 h-6 flex items-center justify-center rounded border text-[9px] font-black transition-all ${getStatusStyles(r.status, selectedRoom?.id === r.id)}`}
                        >
                          {r.room_number}
                        </button>
                      ))}
                    </div>
                 </div>
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h4 className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">Building 2</h4>
                    <div className="grid grid-cols-3 gap-1.5">
                      {buildings["Building 2 (Central-R)"]?.map(r => (
                        <button 
                          key={r.id}
                          onClick={() => setSelectedRoom(r)}
                          className={`w-10 h-6 flex items-center justify-center rounded border text-[9px] font-black transition-all ${getStatusStyles(r.status, selectedRoom?.id === r.id)}`}
                        >
                          {r.room_number}
                        </button>
                      ))}
                    </div>
                 </div>
              </div>
            </div>

            {/* Bottom Layer (Building 4, Annex) */}
            <div className="flex flex-wrap lg:flex-nowrap justify-center items-end gap-12 mt-auto">
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h4 className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">Building 4 (South Main)</h4>
                  <div className="grid grid-cols-12 gap-1.5">
                    {buildings["Building 4 (South)"]?.map(r => (
                      <button 
                        key={r.id}
                        onClick={() => setSelectedRoom(r)}
                        className={`w-10 h-6 flex items-center justify-center rounded border text-[9px] font-black transition-all ${getStatusStyles(r.status, selectedRoom?.id === r.id)}`}
                      >
                        {r.room_number}
                      </button>
                    ))}
                  </div>
               </div>
               
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h4 className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">Annex</h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    {buildings["Annex (SE)"]?.map(r => (
                      <button 
                        key={r.id}
                        onClick={() => setSelectedRoom(r)}
                        className={`w-10 h-6 flex items-center justify-center rounded border text-[9px] font-black transition-all ${getStatusStyles(r.status, selectedRoom?.id === r.id)}`}
                      >
                        {r.room_number}
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            {/* Pathfinding SVG Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
              {selectedRoom && (
                <path
                  d={selectedRoom.room_number.startsWith("1") 
                    ? "M 50% 98% L 50% 10%" // Top
                    : selectedRoom.room_number.startsWith("5")
                    ? "M 50% 98% L 50% 50% L 10% 50%" // Left
                    : selectedRoom.room_number.startsWith("4")
                    ? "M 50% 98% L 50% 80%" // Bottom
                    : "M 50% 98% L 50% 50%" // Middle
                  }
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                  className="animate-[dash_2s_linear_infinite]"
                />
              )}
            </svg>

            {/* Entrance Marker */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center z-30">
               <div className="bg-slate-900 text-white text-[8px] font-black px-2 py-0.5 rounded-full mb-1">MAIN ENTRANCE</div>
               <div className="w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
            </div>

          </div>
        </div>
      </div>

      <style jsx global>{`
        .pattern-grid {
          background-image: radial-gradient(#cbd5e1 0.5px, transparent 0.5px);
          background-size: 24px 24px;
        }
        @keyframes dash {
          to { stroke-dashoffset: -12; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
