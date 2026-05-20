"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Clock, AlertTriangle, RefreshCw, Undo2, Map as MapIcon } from "lucide-react";
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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bo Thong Residence</h1>
            <p className="text-gray-600">Maintenance Management Dashboard</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/admin/rooms" className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-all text-sm font-medium">
              <MapIcon className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <button 
              onClick={fetchRequests}
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow border hover:bg-gray-50 transition-all text-sm font-medium"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
            <h3 className="text-sm font-semibold text-gray-500 uppercase">Total Pending</h3>
            <p className="text-3xl font-bold text-gray-900">{requests.filter(r => r.status !== 'completed').length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
            <h3 className="text-sm font-semibold text-gray-500 uppercase">Completed Today</h3>
            <p className="text-3xl font-bold text-gray-900">{requests.filter(r => r.status === 'completed').length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
            <h3 className="text-sm font-semibold text-gray-500 uppercase">Recent Activity</h3>
            <p className="text-3xl font-bold text-gray-900">{requests.length > 0 ? 'Active' : 'None'}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description (Thai/CN)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {req.room_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {req.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="font-medium text-gray-900 mb-1">{req.thai_description}</div>
                    <div className="text-xs italic text-gray-400">{req.chinese_description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {req.status === 'completed' ? (
                      <span className="flex items-center text-green-600 font-medium">
                        <CheckCircle className="w-4 h-4 mr-1" /> Done
                      </span>
                    ) : (
                      <span className="flex items-center text-yellow-600 font-medium">
                        <Clock className="w-4 h-4 mr-1" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {req.status !== 'completed' ? (
                      confirmingId === req.id ? (
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => markDone(req.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-bold transition-all shadow-sm"
                          >
                            Confirm
                          </button>
                          <button 
                            onClick={() => setConfirmingId(null)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-xs font-bold transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setConfirmingId(req.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-bold transition-all shadow-sm active:scale-95"
                        >
                          Mark Done
                        </button>
                      )
                    ) : (
                      <button 
                        onClick={() => reopenRequest(req.id)}
                        className="flex items-center space-x-1 text-gray-400 hover:text-blue-600 transition-all group"
                        title="Re-open task"
                      >
                        <Undo2 className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-medium">Re-open</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    No maintenance requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
