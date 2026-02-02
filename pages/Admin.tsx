import React, { useState, useEffect } from 'react';
import { BarChart, FileText, Settings, DollarSign, Plus, Search, Bell, Menu, ArrowUpRight, ArrowDownRight, Sun, Moon } from 'lucide-react';
import { Card, Button, Badge } from '../components/UIComponents';
import { documents, userOrders } from '../data/mockData';
import { LanguageSwitcher } from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';

type TabType = 'dashboard' | 'documents' | 'settings';

export const Admin = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { t, tr } = useLanguage();

  useEffect(() => {
     const isDarkMode = document.documentElement.classList.contains('dark');
     setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle('dark');
  };

  // Moliya va Foydalanuvchilar olib tashlandi
  const menuItems = [
    { id: 'dashboard', label: 'Umumiy ko‘rsatkichlar', icon: BarChart },
    { id: 'documents', label: 'Hujjatlar', icon: FileText },
    { id: 'settings', label: 'Sozlamalar', icon: Settings },
  ];

  const DashboardView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Jami foydalanuvchilar', value: '1,234', change: '+12%', isPositive: true, icon: BarChart, color: 'bg-blue-500' },
          { title: 'Jami hujjatlar', value: '12,543', change: '+5%', isPositive: true, icon: FileText, color: 'bg-green-500' },
          { title: 'Jami summa', value: '45.8 mln', change: '+18%', isPositive: true, icon: DollarSign, color: 'bg-purple-500' },
        ].map((stat, i) => (
          <Card key={i} className="p-6 rounded-[2rem] border-none shadow-xl shadow-gray-100 dark:shadow-none">
             <div className="flex items-center justify-between">
               <div className={`p-4 rounded-2xl ${stat.color} text-white shadow-lg`}>
                  <stat.icon size={28} />
               </div>
               <span className={`flex items-center text-sm font-bold px-3 py-1 rounded-full ${stat.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {stat.change}
                  {stat.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
               </span>
             </div>
             <div className="mt-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.title}</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{stat.value}</p>
             </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Oylik to'lovlar jadvali (Placeholder) */}
         <Card className="lg:col-span-2 p-8 rounded-[2.5rem] border-none shadow-xl">
            <h3 className="text-xl font-black mb-6">Oylik to'lovlar tahlili</h3>
            <div className="h-64 flex items-end justify-between gap-2 px-4">
              {[
                { m: 'Yan', v: 40 }, { m: 'Fev', v: 65 }, { m: 'Mar', v: 45 }, 
                { m: 'Apr', v: 80 }, { m: 'May', v: 55 }, { m: 'Iyun', v: 90 }
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-primary-500 rounded-t-xl transition-all duration-500 hover:bg-primary-600" 
                    style={{ height: `${bar.v}%` }}
                  ></div>
                  <span className="text-[10px] font-bold text-gray-400">{bar.m}</span>
                </div>
              ))}
            </div>
         </Card>

         <Card className="p-8 rounded-[2.5rem] border-none shadow-xl">
            <h3 className="text-xl font-black mb-6">So'nggi buyurtmalar</h3>
            <div className="space-y-5">
               {userOrders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center text-primary-600">
                            <FileText size={20} />
                        </div>
                        <div>
                           <div className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{tr(order.documentTitle)}</div>
                           <div className="text-[10px] text-gray-400 font-medium">{order.date}</div>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="text-xs font-black text-blue-600">{order.amount.toLocaleString()} so‘m</div>
                        <Badge color={order.status === 'completed' ? 'green' : 'yellow'}>{order.status}</Badge>
                     </div>
                  </div>
               ))}
            </div>
         </Card>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-72 bg-gray-950 text-white transform transition-transform duration-300 lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col rounded-r-[3rem] lg:rounded-none`}>
        <div className="flex items-center justify-center h-24 border-b border-gray-800">
          <span className="text-2xl font-black tracking-tighter">ADMIN <span className="text-primary-500">PANEL</span></span>
        </div>
        <nav className="flex-1 mt-10 px-6 space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id as TabType); setSidebarOpen(false); }}
              className={`flex items-center w-full px-6 py-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-primary-600 text-white shadow-2xl shadow-primary-500/40' : 'text-gray-500 hover:bg-gray-900 hover:text-white'}`}
            >
              <item.icon className="w-5 h-5 mr-4" />
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-8 border-t border-gray-800">
           <button className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gray-800 flex items-center justify-center font-bold group-hover:bg-primary-600 transition-colors text-white">A</div>
              <div className="text-left">
                 <p className="text-xs font-black text-white">Asan Tolepov</p>
                 <p className="text-[10px] text-gray-500">Bosh admin</p>
              </div>
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white dark:bg-gray-800 shadow-sm px-10 flex justify-between items-center z-10 transition-colors">
           <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500"><Menu size={24} /></button>
              <h2 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tight">
                {menuItems.find(i => i.id === activeTab)?.label}
              </h2>
           </div>
           <div className="flex items-center gap-6">
              <button onClick={toggleTheme} className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-500">
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div className="relative p-3 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-500 cursor-pointer">
                 <Bell size={20} />
                 <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
              </div>
           </div>
        </header>
        
        <main className="flex-1 overflow-auto p-10">
           {activeTab === 'dashboard' && <DashboardView />}
           {activeTab === 'documents' && <div className="p-10 text-center text-gray-400">Hujjatlar boshqaruvi yuklanmoqda...</div>}
           {activeTab === 'settings' && <div className="p-10 text-center text-gray-400">Sozlamalar yuklanmoqda...</div>}
        </main>
      </div>
    </div>
  );
};