import React from 'react';
import { Shield, CheckCircle, Users, Zap } from 'lucide-react';
import { Card } from '../components/UIComponents';

export const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
          Hujjat.uz haqida
        </h1>
        <p className="mt-4 text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
          Bizning maqsadimiz — davlat tilida ish yuritishni raqamlashtirish va har bir fuqaro uchun rasmiy hujjatlarni tayyorlashni osonlashtirish.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Biz kimmiz?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            Hujjat.uz — bu O'zbekistondagi tadbirkorlar, xodimlar va jismoniy shaxslar uchun mo'ljallangan zamonaviy generator platformasi. 
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Bizning jamoa yuridik va texnologik bilimlarini birlashtirib, sizga xatosiz, qonuniy va chiroyli dizayndagi hujjatlarni taqdim etadi.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Card className="p-6 text-center border-b-4 border-b-primary-500">
            <Shield className="mx-auto h-10 w-10 text-primary-500 mb-4" />
            <h3 className="font-bold dark:text-white text-gray-900">Xavfsiz</h3>
          </Card>
          <Card className="p-6 text-center border-b-4 border-b-green-500">
            <Zap className="mx-auto h-10 w-10 text-green-500 mb-4" />
            <h3 className="font-bold dark:text-white text-gray-900">Tezkor</h3>
          </Card>
          <Card className="p-6 text-center border-b-4 border-b-blue-500">
            <CheckCircle className="mx-auto h-10 w-10 text-blue-500 mb-4" />
            <h3 className="font-bold dark:text-white text-gray-900">Sifatli</h3>
          </Card>
          <Card className="p-6 text-center border-b-4 border-b-purple-500">
            <Users className="mx-auto h-10 w-10 text-purple-500 mb-4" />
            <h3 className="font-bold dark:text-white text-gray-900">Ommabop</h3>
          </Card>
        </div>
      </div>
    </div>
  );
};