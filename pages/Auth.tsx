import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input } from '../components/UIComponents';
import { Shield, ArrowRight } from 'lucide-react';
import { signInWithGoogle, db } from '../firebase'; // db qo'shildi
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      // Firestore'da foydalanuvchi borligini tekshirish
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Yangi foydalanuvchi bo'lsa, doimiy 6 xonali ID yaratish
        const newPaymentId = Math.floor(100000 + Math.random() * 900000).toString();
        
        await setDoc(userRef, {
          full_name: user.displayName || "Foydalanuvchi",
          email: user.email,
          balance: 0,
          paymentId: newPaymentId, // Doimiy ID
          createdAt: serverTimestamp()
        });
      }
      
      navigate('/profile');
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
      setError("Google orqali kirishda xatolik yuz berdi.");
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (isLogin && email === 'admin' && password === 'admin') {
      navigate('/admin');
      return;
    }
    if (isLogin) {
      setError('Email yoki parol noto‘g‘ri (Admin uchun: admin / admin)');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="max-w-md w-full p-8 shadow-2xl rounded-[2.5rem]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 dark:bg-primary-900/40 rounded-2xl text-primary-600 mb-4 transform rotate-3">
            <Shield size={32} />
          </div>
          <h2 className="text-3xl font-black dark:text-white tracking-tight">
            {isLogin ? 'Tizimga kirish' : 'Ro‘yxatdan o‘tish'}
          </h2>
          <p className="text-sm text-gray-500 mt-2 italic">Hujjat.uz — barcha hujjatlar bir joyda</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100 animate-shake">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleAuth}>
          {!isLogin && <Input label="Ism va familiya" placeholder="Azizbek Tursunov" type="text" required />}
          <Input label="Email yoki Login" placeholder="example@mail.com" type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Parol" placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" variant="primary" className="w-full py-4 rounded-2xl font-black text-lg flex gap-2 justify-center shadow-lg">
            {isLogin ? 'Kirish' : 'Ro‘yxatdan o‘tish'} <ArrowRight size={20} />
          </Button>
        </form>

        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-gray-800"></div></div>
          <span className="relative px-4 bg-white dark:bg-gray-900 text-[10px] font-black uppercase text-gray-400">yoki</span>
        </div>

        <Button onClick={handleGoogleLogin} variant="secondary" className="w-full py-3 rounded-2xl flex gap-3 border-gray-100 font-bold justify-center items-center">
          <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="google" />
          Google bilan kirish
        </Button>
      </Card>
    </div>
  );
};