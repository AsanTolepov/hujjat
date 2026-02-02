import React from 'react';
import { Link } from 'react-router-dom';
import { Search, FileText, CheckCircle, ArrowRight, Zap, Shield, PenTool } from 'lucide-react';
import { Button, Card, Badge } from '../components/UIComponents';
import { categories, documents } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();
  return (
    <div className="relative bg-white dark:bg-gray-900 overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white dark:bg-gray-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 transition-colors">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white dark:text-gray-900 transform translate-x-1/2 transition-colors"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block xl:inline">{t('hero.title.1')}</span>{' '}
                <span className="block text-primary-600 dark:text-primary-400 xl:inline">{t('hero.title.2')}</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-auto">
                {t('hero.desc')}
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link to="/documents">
                    <Button className="w-full h-12 text-lg">{t('hero.btn.create')}</Button>
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link to="/about">
                    <Button variant="secondary" className="w-full h-12 text-lg">{t('hero.btn.more')}</Button>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-primary-50 dark:bg-gray-800 flex items-center justify-center transition-colors">
        <div className="grid grid-cols-2 gap-4 p-8 opacity-60 transform rotate-[-5deg] scale-90">
           <div className="h-64 w-48 bg-white dark:bg-gray-700 rounded shadow-lg border dark:border-gray-600 p-4"></div>
           <div className="h-64 w-48 bg-white dark:bg-gray-700 rounded shadow-lg border dark:border-gray-600 p-4 mt-12"></div>
           <div className="h-64 w-48 bg-white dark:bg-gray-700 rounded shadow-lg border dark:border-gray-600 p-4 -mt-12"></div>
           <div className="h-64 w-48 bg-white dark:bg-gray-700 rounded shadow-lg border dark:border-gray-600 p-4"></div>
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  const { t } = useLanguage();
  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">{t('features.title')}</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {[
              {
                name: t('nav.documents'),
                icon: Search
              },
              {
                name: 'Ma’lumotlarni kiriting', // Leaving some hardcoded for demo brevity or map nicely in dictionary
                icon: PenTool
              },
              {
                name: 'Yuklab oling',
                icon: CheckCircle
              },
            ].map((feature, i) => (
              <div key={i} className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">{feature.name}</p>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

const PopularDocuments = () => {
  const { t, tr } = useLanguage();
  return (
    <div className="py-12 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">{t('popular.title')}</h2>
          <Link to="/documents" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center">
            {t('popular.view_all')} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {documents.slice(0, 3).map((doc) => (
            <Link key={doc.id} to={`/documents/${doc.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow p-6 flex flex-col">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <Badge color="blue">{doc.pricePdf === 0 ? t('doc.price.free') : t('doc.price.paid')}</Badge>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{tr(doc.title)}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">{tr(doc.description)}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <span className="text-xs text-gray-400 dark:text-gray-500">DOCX / PDF</span>
                  <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">{t('doc.create_btn')} &rarr;</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Home = () => {
  const { t, tr } = useLanguage();
  return (
    <div>
      <Hero />
      <Features />
      <PopularDocuments />
      <div className="bg-primary-700 dark:bg-primary-900 transition-colors">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">{tr('Ish yuritishni bugun boshlang.')}</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-200">
            {t('hero.desc')}
          </p>
          <Link to="/documents" className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 sm:w-auto">
            {t('hero.btn.create')}
          </Link>
        </div>
      </div>
    </div>
  );
};