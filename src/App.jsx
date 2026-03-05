import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './pages/Landing';
import MyAccount from './pages/MyAccount';
import CourseDetail from './pages/CourseDetail';
import Cursos from './pages/Cursos';
import ChatbotWidget from './components/chatbot/ChatbotWidget';
import { initMP } from './services/mercadoPago';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useSettings } from './hooks/useSettings';

// Lazy load admin pages
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function App() {
  const { settings } = useSettings();

  useEffect(() => {
    initMP();
    document.title = settings.nombre_pagina || 'Aura Healing';

    // Set global theme attribute
    document.documentElement.setAttribute('data-theme', settings.esquema_colores || '1');

    console.log("Setting data-theme to:", settings.esquema_colores);
  }, [settings.nombre_pagina, settings.esquema_colores]);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="dark min-h-screen bg-background-dark text-slate-100 flex flex-col relative selection:bg-primary/30">
        <Navbar />
        <main className="flex-grow pt-16">
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/cursos" element={<Cursos />} />
              <Route path="/curso/:id" element={<CourseDetail />} />
              <Route path="/mi-cuenta" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />
              <Route path="/admin/*" element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Landing />} />
            </Routes>
          </Suspense>
        </main>
        <ChatbotWidget />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
