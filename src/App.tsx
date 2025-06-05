import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import GeneratePage from './pages/GeneratePage';
import ScanPage from './pages/ScanPage';
import AdminLoginPage from './pages/AdminLoginPage';


const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = React.useState(localStorage.getItem('admin_pin') === '1234');
  const location = useLocation();

  React.useEffect(() => {
    const onStorage = () => setIsAdmin(localStorage.getItem('admin_pin') === '1234');
    window.addEventListener('storage', onStorage);
    // Optional: listen for custom events if you update localStorage in the same tab
    window.addEventListener('admin_pin_change', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('admin_pin_change', onStorage);
    };
  }, []);

  if (!isAdmin && location.pathname !== '/admin-login') {
    return <Navigate to="/admin-login" replace />;
  }

  return <>{children}</>;
};


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<RequireAdmin><GeneratePage /></RequireAdmin>} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;