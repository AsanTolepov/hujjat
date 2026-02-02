import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, onSnapshot, orderBy, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, Button } from '../components/UIComponents';
import { Download, FileText, X, ExternalLink, Clock, CreditCard, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';

export const Profile = () => {
  const { user, logout, userData } = useAuth();
  const [balance, setBalance] = useState(0);
  const [docHistory, setDocHistory] = useState<any[]>([]);
  const [payHistory, setPayHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'DOCS' | 'PAYMENTS'>('DOCS');
  const [showModal, setShowModal] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    if (!user) return;

    // 1. Balansni real vaqtda kuzatish
    const unsubBalance = onSnapshot(doc(db, "users", user.uid), (s) => {
      if (s.exists()) setBalance(s.data().balance || 0);
    });

    // 2. Hujjatlar tarixini yuklash
    // DIQQAT: Agar bu so'rov natija bermasa, brauzer konsolidagi (F12) link orqali Index yarating
    const qDocs = query(
      collection(db, "user_documents"), 
      where("userId", "==", user.uid), 
      orderBy("createdAt", "desc")
    );
    
    const unsubDocs = onSnapshot(qDocs, (s) => {
      const docs = s.docs.map(d => ({ id: d.id, ...d.data() }));
      console.log("Yuklangan hujjatlar:", docs); // Tekshirish uchun
      setDocHistory(docs);
    }, (error) => {
      console.error("Hujjatlarni yuklashda xato:", error);
    });

    // 3. To'lovlar tarixini yuklash
    const qPays = query(
      collection(db, "payments"), 
      where("userId", "==", user.uid), 
      orderBy("createdAt", "desc")
    );
    
    const unsubPays = onSnapshot(qPays, (s) => {
      const pays = s.docs.map(d => ({ id: d.id, ...d.data() }));
      console.log("To'lovlar tarixi:", pays); // Tekshirish uchun
      setPayHistory(pays);
    }, (error) => {
      console.error("To'lovlarni yuklashda xato:", error);
    });

    return () => { unsubBalance(); unsubDocs(); unsubPays(); };
  }, [user]);

  const handleTopUpClick = async () => {
    const newId = `HUJJAT-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(newId);
    setShowModal(true);

    try {
      if (user) {
        await addDoc(collection(db, "payments"), {
          orderId: newId, 
          userId: user.uid, 
          status: "pending", 
          amount: 0, 
          createdAt: serverTimestamp(),
          userName: userData?.name || user.email || "Asan Tolepov"
        });
      }
    } catch (err) {
      console.error("Firebase error:", err);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      
      {/* CHAP TOMON: PROFIL VA MENYU */}
      <div className="md:w-1/3 space-y-4">
        <Card className="p-8 text-center shadow-sm border-none bg-white dark:bg-gray-800 rounded-3xl">
          <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 uppercase">
            {userData?.name ? userData.name[0] : (user.email ? user.email[0] : 'U')}
          </div>
          <h2 className="text-2xl font-black dark:text-white mb-1">{userData?.name || "Asan Tolepov"}</h2>
          <p className="text-gray-500 text-sm mb-6">{user.email}</p>
          
          <div className="flex justify-between items-center py-4 border-t dark:border-gray-700">
            <span className="text-gray-500 font-bold">Balans:</span>
            <span className="text-green-600 font-black text-xl">{balance.toLocaleString()} so'm</span>
          </div>
          
          <Button onClick={handleTopUpClick} className="w-full py-3 rounded-2xl font-bold shadow-lg" variant="outline">
            Hisobni to'ldirish
          </Button>
        </Card>

        <div className="space-y-2">
          <button 
            onClick={() => setActiveTab('DOCS')}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${activeTab === 'DOCS' ? 'bg-white shadow-md border-l-4 border-blue-600 dark:bg-gray-800 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Clock size={20} /> Hujjatlar tarixi
          </button>
          <button 
            onClick={() => setActiveTab('PAYMENTS')}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${activeTab === 'PAYMENTS' ? 'bg-white shadow-md border-l-4 border-blue-600 dark:bg-gray-800 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <CreditCard size={20} /> To'lovlar tarixi
          </button>
          <button onClick={logout} className="w-full flex items-center gap-3 p-4 text-red-600 font-bold hover:bg-red-50 rounded-2xl mt-6 transition-all">
            <LogOut size={20} /> Chiqish
          </button>
        </div>
      </div>

      {/* O'NG TOMON: TARIX JADVALI */}
      <div className="md:w-2/3">
        <Card className="shadow-sm overflow-hidden border-none bg-white dark:bg-gray-800 rounded-3xl min-h-[400px]">
          <div className="p-6 border-b dark:border-gray-700">
            <h3 className="text-xl font-black dark:text-white">
              {activeTab === 'DOCS' ? 'Yuklangan hujjatlar' : "To'lovlar tarixi"}
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-400 text-[10px] uppercase font-bold tracking-wider">
                <tr>
                  {activeTab === 'DOCS' ? (
                    <>
                      <th className="px-6 py-4">Hujjat</th>
                      <th className="px-6 py-4 text-center">Format</th>
                      <th className="px-6 py-4 text-center">Sana</th>
                      <th className="px-6 py-4 text-right">Amal</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-4">To'lov ID</th>
                      <th className="px-6 py-4 text-center">Holat</th>
                      <th className="px-6 py-4 text-center">Sana</th>
                      <th className="px-6 py-4 text-right">Miqdor</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {activeTab === 'DOCS' ? (
                  docHistory.length > 0 ? docHistory.map((h) => (
                    <tr key={h.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-sm dark:text-white">{h.title}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${h.format === 'PDF' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{h.format || 'PDF'}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-400 text-xs">
                        {h.createdAt?.toDate ? h.createdAt.toDate().toLocaleDateString() : 'Hozir'}
                      </td>
                      <td className="px-6 py-4 text-right"><Download size={18} className="text-blue-600 ml-auto cursor-pointer" /></td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} className="p-10 text-center text-gray-400 italic">Hujjatlar topilmadi</td></tr>
                  )
                ) : (
                  payHistory.length > 0 ? payHistory.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-sm dark:text-white">{p.orderId}</td>
                      <td className="px-6 py-4 text-center">
                        {p.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1 text-green-600 font-bold text-[10px] bg-green-50 px-2 py-1 rounded-lg">
                            <CheckCircle2 size={12} /> Bajarildi
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-orange-600 font-bold text-[10px] bg-orange-50 px-2 py-1 rounded-lg">
                            <AlertCircle size={12} /> Kutilmoqda
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-400 text-xs">
                        {p.createdAt?.toDate ? p.createdAt.toDate().toLocaleDateString() : 'Hozir'}
                      </td>
                      <td className="px-6 py-4 text-right font-black text-blue-600">
                        {p.amount ? `+${p.amount.toLocaleString()}` : '0'} so'm
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} className="p-10 text-center text-gray-400 italic">To'lovlar topilmadi</td></tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* MODAL OYNA */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 max-w-sm w-full relative shadow-2xl text-center scale-in-center">
            <button onClick={() => setShowModal(false)} className="absolute right-8 top-8 text-gray-400 hover:text-gray-600"><X size={24} /></button>
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6"><CreditCard size={32} /></div>
            <h3 className="font-black text-xl dark:text-white mb-2 tracking-tight">To'lov ID:</h3>
            <div className="bg-gray-100 dark:bg-gray-700 py-3 px-6 rounded-2xl mb-4 border-2 border-dashed border-blue-200">
                <span className="font-black text-blue-600 text-2xl tracking-widest">{orderId}</span>
            </div>
            <p className="text-gray-500 text-xs mb-8 leading-relaxed">Ushbu ID-ni botga yuboring va to'lovni tasdiqlang.</p>
            <Button className="w-full py-4 rounded-2xl font-black text-lg flex gap-2 justify-center shadow-blue-200 shadow-xl" onClick={() => window.open(`https://t.me/hujjatuz_bot?start=${orderId}`, '_blank')}>
              <ExternalLink size={20} /> Botga o'tish
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};