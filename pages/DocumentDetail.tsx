import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Download, Eye, AlertCircle, CheckCircle } from 'lucide-react';
import { doc, getDoc, updateDoc, addDoc, collection, Timestamp } from 'firebase/firestore';
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

  const documentInfo = documents.find((d) => d.slug === slug);

  if (!documentInfo) {
    return <div className="p-8 text-center text-white">Hujjat topilmadi</div>;
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
      const userData = userSnap.data();
      const price = format === 'docx' ? documentInfo.priceDocx : documentInfo.pricePdf;

      if (userData?.balance < price) {
        setError("Mablag' yetarli emas");
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
        date: Timestamp.now()
      });

      // 3. YUKLAB OLISHNI TO'G'IRLASH:
      // Fayl nomini kichik harflar bilan va nuqtasiz yozing
      const fileName = "buyruq"; 
      const fileUrl = `${window.location.origin}/documents/${fileName}.${format}`;

      const link = document.createElement('a');
      link.href = fileUrl;
      // Download atributiga formatni aniq yozamiz
      link.setAttribute('download', `${fileName}.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

    } catch (err: any) {
      setError("Xatolik: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="p-8 bg-white dark:bg-gray-800">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl h-fit">
            <FileText className="h-16 w-16 text-primary-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold dark:text-white mb-4">{tr(documentInfo.title)}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{tr(documentInfo.description)}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button onClick={() => handleAction('docx')} loading={loading}>
                DOCX Yuklash ({documentInfo.priceDocx} so'm)
              </Button>
              <Button variant="secondary" onClick={() => handleAction('pdf')} loading={loading}>
                PDF Ko'rish ({documentInfo.pricePdf} so'm)
              </Button>
            </div>
            {error && <p className="mt-4 text-red-500 flex items-center gap-2"><AlertCircle size={18}/> {error}</p>}
            {success && <p className="mt-4 text-green-500 flex items-center gap-2"><CheckCircle size={18}/> Hujjat tayyor!</p>}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DocumentDetail;