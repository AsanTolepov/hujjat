import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Download, Eye, AlertCircle } from 'lucide-react';
import { doc, getDoc, updateDoc, addDoc, collection, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { documents } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { Button, Card, Badge } from '../components/UIComponents';

export const DocumentDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { tr } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const documentInfo = documents.find((d) => d.slug === slug);

  if (!documentInfo) return <div className="p-20 text-center text-white">Hujjat topilmadi</div>;

  const handleDownload = async (format: 'docx' | 'pdf') => {
    const user = auth.currentUser;
    if (!user) {
      setError("Iltimos, avval tizimga kiring!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      const price = format === 'docx' ? documentInfo.priceDocx : documentInfo.pricePdf;

      // Balansni tekshirish
      if (!userData || userData.balance < price) {
        setError("Mablag' yetarli emas!");
        setLoading(false);
        return;
      }

      // 1. Balansni yangilash
      await updateDoc(userRef, { balance: userData.balance - price });

      // 2. Tarixga yozish
      await addDoc(collection(db, 'user_documents'), {
        userId: user.uid,
        title: documentInfo.title,
        format: format,
        price: price,
        date: Timestamp.now(),
      });

      // 3. Faylni yuklab olish (Hech qanday xabarsiz, faqat yuklash)
      const fileName = "buyruq"; 
      const fileUrl = `${window.location.origin}/documents/${fileName}.${format}`;
      
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', `${fileName}.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err: any) {
      setError("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Card className="p-8 bg-white dark:bg-gray-800 shadow-xl border-none">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-3xl">
            <FileText className="h-20 w-20 text-primary-600" />
          </div>
          
          <div className="flex-1 w-full text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              {tr(documentInfo.title)}
            </h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button onClick={() => handleDownload('docx')} loading={loading} className="py-4 text-lg">
                <Download className="mr-2 h-5 w-5" /> DOCX Yuklash
              </Button>
              <Button variant="secondary" onClick={() => handleDownload('pdf')} className="py-4 text-lg">
                <Eye className="mr-2 h-5 w-5" /> PDF Ko'rish
              </Button>
            </div>

            {/* Faqat xatolik bo'lsagina chiqadi */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                <AlertCircle size={18} /> {error}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};