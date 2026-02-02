import React, { useState } from 'react';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, Button } from '../components/UIComponents';
import { CreditCard, ExternalLink, Copy, Check } from 'lucide-react';

export const TopUp = () => {
  const { user } = useAuth();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateID = async () => {
    if (!user) return;
    
    const newId = `HUJJAT-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(newId);

    try {
      await addDoc(collection(db, "payments"), {
        orderId: newId,
        userId: user.uid,
        userName: user.displayName || user.email,
        status: "pending",
        amount: 0, // Botda yangilanadi
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Xatolik yuz berdi:", err);
    }
  };

  const copyToClipboard = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2 soniyadan keyin piktogrammani qaytaradi
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <Card className="p-8 text-center border-t-4 border-blue-600 shadow-xl rounded-[2rem] dark:bg-gray-800">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CreditCard size={32} />
        </div>
        <h2 className="text-2xl font-black dark:text-white mb-2 tracking-tight">Hisobni to'ldirish</h2>
        <p className="text-gray-500 text-sm mb-6">Xizmatlardan foydalanish uchun balansingizni to'ldiring</p>
        
        {!orderId ? (
          <Button onClick={generateID} className="w-full py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 dark:shadow-none">
            To'lov ID olish
          </Button>
        ) : (
          <div className="mt-6 space-y-4 animate-in fade-in zoom-in duration-300">
            <div 
              onClick={copyToClipboard}
              className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-900 cursor-pointer hover:bg-blue-50 transition-all group relative"
            >
              <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Sizning To'lov ID raqamingiz</p>
              <div className="flex items-center justify-center gap-3">
                <p className="text-3xl font-black text-blue-600 tracking-widest">{orderId}</p>
                {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} className="text-blue-300 group-hover:text-blue-600" />}
              </div>
              {copied && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] px-2 py-1 rounded-full font-bold">Nusxalandi!</span>}
            </div>
            
            <p className="text-[11px] text-gray-400 px-4">
                ID raqamni nusxalash uchun ustiga bosing va quyidagi tugma orqali botga yuboring.
            </p>

            <Button 
              className="w-full py-4 rounded-2xl font-black text-lg flex gap-2 justify-center shadow-xl shadow-blue-100 dark:shadow-none" 
              onClick={() => window.open(`https://t.me/Hujjat_PaymentBot?start=${orderId}`, '_blank')}
            >
              <ExternalLink size={20} /> Telegram Botga o'tish
            </Button>
            
            <button 
                onClick={() => setOrderId(null)} 
                className="text-xs text-gray-400 hover:text-blue-600 font-medium underline transition-all"
            >
                Yangi ID yaratish
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};