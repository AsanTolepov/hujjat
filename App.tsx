import React from 'react';
import { HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';

// TO'G'IRLANGAN IMPORTLAR (Figurali qavslarsiz)
import Catalog from './pages/Catalog';
import DocumentDetail from './pages/DocumentDetail';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import About from './pages/About';
import FAQ from './pages/FAQ';

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
              <Route path="/login" element={<Auth />} />
              <Route path="/documents" element={<Catalog />} />
              <Route path="/documents/:slug" element={<DocumentDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="*" element={
                <div className="text-center py-20">
                  <h1 className="text-4xl font-bold text-gray-300">404</h1>
                  <p>Sahifa topilmadi</p>
                </div>
              } />
            </Route>
          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;