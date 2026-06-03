"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Database, Users, Zap, Heart, Search, Download, Trash2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

// We'll create a new server action to get ALL data
import { getAllData } from "../../actions";

export default function DatabaseAdmin() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const result = await getAllData();
        setData(result);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredUsers = data?.users?.filter((u: any) => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.meter?.meterNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout title="Project Database (Admin)">
      <div className="space-y-8 pb-20">
        
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-amber-500 p-8 rounded-[2.5rem] text-white shadow-xl shadow-amber-200">
           <div>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Database className="w-8 h-8" /> Live Data Explorer
              </h2>
              <p className="text-amber-100 mt-1">Direct access to the Evolve Meter SQLite Database</p>
           </div>
           <div className="flex gap-2">
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-2xl">
                 <Download className="w-4 h-4 mr-2" /> Export to Excel
              </Button>
           </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <Card className="p-6 bg-white border-neutral-100 flex flex-col items-center justify-center text-center">
              <Users className="text-blue-500 mb-2" />
              <div className="text-2xl font-bold">{data?.users?.length || 0}</div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Total Users</p>
           </Card>
           <Card className="p-6 bg-white border-neutral-100 flex flex-col items-center justify-center text-center">
              <Zap className="text-amber-500 mb-2" />
              <div className="text-2xl font-bold">{Math.round(data?.meters?.reduce((acc:any, m:any) => acc + m.joulesGenerated, 0) || 0)}J</div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Energy Generated</p>
           </Card>
           <Card className="p-6 bg-white border-neutral-100 flex flex-col items-center justify-center text-center">
              <Heart className="text-rose-500 mb-2" />
              <div className="text-2xl font-bold">{data?.needs?.length || 0}</div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Total Needs</p>
           </Card>
           <Card className="p-6 bg-white border-neutral-100 flex flex-col items-center justify-center text-center">
              <ShieldCheck className="text-emerald-500 mb-2" />
              <div className="text-2xl font-bold">Encrypted</div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Security Status</p>
           </Card>
        </div>

        {/* Search Bar */}
        <div className="relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
           <input 
            type="text" 
            placeholder="Search by name or Meter ID..." 
            className="w-full pl-12 pr-4 py-4 bg-white border border-neutral-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-amber-400 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>

        {/* User Data Table */}
        <Card className="overflow-hidden border-none shadow-2xl shadow-neutral-200/50">
           <div className="p-6 border-b border-neutral-50 bg-neutral-50/50 flex justify-between items-center">
              <h3 className="font-bold text-neutral-700">User Directory</h3>
              <span className="text-xs font-bold text-neutral-400 bg-white px-3 py-1 rounded-full border border-neutral-100">SQLite: dev.db</span>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-neutral-50/50 text-[10px] font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Meter ID</th>
                    <th className="px-6 py-4">Points</th>
                    <th className="px-6 py-4">Level</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {loading ? (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-neutral-400 italic">Accessing database...</td></tr>
                  ) : filteredUsers?.map((u: any) => (
                    <tr key={u.id} className="hover:bg-amber-50/30 transition-colors group">
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-sm shadow-sm group-hover:bg-white transition-colors">👤</div>
                            <span className="font-bold text-neutral-700">{u.name}</span>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                           u.role === 'TEACHER' ? 'bg-blue-100 text-blue-700' : 
                           u.role === 'PARENT' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                         }`}>
                           {u.role}
                         </span>
                      </td>
                      <td className="px-6 py-4">
                         <code className="text-xs font-mono font-bold text-neutral-500 bg-neutral-50 px-2 py-1 rounded border border-neutral-100 group-hover:border-amber-200 group-hover:text-amber-700 transition-colors">
                           {u.meter?.meterNumber}
                         </code>
                      </td>
                      <td className="px-6 py-4 font-bold text-neutral-600">{u.points} XP</td>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                               {u.level}
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button className="text-neutral-300 hover:text-red-500 transition-colors p-2"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </Card>
      </div>
    </AppLayout>
  );
}
