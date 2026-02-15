import React, { useState } from 'react';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, Button } from '../components/UIComponents';
import { Search, ChevronDown, ChevronRight, FileText, Download, Info, AlertCircle, Loader2, CheckCircle, XCircle } from 'lucide-react';

// Siz yuborgan mundarija asosidagi ma'lumotlar strukturasi
const DOCUMENT_STRUCTURE = [
  {
    id: 'I',
    title: 'I. SHÓLKEMLESTIRIW HÚJJETLERI',
    items: [
      { name: 'Gúwalíq', price: 5000 },
      { name: 'Ishki miynet tártibi qaǵıydaları', price: 10000 },
      { name: 'Kórsetpe', price: 5000 },
      { name: 'Qaǵıyda, ustav', price: 15000 },
      { name: 'Shólkem dúzilisi hám shtatlar sanı', price: 12000 },
      { name: 'Demalıslar kestesi', price: 5000 },
      { name: 'Shártnama', price: 20000 },
      { name: 'Miynet pitimi', price: 15000 }
    ]
  },
  {
    id: 'II',
    title: 'II. BIYLIK HÚJJETLERI',
    items: [
      { name: 'Buyrıq', price: 5000 },
      { name: 'Buyrıqtan kóshirme', price: 3000 },
      { name: 'Biylik', price: 5000 }
    ]
  },
  {
    id: 'III',
    title: 'III. MAǴLÍWMAT-XABAR HÚJJETLERI',
    items: [
      { name: 'Arza', price: 2000 },
      { name: 'Bayanlama', price: 5000 },
      { name: 'Bayanlamadan kóshirme', price: 5000 },
      { name: 'Málimleme', price: 5000 },
      { name: 'Wásiyatnama', price: 10000 },
      { name: 'Akt', price: 5000 },
      { name: 'Isenim xat', price: 10000 },
      { name: 'Maǵlíwmatnama', price: 3000 },
      { name: 'Minezleme, usínísnama', price: 5000 },
      { name: 'Ómirbayan', price: 3000 },
      { name: 'Til xat', price: 2000 },
      { name: 'Túsinik xat', price: 2000 },
      { name: 'Daǵaza', price: 2000 },
      { name: 'Esabat', price: 10000 },
      { name: 'Rezyume', price: 5000 }
    ]
  },
  {
    id: 'IV',
    title: 'IV. XÍZMET XATLARÍ',
    items: [
      { name: 'Mánzil', price: 3000 },
      { name: 'Mirátnama', price: 3000 },
      { name: 'Telegramma', price: 2000 },
      { name: 'Xatlar', price: 3000 },
      { name: 'Dawa xatı', price: 15000 },
      { name: 'Kepillik xatı', price: 5000 },
      { name: 'Soraw xatı', price: 3000 }
    ]
  }
];

export const Catalog = () => {
  const { user } = useAuth(); //
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCats, setExpandedCats] = useState<string[]>(['I']); 
  const [selectedDoc, setSelectedDoc] = useState<{name: string, price: number} | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const toggleCat = (id: string) => {
    setExpandedCats(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleDownload = async (type: 'PDF' | 'DOCX') => {
    if (!user) { //
      setMessage({ text: "Iltimos, tizimga kiring!", type: 'error' });
      return;
    }
    if (!selectedDoc) return;

    setLoading(true);
    try {
      const userRef = doc(db, "users", user.uid); //
      const userSnap = await getDoc(userRef); //
      const currentBalance = userSnap.data()?.balance || 0; //

      if (currentBalance < selectedDoc.price) { //
        setMessage({ text: "Mablag' yetarli emas!", type: 'error' });
        setLoading(false);
        return;
      }

      await updateDoc(userRef, { balance: currentBalance - selectedDoc.price }); //
      await addDoc(collection(db, "user_documents"), { //
        userId: user.uid,
        title: `${selectedDoc.name} (${type})`,
        price: selectedDoc.price,
        format: type,
        createdAt: serverTimestamp()
      });

      setMessage({ text: "Xarid muvaffaqiyatli! Yuklanmoqda...", type: 'success' });
      const link = document.createElement('a');
      link.href = `/documents/${selectedDoc.name.toLowerCase().replace(/ /g, '_')}.${type.toLowerCase()}`;
      link.download = selectedDoc.name;
      link.click();
    } catch (err) {
      setMessage({ text: "Xatolik yuz berdi.", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 min-h-[85vh]">
      
      {/* Toast Xabarnomasi */}
      {message && (
        <div className={`fixed top-10 right-10 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
          {message.type === 'success' ? <CheckCircle size={24} /> : <XCircle size={24} />}
          <div className="text-sm font-bold">{message.text}</div>
        </div>
      )}

      {/* CHAP TOMON: 4 TA BO'LIMLI MUNDARIJA */}
      <div className="md:w-1/3 lg:w-1/4 space-y-4">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Qidirish..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border-none rounded-2xl shadow-sm outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b dark:border-gray-700 font-black text-gray-700 dark:text-gray-200 uppercase tracking-widest text-[11px]">
            Hujjatlar Bo'limi
          </div>
          <div className="p-3 space-y-1 max-h-[600px] overflow-y-auto custom-scrollbar">
            {DOCUMENT_STRUCTURE.map(cat => (
              <div key={cat.id} className="space-y-1">
                <button 
                  onClick={() => toggleCat(cat.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold text-left text-xs transition-all ${expandedCats.includes(cat.id) ? 'bg-primary-50 text-primary-600' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <span className="flex-1 pr-2 leading-tight">{cat.title}</span>
                  {expandedCats.includes(cat.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                
                {expandedCats.includes(cat.id) && (
                  <div className="ml-4 space-y-1 pb-2">
                    {cat.items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                      <button
                        key={item.name}
                        onClick={() => setSelectedDoc(item)}
                        className={`w-full text-left p-2.5 pl-4 rounded-xl text-[11px] font-medium transition-all ${selectedDoc?.name === item.name ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-400 hover:text-primary-500 hover:bg-primary-50/50'}`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* O'NG TOMON: HUJJAT DETALLARI */}
      <div className="md:w-2/3 lg:w-3/4">
        {selectedDoc ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="p-10 rounded-[3rem] bg-white dark:bg-gray-800 border-none shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-gray-400 pointer-events-none">
                <FileText size={180} />
              </div>
              
              <div className="flex items-center gap-3 text-primary-600 mb-8">
                <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-2xl"><Info size={28} /></div>
                <span className="text-xs font-black uppercase tracking-[0.2em]">Hujjat Tafsilotlari</span>
              </div>
              
              <h1 className="text-4xl font-black text-gray-800 dark:text-white mb-6 leading-tight max-w-2xl">
                {selectedDoc.name}
              </h1>
              
              <div className="flex items-baseline gap-2 mb-12">
                <span className="text-5xl font-black text-primary-600">{selectedDoc.price.toLocaleString()}</span>
                <span className="text-gray-400 font-bold uppercase text-sm">so'm</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl">
                <Button 
                  disabled={loading}
                  onClick={() => handleDownload('DOCX')}
                  className="flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-primary-200/50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Download size={24} />}
                  DOCX Yuklash
                </Button>
                <Button 
                  disabled={loading}
                  variant="outline"
                  onClick={() => handleDownload('PDF')}
                  className="flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-lg"
                >
                  <FileText size={24} /> PDF Ko'rish
                </Button>
              </div>

              <div className="mt-12 p-6 bg-amber-50 dark:bg-amber-900/10 rounded-[2rem] border border-amber-100 dark:border-amber-900/20 flex items-start gap-5">
                <AlertCircle className="text-amber-600 shrink-0" size={28} />
                <p className="text-amber-700 dark:text-amber-400 text-xs font-medium leading-relaxed">
                  <b>Diqqat:</b> Yuklash tugmasini bosganingizda balansingizdan yuqoridagi summa avtomatik yechiladi. To'langan hujjatlarni keyinchalik profilingizdan tekin qayta yuklab olishingiz mumkin.
                </p>
              </div>
            </Card>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-16 bg-gray-50/50 dark:bg-gray-800/20 rounded-[4rem] border-4 border-dashed border-gray-100 dark:border-gray-700">
            <div className="w-28 h-28 bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm flex items-center justify-center mb-8 text-gray-200">
              <FileText size={56} />
            </div>
            <h3 className="font-black text-gray-300 text-3xl uppercase tracking-tighter mb-4">Hujjat tanlanmagan</h3>
            <p className="text-gray-400 text-sm max-w-xs font-medium leading-relaxed">Mundarijadan kerakli bo'limni oching va hujjatni tanlang.</p>
          </div>
        )}
      </div>
    </div>
  );
};