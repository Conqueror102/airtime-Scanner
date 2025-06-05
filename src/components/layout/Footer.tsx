import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary-700 text-white py-4 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4">
          <div className="flex items-center justify-center">
            <span>Made with</span>
            <Heart size={16} className="mx-1 text-secondary-500 inline" />
            <span>for Nigeria</span>
          </div>
          <div className="text-sm opacity-80">
            © {currentYear} AirtimeQR. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;