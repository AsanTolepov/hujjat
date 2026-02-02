import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileText, Filter } from 'lucide-react';
import { Button, Card, Badge, Input } from '../components/UIComponents';
import { categories, documents } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

export const Catalog = () => {
  const { t, tr } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = documents.filter(doc => {
    const matchCategory = selectedCategory === 'all' || doc.categoryId === selectedCategory;
    const matchSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('catalog.title')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t('catalog.subtitle')}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <Card className="p-4 sticky top-24">
            {/* Search in Sidebar */}
            <div className="mb-6">
               <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('search.label')}</label>
               <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                  placeholder={t('search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3 text-gray-900 dark:text-white font-medium">
              <Filter size={18} />
              {t('categories.title')}
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${selectedCategory === 'all' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                {t('categories.all')}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex justify-between items-center ${selectedCategory === cat.id ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  {tr(cat.name)}
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 py-0.5 px-2 rounded-full text-xs">{cat.count}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Grid */}
        <div className="flex-1">
          {filteredDocs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocs.map((doc) => (
                <Link key={doc.id} to={`/documents/${doc.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow p-5 flex flex-col cursor-pointer group">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
                          <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <Badge>{tr(categories.find(c => c.id === doc.categoryId)?.name || '')}</Badge>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{tr(doc.title)}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{tr(doc.description)}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                       <div>
                         {doc.pricePdf === 0 ? (
                           <span className="text-green-600 dark:text-green-400 font-bold text-sm">{t('doc.price.free')}</span>
                         ) : (
                           <span className="text-gray-900 dark:text-white font-bold text-sm">{doc.pricePdf.toLocaleString()} so‘m</span>
                         )}
                       </div>
                       <span className="text-sm font-medium text-primary-600 dark:text-primary-400">{t('btn.select')} &rarr;</span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 transition-colors">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">{t('doc.not_found')}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('doc.not_found_desc')}</p>
              <div className="mt-6">
                <Button variant="outline" onClick={() => {setSearchQuery(''); setSelectedCategory('all');}}>{t('btn.clear')}</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};