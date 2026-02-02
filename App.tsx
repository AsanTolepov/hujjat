import React from 'react';
import { HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Layout } from './components/Layout';
import { About } from './pages/About';
import { FAQ } from './pages/FAQ';
import { Home } from './pages/Home';
import { AuthProvider } from './contexts/AuthContext';
import { Catalog } from './pages/Catalog';
import { DocumentDetail } from './pages/DocumentDetail';
import { Profile } from './pages/Profile';
import { Auth } from './pages/Auth';
import { Admin } from './pages/Admin';
import { LanguageProvider } from './contexts/LanguageContext';

const AppLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

const App = () => {
  return (
    <AuthProvider>
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Auth />} /> {/* Yangi qo'shilgan qator */}
            <Route path="/documents" element={<Catalog />} />
            <Route path="/documents/:slug" element={<DocumentDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
<Route path="/faq" element={<FAQ />} />
            <Route path="/about" element={<div className="p-8 text-center max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-4">Loyiha haqida</h1>
              <p className="text-gray-600">Davlat tilida ish yuritish hujjatlari platformasi - bu O‘zbekiston Respublikasi qonunchiligiga mos keladigan barcha turdagi rasmiy hujjatlar namunalarini taqdim etuvchi onlayn xizmat. Bizning maqsadimiz - hujjat aylanishini raqamlashtirish va osonlashtirish.</p>
            </div>} />
            <Route path="/faq" element={<div className="p-8 text-center max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-4">Ko‘p beriladigan savollar</h1>
              <p className="text-gray-600">Hozircha savollar yo‘q.</p>
            </div>} />
            <Route path="*" element={<div className="text-center py-20"><h1 className="text-4xl font-bold text-gray-300">404</h1><p>Sahifa topilmadi</p></div>} />
          </Route>
        </Routes>
      </Router>
    </LanguageProvider>
    </AuthProvider>
  );
};

export default App;