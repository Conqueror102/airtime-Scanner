import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import QRScanner from '../components/user/QRScanner';
import LiveOcrScanner from '../components/user/LiveOcrScanner';
import ScannedResult from '../components/user/ScannedResult';
import { motion } from 'framer-motion';
import { Scan, QrCode, TextCursorInput } from 'lucide-react';

const ScanPage: React.FC = () => {
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [scannerMode, setScannerMode] = useState<'qr' | 'ocr'>('qr');

  const handleCodeScanned = (code: string) => {
    setScannedCode(code);
  };

  const handleScanAgain = () => {
    setScannedCode(null);
  };

  const handleCopy = () => {
    if (scannedCode) {
      navigator.clipboard.writeText(scannedCode);
    }
  };

  const handleDial = () => {
    if (scannedCode) {
      window.open(`tel:${scannedCode}`);
    }
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
              Airtime Voucher Scanner
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Scan a physical airtime card or its QR code to recharge your phone. Copy or dial the code instantly.
          </p>
        </motion.div>

        <div className="flex justify-center mb-6 gap-4">
          <button
            className={`flex items-center px-4 py-2 rounded-md border ${scannerMode === 'qr' ? 'bg-primary-700 text-white' : 'bg-white text-primary-700 border-primary-700'}`}
            onClick={() => { setScannerMode('qr'); setScannedCode(null); }}
          >
            <QrCode className="mr-2" /> QR Scan
          </button>
          <button
            className={`flex items-center px-4 py-2 rounded-md border ${scannerMode === 'ocr' ? 'bg-primary-700 text-white' : 'bg-white text-primary-700 border-primary-700'}`}
            onClick={() => { setScannerMode('ocr'); setScannedCode(null); }}
          >
            <TextCursorInput className="mr-2" /> Card Scan (OCR)
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {scannedCode ? (
            <div className="flex flex-col items-center gap-4">
              <ScannedResult code={scannedCode} onScanAgain={handleScanAgain} />
              <div className="flex gap-4">
                <button
                  className="px-4 py-2 bg-primary-700 text-white rounded-md"
                  onClick={handleCopy}
                >
                  Copy
                </button>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-md"
                  onClick={handleDial}
                >
                  Dial
                </button>
              </div>
            </div>
          ) : (
            <>
              {scannerMode === 'qr' && (
                <QRScanner onCodeScanned={handleCodeScanned} />
              )}
              {scannerMode === 'ocr' && (
                <div className="flex justify-center">
                  <div className="w-full max-w-md p-4 bg-gray-50 rounded-lg shadow">
                    <LiveOcrScanner onCodeScanned={handleCodeScanned} />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ScanPage;