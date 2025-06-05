import React, { useState } from 'react';
import { VoucherData, formatUSSDCode, Network, NETWORKS } from '../../types';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, ScanLine } from 'lucide-react';
import QRScanner from '../user/QRScanner';

interface PinInputProps {
  onGenerateQR: (data: VoucherData) => void;
}

const PinInput: React.FC<PinInputProps> = ({ onGenerateQR }) => {
  const [pin, setPin] = useState('');
  const [price, setPrice] = useState('');
  const [network, setNetwork] = useState<Network>('mtn');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!pin.trim()) {
      setError('Please enter a PIN');
      return;
    }

    if (!/^\d+$/.test(pin)) {
      setError('PIN should contain only digits');
      return;
    }

    if (pin.length < 10 || pin.length > 16) {
      setError('PIN should be between 10-16 digits');
      return;
    }

    if (!price.trim()) {
      setError('Please enter the voucher price');
      return;
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setError('Please enter a valid price');
      return;
    }

    const ussdCode = formatUSSDCode(pin);
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
    
    onGenerateQR({
      pin,
      ussdCode,
      price: priceValue,
      network
    });
  };

  const handleScannedCode = (code: string) => {
    // Extract PIN from USSD code if needed
    const pin = code.replace(/[*#]/g, '').replace('311', '');
    setPin(pin);
    setShowScanner(false);
  };

  if (showScanner) {
    return (
      <div className="glass-card w-full max-w-lg mx-auto">
        <QRScanner onCodeScanned={handleScannedCode} />
        <button 
          onClick={() => setShowScanner(false)}
          className="btn-outline w-full mt-4"
        >
          Cancel Scanning
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-primary-700 mb-6">Generate Airtime Voucher QR Code</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Network Provider:</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(Object.keys(NETWORKS) as Network[]).map((net) => (
              <motion.button
                key={net}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setNetwork(net)}
                className={`${
                  network === net 
                    ? 'ring-2 ring-offset-2 ring-primary-700 bg-white shadow-md' 
                    : 'bg-white bg-opacity-50 hover:bg-opacity-70'
                } p-4 rounded-lg flex flex-col items-center justify-center transition-all duration-200`}
              >
                <div 
                  className="w-10 h-10 rounded-full mb-2 flex items-center justify-center"
                  style={{ backgroundColor: NETWORKS[net].color }}
                >
                  <span className="text-white font-bold text-xs">
                    {NETWORKS[net].name.substring(0, 1)}
                  </span>
                </div>
                <span className="font-medium text-sm">{NETWORKS[net].name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="pin" className="block text-sm font-medium">
              Voucher PIN:
            </label>
            <button
              type="button"
              onClick={() => setShowScanner(true)}
              className="text-sm text-primary-700 hover:text-primary-600 flex items-center"
            >
              <ScanLine size={16} className="mr-1" />
              Scan PIN
            </button>
          </div>
          <input
            type="text"
            id="pin"
            className="input-field"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter airtime voucher PIN"
            maxLength={16}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="price" className="block text-sm font-medium mb-2">
            Voucher Price (₦):
          </label>
          <input
            type="number"
            id="price"
            className="input-field"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter voucher price"
            min="0"
            step="50"
          />
        </div>
        
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