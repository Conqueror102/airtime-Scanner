import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { QrCode, Scan, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-secondary-500 font-semibold' : 'text-white hover:text-secondary-300';
  };

  return (
    <header className="bg-primary-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <QrCode size={28} className="text-secondary-500" />
            <span className="text-xl font-bold">AirtimeQR</span>
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`flex items-center space-x-1 ${isActive('/')}`}>
              <QrCode size={18} />
              <span>Generate</span>
            </Link>
            <Link to="/scan" className={`flex items-center space-x-1 ${isActive('/scan')}`}>
              <Scan size={18} />
              <span>Scan</span>
            </Link>
          </nav>
        </div>
        
        {/* Mobile navigation */}
        {isMenuOpen && (
          <motion.nav 
            className="md:hidden mt-4 flex flex-col space-y-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link 
              to="/" 
              className={`flex items-center space-x-2 p-2 rounded ${isActive('/')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <QrCode size={18} />
              <span>Generate QR Code</span>
            </Link>
            <Link 
              to="/scan" 
              className={`flex items-center space-x-2 p-2 rounded ${isActive('/scan')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Scan size={18} />
              <span>Scan QR Code</span>
            </Link>
          </motion.nav>
        )}
      </div>
    </header>
  );
};

export default Header;