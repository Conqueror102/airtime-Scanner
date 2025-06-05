import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import QRScanner from '../components/user/QRScanner';
import ScannedResult from '../components/user/ScannedResult';
import { motion } from 'framer-motion';
import { Scan } from 'lucide-react';

const ScanPage: React.FC = () => {
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  const handleCodeScanned = (code: string) => {
    setScannedCode(code);
  };

  const handleScanAgain = () => {
    setScannedCode(null);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center mb-4">
            <Scan size={36} className="text-primary-700 mr-2" />
            <h1 className="text-3xl font-bold text-primary-700">
              Airtime Voucher QR Scanner
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Scan airtime voucher QR codes to easily recharge your phone.
            You can copy the code or dial it directly from your device.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8">
          {scannedCode ? (
            <ScannedResult code={scannedCode} onScanAgain={handleScanAgain} />
          ) : (
            <QRScanner onCodeScanned={handleCodeScanned} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ScanPage;