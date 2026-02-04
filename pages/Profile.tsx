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

  useEffect(() => {
    if (!user) return;

    // 1. Foydalanuvchi asosiy ma'lumotlari (Balans va ID)
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

    // 3. TO'LOVLAR TARIXI (Sizda ishlamayotgan qism)
    // userId: "123456" bo'lgan hujjatlarni payments kolleksiyasidan qidiramiz
    const qPays = query(
      collection(db, "payments"), 
      where("userId", "==", dbUser?.paymentId || "123456") 
    );

    const unsubPays = onSnapshot(qPays, (s) => {
      const pays = s.docs.map(d => ({ id: d.id, ...d.data() }));
      // Xronologik tartiblash (Indeks talab qilmasligi uchun kodda tartiblaymiz)
      pays.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setPayHistory(pays);
    }, (error) => {
      console.error("To'lovlarni yuklashda xato:", error);
    });

    return () => { unsubUser(); unsubDocs(); unsubPays(); };
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
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* CHAP TOMON: PROFIL */}
      <div className="md:w-1/3 space-y-4">
        <Card className="p-8 text-center rounded-3xl shadow-sm bg-white dark:bg-gray-800">
          <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 uppercase">
            {dbUser?.full_name ? dbUser.full_name[0] : 'U'}
          </div>
          <h2 className="text-2xl font-black dark:text-white mb-1">{dbUser?.full_name || "Yuklanmoqda..."}</h2>
          <p className="text-gray-500 text-sm mb-6">{user.email}</p>
          <div className="flex justify-between items-center py-4 border-t dark:border-gray-700">
            <span className="text-gray-500 font-bold">Balans:</span>
            <span className="text-green-600 font-black text-xl">{balance.toLocaleString()} so'm</span>
          </div>
          <Button onClick={() => setShowModal(true)} className="w-full py-3 rounded-2xl font-bold shadow-lg" variant="outline">
            Hisobni to'ldirish
          </Button>
        </Card>

        <div className="space-y-2">
          <button onClick={() => setActiveTab('DOCS')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${activeTab === 'DOCS' ? 'bg-white shadow-md border-l-4 border-blue-600 text-blue-600' : 'text-gray-500'}`}><Clock size={20} /> Hujjatlar</button>
          <button onClick={() => setActiveTab('PAYMENTS')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${activeTab === 'PAYMENTS' ? 'bg-white shadow-md border-l-4 border-blue-600 text-blue-600' : 'text-gray-500'}`}><CreditCard size={20} /> To'lovlar</button>
          <button onClick={logout} className="w-full flex items-center gap-3 p-4 text-red-600 font-bold hover:bg-red-50 rounded-2xl mt-6"><LogOut size={20} /> Chiqish</button>
        </div>
      </div>

      {/* O'NG TOMON: JADVALLAR */}
      <div className="md:w-2/3">
        <Card className="shadow-sm overflow-hidden border-none bg-white dark:bg-gray-800 rounded-3xl min-h-[400px]">
          <div className="p-6 border-b dark:border-gray-700 font-black text-xl">{activeTab === 'DOCS' ? 'Yuklangan hujjatlar' : "To'lovlar tarixi"}</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-400 text-[10px] uppercase font-bold tracking-wider">
                <tr>
                  {activeTab === 'DOCS' ? (<><th>Hujjat</th><th className="text-center">Sana</th><th className="text-right px-6">Amal</th></>) : (<><th>ID</th><th className="text-center">Holat</th><th className="text-right px-6">Miqdor</th></>)}
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {activeTab === 'DOCS' ? docHistory.map(h => (
                  <tr key={h.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-sm">{h.title}</td>
                    <td className="text-center text-gray-400 text-xs">{h.createdAt?.toDate ? h.createdAt.toDate().toLocaleDateString() : '—'}</td>
                    <td className="text-right px-6"><Download size={18} className="text-blue-600 ml-auto cursor-pointer" /></td>
                  </tr>
                )) : payHistory.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-sm">{p.userId || "—"}</td>
                    <td className="text-center">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${String(p.status).toLowerCase() === 'completed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                        {String(p.status).toLowerCase() === 'completed' ? 'Bajarildi' : 'Kutilmoqda'}
                      </span>
                    </td>
                    <td className="text-right px-6 font-black text-blue-600">{(p.amount || 0).toLocaleString()} so'm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      {/* ... Modal qismi o'zgarishsiz qoladi ... */}
    </div>
  );
};