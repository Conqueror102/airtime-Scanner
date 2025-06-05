import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, PhoneCall, RefreshCw } from 'lucide-react';

interface ScannedResultProps {
  code: string;
  onScanAgain: () => void;
}

const ScannedResult: React.FC<ScannedResultProps> = ({ code, onScanAgain }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Check if the code looks like a USSD code
  const isUSSDCode = /^\*\d+\*\d+#$/.test(code);
  
  // Format for display (add spaces for readability if needed)
  const formattedCode = code;
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  };
  
  const handleDialCode = () => {
    // Open the dialer with the code
    window.location.href = `tel:${code}`;
  };
  
  return (
    <motion.div 
      className="glass-card w-full max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-bold text-primary-700">Scanned Result</h2>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-lg mb-6">
        <label className="block text-sm font-medium mb-2">
          {isUSSDCode ? 'USSD Recharge Code:' : 'Scanned Code:'}
        </label>
        <div className="font-mono text-lg text-primary-700 font-semibold break-all">
          {formattedCode}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopyCode}
          className="btn-primary flex justify-center items-center"
        >
          {copySuccess ? (
            <>
              <span className="mr-2">✓</span>
              Copied!
            </>
          ) : (
            <>
              <Copy size={18} className="mr-2" />
              Copy Code
            </>
          )}
        </motion.button>
        
        {isUSSDCode && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDialCode}
            className="btn-secondary flex justify-center items-center"
          >
            <PhoneCall size={18} className="mr-2" />
            Dial Code
          </motion.button>
        )}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onScanAgain}
          className="btn-outline flex justify-center items-center"
        >
          <RefreshCw size={18} className="mr-2" />
          Scan Again
        </motion.button>
      </div>
      
      {isUSSDCode && (
        <div className="text-sm text-gray-600 mt-2">
          <p>Tap "Dial Code" to open your phone dialer with this USSD code pre-filled.</p>
          <p className="mt-1">Or tap "Copy Code" to copy it to your clipboard.</p>
        </div>
      )}
    </motion.div>
  );
};

export default ScannedResult;