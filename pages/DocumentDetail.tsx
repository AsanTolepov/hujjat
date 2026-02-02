import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase'; 
import { useAuth } from '../contexts/AuthContext';
import { documents } from '../data/mockData';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Download, AlertCircle, Loader2, CheckCircle, FileText } from 'lucide-react';

export const DocumentDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  
  // MUHIM: Har bir format uchun alohida loading holati
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const documentData = documents.find(d => d.slug === slug);

  const showToast = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  if (!documentData) return <div className="p-20 text-center dark:text-white font-bold">Hujjat topilmadi...</div>;

  const handleTypeDownload = async (type: 'PDF' | 'DOCX') => {
    if (!user) {
      showToast("Iltimos, tizimga kiring!", 'error');
      return;
    }

    const price = type === 'PDF' ? (documentData.pricePdf || 5000) : (documentData.priceDocx || 15000);
    const fileName = type === 'PDF' ? documentData.fileName : documentData.fileName.replace('.pdf', '.docx');

    // Faqat tanlangan format uchun loadingni yoqish
    setLoading(prev => ({ ...prev, [type]: true }));

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const currentBalance = userSnap.data()?.balance || 0;

      if (currentBalance < price) {
        showToast("Mablag' yetarli emas! Balansingizni to'ldiring.", 'error');
        setLoading(prev => ({ ...prev, [type]: false }));
        return;
      }

      // 1. Balansdan pul yechish
      await updateDoc(userRef, { balance: currentBalance - price });

      // 2. Yuklanganlar tarixiga qo'shish
      await addDoc(collection(db, "user_documents"), {
        userId: user.uid,
        title: `${documentData.title} (${type})`,
        price: price,
        format: type,
        createdAt: serverTimestamp()
      });

      // 3. HAQIQIY YUKLASH
      const fileUrl = `${window.location.origin}/documents/${fileName.toLowerCase()}`;
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = fileName;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      showToast("Fayl yuklash boshlandi! ✅", 'success');
    } catch (err: any) {
      console.error("Xatolik:", err);
      showToast("Texnik xatolik yuz berdi.", 'error');
    } finally {
      // Tanlangan format uchun loadingni o'chirish
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative min-h-[60vh]">
      {/* Toast Xabarnomasi */}
      {message && (
        <div className={`fixed top-10 right-10 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce-in ${
          message.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {message.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
          <div className="max-w-xs text-sm font-bold">{message.text}</div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border dark:border-gray-700">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black dark:text-white mb-4">{documentData.title}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* PDF CARD */}
          <div className="p-8 bg-gray-50 dark:bg-gray-700/50 rounded-3xl border-2 border-transparent hover:border-blue-500 transition-all group">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="p-4 bg-red-100 text-red-600 rounded-2xl group-hover:scale-110 transition-transform">
                <FileText size={40} />
              </div>
              <h3 className="text-xl font-bold dark:text-white">PDF variant</h3>
              <p className="text-2xl font-black text-blue-600">{documentData.pricePdf?.toLocaleString()} so'm</p>
              <button 
                onClick={() => handleTypeDownload('PDF')} 
                disabled={loading['PDF'] || loading['DOCX']}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold shadow-lg flex justify-center items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {loading['PDF'] ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                Yuklash
              </button>
            </div>
          </div>

          {/* DOCX CARD */}
          <div className="p-8 bg-gray-50 dark:bg-gray-700/50 rounded-3xl border-2 border-transparent hover:border-blue-500 transition-all group">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                <FileText size={40} />
              </div>
              <h3 className="text-xl font-bold dark:text-white">Word (DOCX)</h3>
              <p className="text-2xl font-black text-blue-600">{documentData.priceDocx?.toLocaleString()} so'm</p>
              <button 
                onClick={() => handleTypeDownload('DOCX')} 
                disabled={loading['PDF'] || loading['DOCX']}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold shadow-lg flex justify-center items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {loading['DOCX'] ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                Yuklash
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};