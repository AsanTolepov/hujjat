import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, Button } from '../components/UIComponents';
import { CreditCard, ExternalLink, Copy, Check, Zap } from 'lucide-react';

export const TopUp = () => {
  const { user } = useAuth();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Localhostda keshni tekshirish uchun indicator
  useEffect(() => {
    console.log("TopUp komponenti yuklandi - Versiya 2.0");
  }, []);

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
        amount: 0,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Firestore xatosi:", err);
    }
  };

  const copyToClipboard = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      {/* Sarlavha qismiga yangi rang va belgi qo'shildi */}
      <Card className="p-8 text-center border-t-4 border-indigo-500 shadow-2xl rounded-[2.5rem] dark:bg-gray-800 transition-all duration-500">
        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
            <Zap size={40} fill="currentColor" />
        </div>
        
        <h2 className="text-3xl font-black dark:text-white mb-2 italic">
          Tezkor To'lov
        </h2>
        <p className="text-gray-400 text-sm mb-8">Balansni to'ldirish uchun ID raqamdan foydalaning</p>
        
        {!orderId ? (
          <Button 
            onClick={generateID} 
            className="w-full py-5 rounded-2xl font-black text-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-transform active:scale-95"
          >
            ID RAQAM OLISH
          </Button>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* Nusxalash bloki */}
            <div 
              onClick={copyToClipboard}
              className={`p-6 rounded-3xl border-2 transition-all cursor-pointer group ${
                copied ? 'border-green-500 bg-green-50' : 'border-indigo-100 bg-gray-50 dark:bg-gray-700/30 dark:border-gray-600 hover:border-indigo-300'
              }`}
            >
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">To'lov identifikatori</span>
              <div className="flex items-center justify-center gap-4 mt-2">
                <code className="text-3xl font-mono font-black text-gray-800 dark:text-white">
                  {orderId}
                </code>
                {copied ? (
                  <Check size={24} className="text-green-500 animate-bounce" />
                ) : (
                  <Copy size={24} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
                )}
              </div>
              <p className={`text-[10px] mt-2 font-medium ${copied ? 'text-green-600' : 'text-gray-400'}`}>
                {copied ? "Muvaffaqiyatli nusxalandi!" : "Nusxalash uchun ustiga bosing"}
              </p>
            </div>

            {/* Botga o'tish tugmasi */}
            <div className="pt-2">
              <Button 
                className="w-full py-5 rounded-3xl font-bold text-lg flex gap-3 justify-center items-center bg-blue-500 hover:bg-blue-600 shadow-xl" 
                onClick={() => window.open(`https://t.me/Hujjat_PaymentBot?start=${orderId}`, '_blank')}
              >
                <ExternalLink size={22} /> Telegram Botga O'tish
              </Button>
              
              <button 
                onClick={() => setOrderId(null)}
                className="mt-6 text-sm text-gray-400 hover:text-indigo-500 font-semibold transition-colors"
              >
                ← Qaytish va yangi ID olish
              </button>
            </div>
          </div>
        )}
      </Card>
      
      {/* Localhostda ekanligingizni eslatuvchi kichik belgi */}
      <div className="mt-8 text-center">
        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded-full uppercase tracking-tighter">
          Local Development Mode
        </span>
      </div>
    </div>
  );
};