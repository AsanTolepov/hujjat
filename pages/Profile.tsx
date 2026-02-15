import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, onSnapshot, orderBy, doc } from 'firebase/firestore';
import { Card, Button } from '../components/UIComponents';
import { Download, X, ExternalLink, Clock, CreditCard, LogOut, Copy, CheckCircle2 } from 'lucide-react';

export const Profile = () => {
  const { user, logout } = useAuth();
  const [dbUser, setDbUser] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [docHistory, setDocHistory] = useState<any[]>([]);
  const [payHistory, setPayHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'DOCS' | 'PAYMENTS'>('DOCS');
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // Yashil xabar holati

  // Muvaffaqiyatli xabar (Toast) 3 soniyada go'yib bo'lishi uchun
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  useEffect(() => {
    if (!user) return;

    // 1. Foydalanuvchi ma'lumotlarini real-vaqtda olish
    const unsubUser = onSnapshot(doc(db, "users", user.uid), (s) => {
      if (s.exists()) {
        const data = s.data();
        setDbUser(data);
        setBalance(data.balance || 0);
      }
    });

    // 2. Yuklangan hujjatlar tarixi
    const qDocs = query(
      collection(db, "user_documents"), 
      where("userId", "==", user.uid), 
      orderBy("createdAt", "desc")
    );
    const unsubDocs = onSnapshot(qDocs, (s) => setDocHistory(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    return () => { unsubUser(); unsubDocs(); };
  }, [user]);

  useEffect(() => {
    if (!user || !dbUser?.paymentId) return;

    const qPays = query(
      collection(db, "payments"), 
      where("userId", "==", dbUser.paymentId) 
    );

    const unsubPays = onSnapshot(qPays, (s) => {
      const pays = s.docs.map(d => ({ id: d.id, ...d.data() }));
      pays.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setPayHistory(pays);
    });

    return () => unsubPays();
  }, [user, dbUser?.paymentId]);

  const copyToClipboard = () => {
    if (dbUser?.paymentId) {
      navigator.clipboard.writeText(dbUser.paymentId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 min-h-screen transition-colors duration-300">
      
      {/* MUVAFFAQIYATLI XABAR (TOAST) - 3 soniyada yo'qoladi */}
      {showSuccess && (
        <div className="fixed top-24 right-6 z-999 animate-in fade-in slide-in-from-right-10 duration-500">
          <div className="bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold">
            <CheckCircle2 size={24} />
            <span>Xarid muvaffaqiyatli! Yuklanmoqda...</span>
          </div>
        </div>
      )}

      {/* CHAP TOMON: PROFIL VA GOOGLE AVATAR */}
      <div className="md:w-1/3 space-y-6">
        <Card className="p-8 text-center rounded-4xl shadow-xl bg-white dark:bg-gray-800 border-none relative overflow-hidden">
          {/* Bezakli fon (Tailwind v4 standartida bg-linear-to-r) */}
          <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-r from-blue-600/10 to-indigo-600/10"></div>
          
          {/* Google Avatar (Sifatli ko'rinish) */}
          <div className="relative z-10 w-32 h-32 mx-auto mb-6">
            {user?.photoURL ? (
              <img 
                src={user.photoURL.replace('s96-c', 's300-c')} // Sifatni oshirish
                alt="Profile" 
                className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-2xl ring-4 ring-blue-50 dark:ring-blue-900/10"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-blue-500 to-indigo-700 text-white rounded-full flex items-center justify-center text-4xl font-black uppercase shadow-lg border-4 border-white dark:border-gray-700">
                {dbUser?.full_name ? dbUser.full_name[0] : 'U'}
              </div>
            )}
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white dark:border-gray-800 rounded-full"></div>
          </div>

          {/* ISMNI RANGI: LIGHT MODEDA QORA, DARK MODEDA OQ */}
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1 tracking-tight transition-colors duration-300">
            {dbUser?.full_name || user?.displayName || "Foydalanuvchi"}
          </h2>
          <p className="text-gray-400 text-sm mb-6 font-medium">{user.email}</p>
          
          <div className="flex justify-between items-center py-5 border-t border-gray-100 dark:border-gray-700/50">
            <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Balans</span>
            <span className="text-blue-600 dark:text-blue-400 font-black text-2xl">{balance.toLocaleString()} so'm</span>
          </div>
          
          <Button 
            onClick={() => setShowModal(true)} 
            className="w-full py-4 rounded-2xl font-black shadow-lg shadow-blue-200 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all"
          >
            Hisobni to'ldirish
          </Button>
        </Card>

        {/* Navigatsiya Menyusi */}
        <div className="bg-white/50 dark:bg-gray-800/50 p-2 rounded-4xl backdrop-blur-md transition-colors duration-300">
          <button 
            onClick={() => setActiveTab('DOCS')} 
            className={`w-full flex items-center gap-4 p-4 rounded-3xl font-bold transition-all ${activeTab === 'DOCS' ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600' : 'text-gray-400'}`}
          >
            <Clock size={22} /> Hujjatlar
          </button>
          <button 
            onClick={() => setActiveTab('PAYMENTS')} 
            className={`w-full flex items-center gap-4 p-4 rounded-3xl font-bold transition-all ${activeTab === 'PAYMENTS' ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600' : 'text-gray-400'}`}
          >
            <CreditCard size={22} /> To'lovlar
          </button>
          <button 
            onClick={logout} 
            className="w-full flex items-center gap-4 p-4 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 rounded-3xl mt-4 transition-all"
          >
            <LogOut size={22} /> Chiqish
          </button>
        </div>
      </div>

      {/* O'NG TOMON: JADVAL */}
      <div className="md:w-2/3">
        <Card className="shadow-xl border-none bg-white dark:bg-gray-800 rounded-4xl overflow-hidden min-h-[550px] transition-colors duration-300">
          <div className="p-8 border-b dark:border-gray-700/50 flex justify-between items-center">
            <h3 className="font-black text-2xl text-gray-800 dark:text-white tracking-tight">
              {activeTab === 'DOCS' ? 'Hujjatlar tarixi' : "To'lovlar tarixi"}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 dark:bg-gray-900/20 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                <tr>
                  {activeTab === 'DOCS' ? (
                    <><th className="px-8 py-4">Nomi</th><th className="text-center">Sana</th><th className="text-right px-8">Amal</th></>
                  ) : (
                    <><th className="px-8 py-4">ID</th><th className="text-center">Holat</th><th className="text-right px-8">Miqdor</th></>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700/50">
                {activeTab === 'DOCS' ? (
                  docHistory.map(h => (
                    <tr key={h.id} className="hover:bg-blue-50/30 dark:hover:bg-gray-700/30 transition-colors group">
                      <td className="px-8 py-5 font-bold text-gray-700 dark:text-gray-200">{h.title}</td>
                      <td className="text-center text-gray-400 text-sm">
                        {h.createdAt?.toDate ? h.createdAt.toDate().toLocaleDateString() : '—'}
                      </td>
                      <td className="text-right px-8">
                        <Download size={20} className="text-blue-500 ml-auto cursor-pointer hover:scale-110 transition-transform" />
                      </td>
                    </tr>
                  ))
                ) : (
                  payHistory.map(p => (
                    <tr key={p.id} className="hover:bg-blue-50/30 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-8 py-5 font-mono text-xs text-blue-600 font-bold">{p.userId || "—"}</td>
                      <td className="text-center">
                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${String(p.status).toLowerCase() === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {String(p.status).toLowerCase() === 'completed' ? 'Bajarildi' : 'Kutilmoqda'}
                        </span>
                      </td>
                      <td className="text-right px-8 font-black text-gray-900 dark:text-white">{(p.amount || 0).toLocaleString()} so'm</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <Card className="bg-white dark:bg-gray-800 rounded-4xl p-10 max-w-sm w-full relative shadow-2xl border-none">
            <button onClick={() => setShowModal(false)} className="absolute right-8 top-8 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <CreditCard size={36} />
            </div>
            <h3 className="font-black text-2xl mb-2 dark:text-white text-center">To'lov qilish</h3>
            <div 
              onClick={copyToClipboard}
              className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl mb-8 border-2 border-dashed border-blue-200 cursor-pointer flex items-center justify-center gap-4 group"
            >
              <span className="font-black text-blue-600 text-3xl tracking-widest">{dbUser?.paymentId || "—"}</span>
              {copied ? <CheckCircle2 size={24} className="text-green-500" /> : <Copy size={20} className="text-gray-300 group-hover:text-blue-500" />}
            </div>
            <Button 
              className="w-full py-5 rounded-2xl font-black text-lg flex gap-3 justify-center shadow-xl" 
              onClick={() => window.open(`https://t.me/Hujjat_PaymentBot?start=${dbUser?.paymentId}`, '_blank')}
            >
              <ExternalLink size={20} /> Botga o'tish
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};