import React, { useState } from 'react';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, Button } from '../components/UIComponents';
import { CreditCard, ExternalLink } from 'lucide-react';

export const TopUp = () => {
  const { user } = useAuth();
  const [orderId, setOrderId] = useState<string | null>(null);

  const generateID = async () => {
    if (!user) return;
    
    // Unikal ID yaratish
    const newId = `HUJJAT-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(newId);

    // Bazaga vaqtinchalik yozib qo'yamiz (summa botda aniqlanadi)
    await addDoc(collection(db, "payments"), {
      orderId: newId,
      userId: user.uid,
      userName: user.displayName,
      status: "pending",
      createdAt: serverTimestamp()
    });
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <Card className="p-8 text-center border-t-4 border-primary-600">
        <CreditCard className="mx-auto h-12 w-12 text-primary-600 mb-4" />
        <h2 className="text-2xl font-bold dark:text-white mb-2">Hisobni to'ldirish</h2>
        
        {!orderId ? (
          <Button onClick={generateID} className="w-full mt-4">
            To'lov ID olish
          </Button>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Sizning To'lov ID raqamingiz:</p>
              <p className="text-2xl font-black text-primary-600 tracking-wider">{orderId}</p>
            </div>
            <p className="text-sm text-gray-500">Ushbu ID raqamni nusxalab oling va botga yuboring.</p>
            <Button 
              className="w-full flex gap-2" 
              onClick={() => window.open(`https://t.me/hujjatuz_bot?start=${orderId}`, '_blank')}
            >
              <ExternalLink size={18} /> Telegram Botga o'tish
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};