"use client";

import { useEffect, useState } from "react";
import { RefreshCw, LayoutGrid, List as ListIcon } from "lucide-react";
import Link from "next/link";

interface Room {
  id: number;
  room_number: string;
  status: "available" | "occupied" | "maintenance" | "disabled";
}

export default function RoomBlockView() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Group rooms by their series (1000s, 2000s, etc.)
  const blocks = {
    "1000 Series": rooms.filter(r => r.room_number.startsWith("1")),
    "2000 Series": rooms.filter(r => r.room_number.startsWith("2")),
    "3000 Series": rooms.filter(r => r.room_number.startsWith("3")),
    "4000 Series": rooms.filter(r => r.room_number.startsWith("4")),
    "5000 Series": rooms.filter(r => r.room_number.startsWith("5")),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-white border-gray-200 text-gray-800";
      case "occupied": return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "maintenance": return "bg-red-100 border-red-300 text-red-800 animate-pulse";
      case "disabled": return "bg-gray-200 border-gray-400 text-gray-500";
      default: return "bg-white";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-[1600px] mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Room Status Board</h1>
            <p className="text-gray-600">Digital Twin of Physical Dashboard</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow border hover:bg-gray-50 transition-all text-sm font-medium">
              <ListIcon className="w-4 h-4" />
              <span>Request List</span>
            </Link>
            <button 
              onClick={fetchRooms}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-all text-sm font-medium"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Board</span>
            </button>
          </div>
        </header>

        {/* Legend */}
        <div className="flex space-x-6 mb-8 bg-white p-4 rounded-xl border shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded border bg-white border-gray-200"></div>
            <span className="text-xs font-medium text-gray-600 uppercase">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded border bg-yellow-100 border-yellow-300"></div>
            <span className="text-xs font-medium text-gray-600 uppercase">Occupied</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded border bg-red-100 border-red-300"></div>
            <span className="text-xs font-medium text-gray-600 uppercase">Needs Repair</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded border bg-gray-200 border-gray-400"></div>
            <span className="text-xs font-medium text-gray-600 uppercase">Disabled</span>
          </div>
        </div>

        {/* Spatial Blocks */}
        <div className="space-y-12">
          {Object.entries(blocks).map(([name, roomList]) => (
            roomList.length > 0 && (
              <section key={name}>
                <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center">
                  <LayoutGrid className="w-5 h-5 mr-2 text-blue-500" />
                  {name} ({roomList.length} Rooms)
                </h2>
                <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-15 xl:grid-cols-20 gap-2">
                  {roomList.map((room) => (
                    <div
                      key={room.id}
                      className={`h-12 flex items-center justify-center rounded-lg border text-sm font-bold shadow-sm transition-all cursor-default ${getStatusColor(room.status)}`}
                      title={`Room ${room.room_number} - ${room.status}`}
                    >
                      {room.room_number}
                    </div>
                  ))}
                </div>
              </section>
            )
          ))}
        </div>
      </div>
    </div>
  );
}
