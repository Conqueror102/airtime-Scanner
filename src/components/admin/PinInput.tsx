import React, { useState } from 'react';
import { VoucherData, formatUSSDCode } from '../../types';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface PinInputProps {
  onGenerateQR: (data: VoucherData) => void;
}

const PinInput: React.FC<PinInputProps> = ({ onGenerateQR }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate PIN
    if (!pin.trim()) {
      setError('Please enter a PIN');
      return;
    }

    // Check if PIN contains only digits
    if (!/^\d+$/.test(pin)) {
      setError('PIN should contain only digits');
      return;
    }

    // This is a simplified check - adjust based on actual requirements
    if (pin.length < 10 || pin.length > 16) {
      setError('PIN should be between 10-16 digits');
      return;
    }

    const ussdCode = formatUSSDCode(pin);
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
    
    // Generate QR
    onGenerateQR({
      pin,
      ussdCode
    });
  };

  return (
    <div className="glass-card w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-primary-700 mb-6">Generate Airtime Voucher QR Code</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="pin" className="block text-sm font-medium mb-2">
            Voucher PIN:
          </label>
          <input
            type="text"
            id="pin"
            className="input-field"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter airtime voucher PIN"
            maxLength={16}
          />
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-error flex items-center"
            >
              <AlertCircle size={16} className="mr-1" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
        </div>
        
        {pin && (
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium mb-1">Preview USSD Code:</label>
            <div className="font-mono text-lg text-primary-700 font-semibold">
              {formatUSSDCode(pin)}
            </div>
          </div>
        )}
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="btn-primary w-full"
        >
          {showSuccess ? (
            <span className="flex items-center justify-center">
              <CheckCircle2 size={18} className="mr-2" />
              Generated!
            </span>
          ) : 'Generate QR Code'}
        </motion.button>
      </form>
    </div>
  );
};

export default PinInput;