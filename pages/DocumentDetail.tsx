import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { documents, categories } from '../data/mockData';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, Button, Badge } from '../components/UIComponents';
import { Search, ChevronDown, ChevronRight, FileText, Download, Info, AlertCircle, Loader2, CheckCircle, XCircle } from 'lucide-react';

export const DocumentDetail = () => {
  const { user } = useAuth();
  const { t, tr } = useLanguage();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCats, setExpandedCats] = useState<string[]>(['cat1']); // Birinchi kategoriya ochiq
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const toggleCat = (id: string) => {
    setExpandedCats(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleDownload = async (type: 'PDF' | 'DOCX') => {
    if (!user) {
      showToast("Iltimos, tizimga kiring!", 'error');
      return;
    }
    if (!selectedDoc) return;

    const price = type === 'PDF' ? (selectedDoc.pricePdf || 5000) : (selectedDoc.priceDocx || 15000);
    setLoading(true);

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const currentBalance = userSnap.data()?.balance || 0;

      if (currentBalance < price) {
        showToast("Mablag' yetarli emas! Balansni to'ldiring.", 'error');
        setLoading(false);
        return;
      }

      // 1. Balansdan pul yechish
      await updateDoc(userRef, { balance: currentBalance - price });

      // 2. Yuklanganlar tarixiga qo'shish
      await addDoc(collection(db, "user_documents"), {
        userId: user.uid,
        title: `${tr(selectedDoc.title)} (${type})`,
        price: price,
        format: type,
        createdAt: serverTimestamp()
      });

      showToast("Xarid muvaffaqiyatli! Yuklanmoqda...", 'success');
      
      // 3. Haqiqiy yuklash simulyatsiyasi
      const fileName = type === 'PDF' ? selectedDoc.fileName : selectedDoc.fileName.replace('.pdf', '.docx');
      const link = document.createElement('a');
      link.href = `/documents/${fileName.toLowerCase()}`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error(err);
      showToast("Texnik xatolik yuz berdi.", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 min-h-[80vh]">
      
      {/* Toast Xabarnomasi */}
      {message && (
        <div className={`fixed top-10 right-10 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in zoom-in duration-300 ${
          message.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {message.type === 'success' ? <CheckCircle size={24} /> : <XCircle size={24} />}
          <div className="text-sm font-bold">{message.text}</div>
        </div>
      )}

      {/* CHAP TOMON: KATEGORIYALAR (Akordeon) */}
      <div className="md:w-1/3 lg:w-1/4 space-y-4">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder={t('search.placeholder')}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-5 border-b dark:border-gray-700 font-black text-gray-700 dark:text-gray-200 uppercase tracking-widest text-[10px]">
            {t('categories.title')}
          </div>
          <div className="p-2 space-y-1 max-h-[600px] overflow-y-auto">
            {categories.map(cat => (
              <div key={cat.id} className="space-y-1">
                <button 
                  onClick={() => toggleCat(cat.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl font-bold text-left text-[11px] transition-all ${expandedCats.includes(cat.id) ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  <span className="flex-1 pr-2 leading-tight">{tr(cat.name)}</span>
                  {expandedCats.includes(cat.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
                
                {expandedCats.includes(cat.id) && (
                  <div className="ml-4 space-y-1 pb-2">
                    {documents
                      .filter(d => d.categoryId === cat.id && tr(d.title).toLowerCase().includes(searchTerm.toLowerCase()))
                      .map(docItem => (
                      <button
                        key={docItem.id}
                        onClick={() => setSelectedDoc(docItem)}
                        className={`w-full text-left p-2 pl-4 rounded-lg text-[11px] font-medium transition-colors ${selectedDoc?.id === docItem.id ? 'bg-primary-600 text-white shadow-md' : 'text-gray-400 hover:text-primary-500 hover:bg-primary-50/50'}`}
                      >
                        {tr(docItem.title)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* O'NG TOMON: DETAL VA YUKLASH */}
      <div className="md:w-2/3 lg:w-3/4">
        {selectedDoc ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="p-10 rounded-[3rem] bg-white dark:bg-gray-800 border-none shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-gray-400">
                <FileText size={150} />
              </div>
              
              <div className="flex items-center gap-3 text-primary-600 mb-6">
                <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg"><Info size={24} /></div>
                <span className="text-xs font-black uppercase tracking-widest">Hujjat Tafsilotlari</span>
              </div>
              
              <h1 className="text-4xl font-black text-gray-800 dark:text-white mb-4 leading-tight">
                {tr(selectedDoc.title)}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-2xl">{tr(selectedDoc.description)}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">PDF Variant</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-primary-600">{(selectedDoc.pricePdf || 5000).toLocaleString()}</span>
                    <span className="text-gray-400 font-bold text-xs">SO'M</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Word (DOCX)</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-primary-600">{(selectedDoc.priceDocx || 15000).toLocaleString()}</span>
                    <span className="text-gray-400 font-bold text-xs">SO'M</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                <Button 
                  disabled={loading}
                  onClick={() => handleDownload('DOCX')}
                  className="flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary-100 dark:shadow-none"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Download size={22} />}
                  DOCX Yuklash
                </Button>
                <Button 
                  disabled={loading}
                  variant="outline"
                  onClick={() => handleDownload('PDF')}
                  className="flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-lg"
                >
                  <FileText size={22} /> PDF Ko'rish
                </Button>
              </div>

              <div className="mt-10 p-5 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/20 flex items-start gap-4">
                <AlertCircle className="text-amber-600 shrink-0" size={24} />
                <p className="text-amber-700 dark:text-amber-400 text-xs font-medium leading-relaxed">
                  <b>Eslatma:</b> Faylni yuklashda balansingizdan yuqoridagi summa avtomatik yechiladi. Yuklangan hujjatlarni "Profil" bo'limida ko'rishingiz mumkin.
                </p>
              </div>
            </Card>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-gray-50/50 dark:bg-gray-800/20 rounded-[4rem] border-4 border-dashed border-gray-100 dark:border-gray-700">
            <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-3xl shadow-sm flex items-center justify-center mb-6 text-gray-200">
              <FileText size={48} />
            </div>
            <h3 className="font-black text-gray-300 text-2xl uppercase tracking-tighter">{t('catalog.title')}</h3>
            <p className="text-gray-400 text-sm max-w-xs mt-4 font-medium">{t('catalog.subtitle')}</p>
          </div>
        )}
      </div>
    </div>
  );
};