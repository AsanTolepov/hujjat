import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Menu, X, Shield, Sun, Moon, Globe, LogIn, ChevronDown, LogOut as LogOutIcon } from 'lucide-react';
import { Button } from './UIComponents';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { logOut } from '../firebase';
import { languages, LanguageType } from '../utils/translations';

// 1. ThemeToggle - Navbar'dan oldin aniqlanishi va eksport qilinishi kerak
export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkMode);
    if (isDarkMode) document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.theme = newMode ? 'dark' : 'light';
  };

  return (
    <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors">
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

// 2. LanguageSwitcher - Navbar'dan oldin aniqlanishi va eksport qilinishi kerak
export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const currentLang = languages.find(l => l.code === language);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1 p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
        <Globe size={20} />
        <span className="text-xs font-medium uppercase w-8">{currentLang?.code.split('_')[0]}</span>
        <ChevronDown size={12} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20 border border-gray-200 dark:border-gray-700">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code as LanguageType);
                  setIsOpen(false);
                }}
                className={`flex flex-col items-start w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${language === lang.code ? 'text-primary-600 font-bold' : 'text-gray-700 dark:text-gray-300'}`}
              >
                <span className="font-medium">{lang.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// 3. Navbar - Yuqoridagi komponentlarni ishlatadi
export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const { t } = useLanguage();

  const isActive = (path: string) => 
    location.pathname === path ? "text-primary-600 font-bold" : "text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors";

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 mr-8">
              <Shield className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold dark:text-white text-gray-900">Hujjat.uz</span>
            </Link>
            
            <div className="hidden md:flex space-x-6">
              <Link to="/documents" className={`text-sm font-medium ${isActive('/documents')}`}>Hujjatlar</Link>
              <Link to="/about" className={`text-sm font-medium ${isActive('/about')}`}>Biz haqimizda</Link>
              <Link to="/faq" className={`text-sm font-medium ${isActive('/faq')}`}>Yordam</Link>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-4">
            <LanguageSwitcher />
            <ThemeToggle />
            {!user ? (
              <Link to="/login">
                <Button variant="primary" className="flex gap-2 text-sm"> <LogIn size={18} /> Kirish </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 p-1 rounded-full border border-gray-200 dark:border-gray-600">
                  <img src={user.photoURL || ''} alt="avatar" className="w-8 h-8 rounded-full" />
                  <span className="text-xs font-bold dark:text-white mr-2">{user.displayName?.split(' ')[0]}</span>
                </Link>
                <button onClick={() => logOut()} className="text-gray-400 hover:text-red-500 transition-colors"> 
                  <LogOutIcon size={20} /> 
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center sm:hidden gap-2">
            <ThemeToggle />
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 p-1">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 py-2">
          <div className="px-4 space-y-1">
            <Link to="/documents" onClick={() => setIsOpen(false)} className="block py-2 text-base font-medium text-gray-600 dark:text-gray-300">Hujjatlar</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="block py-2 text-base font-medium text-gray-600 dark:text-gray-300">Biz haqimizda</Link>
            <Link to="/faq" onClick={() => setIsOpen(false)} className="block py-2 text-base font-medium text-gray-600 dark:text-gray-300">Yordam</Link>
            <div className="pt-4 pb-2 border-t border-gray-100 dark:border-gray-700">
              {!user ? (
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">Kirish</Button>
                </Link>
              ) : (
                <div className="flex items-center justify-between">
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                    <img src={user.photoURL || ''} alt="avatar" className="w-8 h-8 rounded-full" />
                    <span className="font-bold dark:text-white">{user.displayName}</span>
                  </Link>
                  <button onClick={() => logOut()} className="text-red-500"> <LogOutIcon size={20} /> </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm text-gray-500">&copy; 2024 Hujjat.uz. Barcha huquqlar himoyalangan.</p>
      </div>
    </footer>
  );
};

// 4. Layout - Asosiy eksport
export const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);