import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input } from '../components/UIComponents';
import { Shield, ArrowRight, LogIn } from 'lucide-react';
import { signInWithGoogle } from '../firebase';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate('/profile');
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="max-w-md w-full p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 dark:bg-primary-900/40 rounded-2xl text-primary-600 mb-4">
            <Shield size={32} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">
            {isLogin ? 'Tizimga kirish' : 'Ro‘yxatdan o‘tish'}
          </h2>
          <p className="text-sm text-gray-500 mt-2">Hujjat.uz — barcha hujjatlar bir joyda</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {!isLogin && <Input label="Ism va familiya" placeholder="Azizbek Tursunov" type="text" required />}
          <Input label="Email manzilingiz" placeholder="example@mail.com" type="email" required />
          <Input label="Parol" placeholder="••••••••" type="password" required />
          
          <Button variant="primary" className="w-full py-3 flex gap-2">
            {isLogin ? 'Kirish' : 'Ro‘yxatdan o‘tish'} <ArrowRight size={18} />
          </Button>
        </form>

        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700"></div></div>
          <span className="relative px-4 bg-white dark:bg-gray-800 text-sm text-gray-400">yoki</span>
        </div>

        <Button onClick={handleGoogleLogin} variant="secondary" className="w-full flex gap-3 border-gray-200 dark:border-gray-600">
          <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="google" />
          Google bilan davom etish
        </Button>

        <p className="mt-8 text-center text-sm text-gray-500">
          {isLogin ? "Hisobingiz yo'qmi?" : "Hisobingiz bormi?"}
          <button onClick={() => setIsLogin(!isLogin)} className="ml-2 font-bold text-primary-600">
            {isLogin ? 'Ro‘yxatdan o‘ting' : 'Tizimga kiring'}
          </button>
        </p>
      </Card>
    </div>
  );
};