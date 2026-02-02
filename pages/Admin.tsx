import React, { useState, useEffect } from 'react';
import { BarChart, FileText, Settings, DollarSign, Menu, ArrowUpRight, ArrowDownRight, Sun, Moon, Bell } from 'lucide-react';
import { Card, Badge } from '../components/UIComponents';

type TabType = 'dashboard' | 'documents' | 'settings';

export const Admin = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Oylik ma'lumotlar (Foydalanuvchilar va Summa)
  const monthlyStats = [
    { month: 'Yanvar', users: 120, amount: 1500000 },
    { month: 'Fevral', users: 210, amount: 2800000 },
    { month: 'Mart', users: 180, amount: 2100000 },
    { month: 'Aprel', users: 320, amount: 4500000 },
    { month: 'May', users: 280, amount: 3800000 },
    { month: 'Iyun', users: 450, amount: 5900000 },
  ];

  const DashboardView = () => (
    <div className="space-y-8">
      {/* Asosiy ko'rsatkichlar kartalari */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Jami foydalanuvchilar', value: '1,234', change: '+12%', isPositive: true, icon: BarChart, color: 'bg-blue-500' },
          { title: 'Jami hujjatlar', value: '12,543', change: '+5%', isPositive: true, icon: FileText, color: 'bg-green-500' },
          { title: 'Jami summa', value: '45.8 mln', change: '+18%', isPositive: true, icon: DollarSign, color: 'bg-purple-500' },
        ].map((stat, i) => (
          <Card key={i} className="p-8 rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-gray-800 transition-all hover:scale-[1.02]">
             <div className="flex items-center justify-between">
               <div className={`p-4 rounded-2xl ${stat.color} text-white shadow-lg`}>
                  <stat.icon size={28} />
               </div>
               <Badge color={stat.isPositive ? 'green' : 'red'} className="py-1 px-3">
                  {stat.change} {stat.isPositive ? <ArrowUpRight size={14} className="inline ml-1"/> : <ArrowDownRight size={14} className="inline ml-1"/>}
               </Badge>
             </div>
             <div className="mt-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{stat.title}</p>
                <p className="text-4xl font-black text-gray-900 dark:text-white mt-2">{stat.value}</p>
             </div>
          </Card>
        ))}
      </div>

      {/* Oylik to'lovlar va Foydalanuvchilar tahlili */}
      <Card className="p-10 rounded-[3rem] border-none shadow-2xl bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-2xl font-black text-gray-800 dark:text-white">Oylik tahlil jadvali</h3>
            <p className="text-sm text-gray-400 mt-1">Foydalanuvchilar soni va jami tushum o'rtasidagi nisbat</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
              <span className="w-3 h-3 bg-indigo-400 rounded-full"></span> Foydalanuvchilar
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
              <span className="w-3 h-3 bg-indigo-700 rounded-full"></span> Jami Summa
            </div>
          </div>
        </div>

        <div className="h-80 flex items-end justify-between gap-6 px-4 border-b border-gray-100 dark:border-gray-700 pb-2">
          {monthlyStats.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
              {/* Tooltip on Hover */}
              <div className="absolute bottom-full mb-4 hidden group-hover:flex flex-col items-center z-20">
                <div className="bg-gray-900 text-white p-3 rounded-xl text-[10px] shadow-2xl min-w-[120px]">
                   <p className="text-indigo-300 mb-1">👤 {item.users} ta foydalanuvchi</p>
                   <p className="text-green-300 font-black">💰 {item.amount.toLocaleString()} so'm</p>
                </div>
                <div className="w-2 h-2 bg-gray-900 rotate-45 -mt-1"></div>
              </div>

              {/* Bar Columns */}
              <div className="flex items-end gap-1.5 w-full h-full">
                {/* Users Bar */}
                <div 
                  className="flex-1 bg-indigo-400 rounded-t-lg transition-all duration-300 group-hover:bg-indigo-300 cursor-pointer" 
                  style={{ height: `${(item.users / 500) * 100}%` }}
                ></div>
                {/* Amount Bar */}
                <div 
                  className="flex-1 bg-indigo-700 rounded-t-lg transition-all duration-300 group-hover:bg-indigo-600 cursor-pointer shadow-lg shadow-indigo-200/50" 
                  style={{ height: `${(item.amount / 6000000) * 100}%` }}
                ></div>
              </div>
              <span className="text-[10px] font-black text-gray-400 mt-4 uppercase tracking-wider">{item.month}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar va Header qismlari avvalgidek qoladi, faqat menuItems yangilanadi */}
      {/* ... (Menu qismi va Header qismini avvalgi kod bilan bir xil qoldiring) */}
      <main className="flex-1 overflow-auto p-12">
           {activeTab === 'dashboard' && <DashboardView />}
           {activeTab === 'documents' && <div className="p-10 text-center font-bold text-gray-400 uppercase italic tracking-widest">Hujjatlar bo'limi yuklanmoqda...</div>}
           {activeTab === 'settings' && <div className="p-10 text-center font-bold text-gray-400 uppercase italic tracking-widest">Tizim sozlamalari yuklanmoqda...</div>}
      </main>
    </div>
  );
};