import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GeneratePage from './pages/GeneratePage';
import ScanPage from './pages/ScanPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GeneratePage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="*" element={<Navigate to="/\" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;