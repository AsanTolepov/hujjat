import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Card } from '../components/UIComponents';

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Hujjatlar qonuniy kuchga egami?",
      a: "Ha, bizning barcha namunalarimiz O'zbekiston Respublikasining amaldagi qonunchiligi va davlat tili qoidalariga mos keladi."
    },
    {
      q: "Hujjatni qanday yuklab olaman?",
      a: "Kerakli hujjatni tanlang, ma'lumotlarni to'ldiring va 'Yuklab olish' tugmasini bosing. Hujjat PDF yoki DOCX formatida taqdim etiladi."
    },
    {
      q: "To'lov qanday amalga oshiriladi?",
      a: "Hozirda platforma bepul rejimda ishlamoqda. Kelgusida Payme va Click tizimlari orqali to'lovni ulash rejalashtirilgan."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-primary-100 rounded-2xl">
          <HelpCircle className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold dark:text-white text-gray-900 text-gray-900">Ko'p beriladigan savollar</h1>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <Card key={i} className="overflow-hidden">
            <button 
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <span className="font-bold text-gray-900 dark:text-white">{faq.q}</span>
              {openIndex === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {openIndex === i && (
              <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4">
                {faq.a}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};