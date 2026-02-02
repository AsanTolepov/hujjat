import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, FileText, Settings, DollarSign, 
  Menu, ArrowUpRight, ArrowDownRight, Sun, 
  Moon, Bell, LogOut 
} from 'lucide-react';
import { Card, Badge } from '../components/UIComponents';

type TabType = 'dashboard' | 'documents' | 'settings';

export const Admin = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  // Oylik ma'lumotlar
  const monthlyStats = [
    { month: 'Yanvar', users: 120, amount: 1500000 },
    { month: 'Fevral', users: 210, amount: 2800000 },
    { month: 'Mart', users: 180, amount: 2100000 },
    { month: 'Aprel', users: 320, amount: 4500000 },
    { month: 'May', users: 280, amount: 3800000 },
    { month: 'Iyun', users: 450, amount: 5900000 },
  ];

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    // Admin seansini tugatish
    navigate('/auth');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Umumiy ko‘rsatkichlar', icon: BarChart },
    { id: 'documents', label: 'Hujjatlar', icon: FileText },
    { id: 'settings', label: 'Sozlamalar', icon: Settings },
  ];

  const DashboardView = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Kartalar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Jami foydalanuvchilar', value: '1,234', change: '+12%', isPositive: true, icon: BarChart, color: 'bg-blue-500' },
          { title: 'Jami hujjatlar', value: '12,543', change: '+5%', isPositive: true, icon: FileText, color: 'bg-green-500' },
          { title: 'Jami summa', value: '45.8 mln', change: '+18%', isPositive: true, icon: DollarSign, color: 'bg-purple-500' },
        ].map((stat, i) => (
          <Card key={i} className="p-8 rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-gray-800 transition-all hover:translate-y-[-5px]">
             <div className="flex items-center justify-between">
               <div className={`p-4 rounded-2xl ${stat.color} text-white shadow-lg`}>
                  <stat.icon size={28} />
               </div>
               <Badge color={stat.isPositive ? 'green' : 'red'} className="py-1 px-3">
                  {stat.change} {stat.isPositive ? <ArrowUpRight size={14} className="inline ml-1"/> : <ArrowDownRight size={14} className="inline ml-1"/>}
               </Badge>
             </div>
             <div className="mt-6 text-left">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{stat.title}</p>
                <p className="text-4xl font-black text-gray-900 dark:text-white mt-2">{stat.value}</p>
             </div>
          </Card>
        ))}
      </div>

      {/* Oylik tahlil jadvali */}
      <Card className="p-10 rounded-[3rem] border-none shadow-2xl bg-white dark:bg-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div className="text-left">
            <h3 className="text-2xl font-black text-gray-800 dark:text-white uppercase tracking-tight">Oylik tahlil jadvali</h3>
            <p className="text-sm text-gray-400 mt-1 font-medium italic">Foydalanuvchilar soni va jami tushum o'rtasidagi nisbat</p>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400">
              <span className="w-3 h-3 bg-indigo-400 rounded-full shadow-sm"></span> Foydalanuvchilar
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400">
              <span className="w-3 h-3 bg-indigo-700 rounded-full shadow-sm"></span> Jami Summa
            </div>
          </div>
        </div>

        <div className="h-80 flex items-end justify-between gap-4 md:gap-8 px-4 border-b border-gray-100 dark:border-gray-700 pb-2">
          {monthlyStats.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
              {/* Tooltip */}
              <div className="absolute bottom-full mb-4 hidden group-hover:flex flex-col items-center z-20 animate-in zoom-in duration-200">
                <div className="bg-gray-900 text-white p-4 rounded-2xl text-[10px] shadow-2xl min-w-[140px] text-left">
                   <p className="text-indigo-300 mb-1 font-bold italic">👤 {item.users.toLocaleString()} FOYDALANUVCHI</p>
                   <p className="text-white font-black text-sm tracking-wide">💰 {item.amount.toLocaleString()} SO'M</p>
                </div>
                <div className="w-2 h-2 bg-gray-900 rotate-45 -mt-1"></div>
              </div>

              {/* Ustunlar */}
              <div className="flex items-end gap-2 w-full h-full">
                <div className="flex-1 bg-indigo-400 rounded-t-xl transition-all duration-300 group-hover:bg-indigo-300 cursor-pointer shadow-md" style={{ height: `${(item.users / 500) * 100}%` }}></div>
                <div className="flex-1 bg-indigo-700 rounded-t-xl transition-all duration-300 group-hover:bg-indigo-600 cursor-pointer shadow-lg shadow-indigo-200/50" style={{ height: `${(item.amount / 6000000) * 100}%` }}></div>
              </div>
              <span className="text-[10px] font-black text-gray-400 mt-4 uppercase tracking-tighter">{item.month}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans transition-colors duration-500">
      
      {/* YON PANEL (SIDEBAR) */}
      <div className={`fixed inset-y-0 left-0 z-30 w-80 bg-gray-950 text-white transform transition-transform duration-300 lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col rounded-r-[3rem] lg:rounded-none shadow-2xl`}>
        <div className="flex items-center justify-center h-24 border-b border-gray-900">
          <span className="text-2xl font-black tracking-tighter">ADMIN <span className="text-primary-500">PANEL</span></span>
        </div>
        
        <nav className="flex-1 mt-10 px-8 space-y-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id as TabType); setSidebarOpen(false); }}
              className={`flex items-center w-full px-6 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-widest ${activeTab === item.id ? 'bg-primary-600 text-white shadow-2xl shadow-primary-500/40' : 'text-gray-500 hover:bg-gray-900 hover:text-white'}`}
            >
              <item.icon className="w-5 h-5 mr-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* CHIQUISH TUGMASI (PASTDA) */}
        <div className="p-8 border-t border-gray-900">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-4 p-4 text-red-500 font-black hover:bg-red-500/10 rounded-2xl transition-all text-xs uppercase tracking-[0.2em]"
           >
              <LogOut size={20} /> Chiqish
           </button>
        </div>
      </div>

      {/* ASOSIY QISM */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 bg-white dark:bg-gray-800 shadow-sm px-12 flex justify-between items-center z-10 transition-colors">
           <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500"><Menu size={24} /></button>
              <h2 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tighter italic">
                {menuItems.find(i => i.id === activeTab)?.label}
              </h2>
           </div>
           
           <div className="flex items-center gap-6">
              {/* DARK MODE TUGMASI (TEPADA) */}
              <button 
                onClick={toggleTheme} 
                className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-500 hover:text-primary-600 transition-all shadow-sm"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <div className="relative p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-500 cursor-pointer shadow-sm group">
                 <Bell size={20} className="group-hover:animate-ring" />
                 <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-gray-700"></span>
              </div>
           </div>
        </header>
        
        <main className="flex-1 overflow-auto p-12">
           {activeTab === 'dashboard' && <DashboardView />}
           {activeTab === 'documents' && <div className="p-20 text-center font-black text-gray-300 uppercase italic tracking-[0.5em] animate-pulse">Hujjatlar yuklanmoqda...</div>}
           {activeTab === 'settings' && <div className="p-20 text-center font-black text-gray-300 uppercase italic tracking-[0.5em] animate-pulse">Sozlamalar yuklanmoqda...</div>}
        </main>
      </div>
    </div>
  );
};