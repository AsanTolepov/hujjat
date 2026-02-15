import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Download, Eye, AlertCircle, CheckCircle } from 'lucide-react';
import { doc, getDoc, updateDoc, arrayUnion, addDoc, collection, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { documents } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { Button, Card, Badge } from '../components/UIComponents';

const DocumentDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, tr } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Hujjat ma'lumotlarini mockData-dan topamiz
  const documentInfo = documents.find((d) => d.slug === slug);

  if (!documentInfo) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Hujjat topilmadi</h2>
        <Button className="mt-4" onClick={() => navigate('/documents')}>Katalogga qaytish</Button>
      </div>
    );
  }

  const handleAction = async (format: 'docx' | 'pdf') => {
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

      if (!userSnap.exists()) {
        throw new Error("Foydalanuvchi ma'lumotlari topilmadi");
      }

      const userData = userSnap.data();
      const price = format === 'docx' ? documentInfo.priceDocx : documentInfo.pricePdf;

      // Balansni tekshirish
      if (userData.balance < price) {
        setError(t('error.insufficient_balance') || "Mablag' yetarli emas");
        setLoading(false);
        return;
      }

      // 1. Balansni ayirish
      await updateDoc(userRef, {
        balance: userData.balance - price
      });

      // 2. Yuklangan hujjatlar tarixiga (user_documents) yozish
      // Bu qism Firebase Rules-da ruxsat berilgan bo'lishi shart
      await addDoc(collection(db, 'user_documents'), {
        userId: user.uid,
        docId: documentInfo.id,
        title: documentInfo.title,
        format: format,
        price: price,
        date: Timestamp.now()
      });

      // 3. Haqiqiy faylni yuklab olish mantiqi
      // public/documents/buyruq.docx kabi fayl yo'li ishlatiladi
      const fileName = 'buyruq'; // Agar har bir hujjat uchun alohida fayl bo'lsa: documentInfo.fileName
      const fileUrl = `/documents/${fileName}.${format}`;

      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', `${tr(documentInfo.title)}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

    } catch (err: any) {
      console.error(err);
      setError("Xatolik yuz berdi. Qoidalarni yoki balansni tekshiring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="p-8">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
            <FileText className="h-16 w-16 text-primary-600 dark:text-primary-400" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge color="blue">DOCX / PDF</Badge>
              <Badge color="green">{documentInfo.pricePdf === 0 ? t('doc.price.free') : 'Pullik'}</Badge>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {tr(documentInfo.title)}
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
              {tr(documentInfo.description)}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                onClick={() => handleAction('docx')}
                loading={loading}
                className="flex items-center justify-center gap-2"
              >
                <Download className="h-5 w-5" />
                DOCX Yuklash ({documentInfo.priceDocx} so'm)
              </Button>
              
              <Button 
                variant="secondary"
                onClick={() => handleAction('pdf')}
                className="flex items-center justify-center gap-2"
              >
                <Eye className="h-5 w-5" />
                PDF Ko'rish ({documentInfo.pricePdf} so'm)
              </Button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5" /> {error}
              </div>
            )}

            {success && (
              <div className="mt-4 p-3 bg-green-50 text-green-600 rounded-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5" /> Hujjat muvaffaqiyatli tayyorlandi!
              </div>
            )}
          </div>
        </div>
      </Card>
      
      <div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-100 dark:border-yellow-900/20">
        <div className="flex gap-3 text-yellow-800 dark:text-yellow-200">
          <AlertCircle className="h-6 w-6 flex-shrink-0" />
          <p className="text-sm">
            <strong>Diqqat:</strong> Yuklash tugmasini bosganingizda balansingizdan yuqoridagi summa yechiladi. 
            To'langan hujjatlarni profilingizdan qayta yuklab olishingiz mumkin.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;