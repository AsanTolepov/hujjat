import React, { useState, useEffect } from 'react';
import { BarChart, Users, FileText, Settings, DollarSign, Plus, Search, Bell, Menu, ArrowUpRight, ArrowDownRight, CreditCard, Download, Sun, Moon } from 'lucide-react';
import { Card, Button, Badge, Input, Select } from '../components/UIComponents';
import { documents, userOrders, categories } from '../data/mockData';
import { LanguageSwitcher } from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';

type TabType = 'dashboard' | 'documents' | 'users' | 'finance' | 'settings';

export const Admin = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { t, tr } = useLanguage();

  useEffect(() => {
     // Check initial theme
     const isDarkMode = document.documentElement.classList.contains('dark');
     setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  };

  const menuItems = [
    { id: 'dashboard', label: t('admin.menu.dashboard'), icon: BarChart },
    { id: 'documents', label: t('admin.menu.docs'), icon: FileText },
    { id: 'users', label: t('admin.menu.users'), icon: Users },
    { id: 'finance', label: t('admin.menu.finance'), icon: DollarSign },
    { id: 'settings', label: t('admin.menu.settings'), icon: Settings },
  ];

  // --- Views ---

  const DashboardView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Jami foydalanuvchilar', value: '1,234', change: '+12%', isPositive: true, icon: Users, color: 'bg-blue-500' },
          { title: 'Jami hujjatlar', value: '12,543', change: '+5%', isPositive: true, icon: FileText, color: 'bg-green-500' },
          { title: 'Bugungi tushum', value: '2.5 mln', change: '-2%', isPositive: false, icon: DollarSign, color: 'bg-yellow-500' },
          { title: 'Yangi buyurtmalar', value: '45', change: '+18%', isPositive: true, icon: BarChart, color: 'bg-purple-500' },
        ].map((stat, i) => (
          <Card key={i} className="p-6">
             <div className="flex items-center justify-between">
               <div className={`p-3 rounded-full ${stat.color} text-white`}>
                  <stat.icon size={24} />
               </div>
               <span className={`flex items-center text-sm font-medium ${stat.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {stat.change}
                  {stat.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
               </span>
             </div>
             <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">{tr(stat.title)}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
             </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">So'nggi buyurtmalar</h3>
            <div className="space-y-4">
               {userOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                     <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded flex items-center justify-center text-primary-600 dark:text-primary-400">
                           <FileText size={20} />
                        </div>
                        <div>
                           <div className="font-medium text-gray-900 dark:text-white">{tr(order.documentTitle)}</div>
                           <div className="text-xs text-gray-500 dark:text-gray-400">{order.date}</div>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="font-bold text-gray-900 dark:text-white">{order.amount > 0 ? order.amount.toLocaleString() : '0'} so‘m</div>
                        <Badge color={order.status === 'completed' ? 'green' : 'yellow'}>{order.status}</Badge>
                     </div>
                  </div>
               ))}
            </div>
         </Card>
         <Card className="p-6">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Server holati</h3>
             <div className="space-y-4">
                <div>
                   <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">CPU Bandligi</span>
                      <span className="font-medium text-gray-900 dark:text-white">45%</span>
                   </div>
                   <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-primary-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                   </div>
                </div>
                <div>
                   <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Xotira (RAM)</span>
                      <span className="font-medium text-gray-900 dark:text-white">60%</span>
                   </div>
                   <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                   </div>
                </div>
             </div>
         </Card>
      </div>
    </div>
  );

  const DocumentsView = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
       <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="font-bold text-gray-800 dark:text-white text-lg">Hujjatlar ro‘yxati</h3>
          <div className="flex gap-2 w-full sm:w-auto">
             <div className="relative flex-grow sm:flex-grow-0">
                <input type="text" placeholder="Qidirish..." className="pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500 w-full bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" />
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
             </div>
             <Button size="sm"><Plus size={16} className="mr-1"/> Yangi</Button>
          </div>
       </div>
       <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
             <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nomi</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Kategoriya</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Narx (PDF)</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amallar</th>
                </tr>
             </thead>
             <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {documents.map((doc) => (
                   <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{tr(doc.title)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <Badge color="blue">{tr(categories.find(c => c.id === doc.categoryId)?.name || doc.categoryId)}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{doc.pricePdf.toLocaleString()} so‘m</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">Faol</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                         <button className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 mr-4">Tahrirlash</button>
                         <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">O‘chirish</button>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );

  // Other views can remain untranslated for brevity in this response or follow the same pattern
  const UsersView = () => (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-gray-500 dark:text-gray-400 text-center">
         Foydalanuvchilar bo'limi (Demo)
      </div>
  );

  const FinanceView = () => (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-gray-500 dark:text-gray-400 text-center">
         Moliya bo'limi (Demo)
      </div>
  );

  const SettingsView = () => (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-gray-500 dark:text-gray-400 text-center">
         Sozlamalar bo'limi (Demo)
      </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden transition-colors">
      {/* Sidebar */}
      <div 
        className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 dark:bg-gray-950 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="flex items-center justify-center h-16 bg-gray-800 dark:bg-gray-900 border-b border-gray-700 flex-shrink-0">
          <span className="text-xl font-bold tracking-wider">{t('admin.panel')}</span>
        </div>
        <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as TabType);
                setSidebarOpen(false);
              }}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? 'bg-primary-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:bg-gray-800 dark:hover:bg-gray-900 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800 dark:border-gray-900 flex-shrink-0">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                 A
              </div>
              <div>
                 <p className="text-sm font-medium text-white">Admin User</p>
                 <p className="text-xs text-gray-500">admin@hujjat.uz</p>
              </div>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow-sm py-3 px-6 flex justify-between items-center z-10 transition-colors">
           <div className="flex items-center">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mr-4 text-gray-500 dark:text-gray-400 focus:outline-none"
              >
                <Menu size={24} />
              </button>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {menuItems.find(i => i.id === activeTab)?.label}
              </h2>
           </div>
           <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button className="relative p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                 <Bell size={20} />
                 <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </button>
              <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
           </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6 bg-gray-100 dark:bg-gray-900 transition-colors">
           {activeTab === 'dashboard' && <DashboardView />}
           {activeTab === 'documents' && <DocumentsView />}
           {activeTab === 'users' && <UsersView />}
           {activeTab === 'finance' && <FinanceView />}
           {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
};