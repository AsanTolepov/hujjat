import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, onSnapshot, orderBy, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, Button } from '../components/UIComponents';
import { Download, FileText, X, ExternalLink, Clock, CreditCard, LogOut, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';

export const Profile = () => {
  const { user, logout, userData } = useAuth();
  const [balance, setBalance] = useState(0);
  const [docHistory, setDocHistory] = useState<any[]>([]);
  const [payHistory, setPayHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'DOCS' | 'PAYMENTS'>('DOCS');
  const [showModal, setShowModal] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;

    const unsubBalance = onSnapshot(doc(db, "users", user.uid), (s) => {
      if (s.exists()) setBalance(s.data().balance || 0);
    });

    const qDocs = query(collection(db, "user_documents"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
    const unsubDocs = onSnapshot(qDocs, (s) => setDocHistory(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    const qPays = query(collection(db, "payments"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
    const unsubPays = onSnapshot(qPays, (s) => setPayHistory(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    return () => { unsubBalance(); unsubDocs(); unsubPays(); };
  }, [user]);

  const handleTopUpClick = async () => {
    const newId = `HUJJAT-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(newId);
    setShowModal(true);
    setCopied(false);

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
    } catch (err) { console.error("Firebase xatosi:", err); }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* CHAP TOMON: PROFIL */}
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
          <button onClick={() => setActiveTab('DOCS')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${activeTab === 'DOCS' ? 'bg-white shadow-md border-l-4 border-blue-600 text-blue-600' : 'text-gray-500'}`}><Clock size={20} /> Hujjatlar</button>
          <button onClick={() => setActiveTab('PAYMENTS')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${activeTab === 'PAYMENTS' ? 'bg-white shadow-md border-l-4 border-blue-600 text-blue-600' : 'text-gray-500'}`}><CreditCard size={20} /> To'lovlar</button>
          <button onClick={logout} className="w-full flex items-center gap-3 p-4 text-red-600 font-bold hover:bg-red-50 rounded-2xl mt-6"><LogOut size={20} /> Chiqish</button>
        </div>
      </div>

      {/* O'NG TOMON: TARIX */}
      <div className="md:w-2/3">
        <Card className="shadow-sm overflow-hidden border-none bg-white dark:bg-gray-800 rounded-3xl min-h-[400px]">
          <div className="p-6 border-b dark:border-gray-700 font-black text-xl">{activeTab === 'DOCS' ? 'Yuklangan hujjatlar' : "To'lovlar tarixi"}</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-400 text-[10px] uppercase font-bold tracking-wider">
                <tr>
                  {activeTab === 'DOCS' ? (<><th>Hujjat</th><th className="text-center">Sana</th><th className="text-right px-6">Amal</th></>) : (<><th>To'lov ID</th><th className="text-center">Holat</th><th className="text-right px-6">Miqdor</th></>)}
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
                    <td className="px-6 py-4 font-bold text-sm">{p.orderId}</td>
                    <td className="text-center"><span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${p.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>{p.status === 'completed' ? 'Bajarildi' : 'Kutilmoqda'}</span></td>
                    <td className="text-right px-6 font-black text-blue-600">{p.amount?.toLocaleString() || 0} so'm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* MODAL: TO'LOV ID NUSXALASH */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 max-w-sm w-full relative shadow-2xl text-center">
            <button onClick={() => setShowModal(false)} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600"><X size={20} /></button>
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4"><CreditCard size={30} /></div>
            <h3 className="font-bold text-lg mb-4">To'lov ID raqami:</h3>
            
            <div 
              onClick={copyToClipboard}
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl mb-6 border-2 border-dashed border-blue-200 cursor-pointer hover:bg-blue-50 transition-all group flex items-center justify-center gap-3"
            >
              <span className="font-black text-blue-600 text-2xl tracking-widest">{orderId}</span>
              {copied ? <Check size={20} className="text-green-500" /> : <Copy size={18} className="text-gray-300 group-hover:text-blue-500" />}
            </div>
            
            <p className="text-gray-400 text-xs mb-6">Nusxalash uchun ID ustiga bosing va botga yuboring.</p>
            
            <Button className="w-full py-4 rounded-xl font-black text-lg flex gap-2 justify-center" onClick={() => window.open(`https://t.me/Hujjat_PaymentBot?start=${orderId}`, '_blank')}>
              <ExternalLink size={20} /> Botga o'tish
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};