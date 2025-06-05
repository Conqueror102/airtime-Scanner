import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import PinInput from '../components/admin/PinInput';
import QRCodeDisplay from '../components/admin/QRCodeDisplay';
import AdminVoucherScanner from '../components/admin/AdminVoucherScanner';
import { VoucherData } from '../types';
import { motion } from 'framer-motion';
import { QrCode } from 'lucide-react';

const GeneratePage: React.FC = () => {
  const [voucherData, setVoucherData] = useState<VoucherData | null>(null);
  const [useScanner, setUseScanner] = useState(false);

  const handleScanResult = (code: string) => {
    const [network, price, pin] = code.split('|'); // Assuming scanned code is "MTN|500|*555*1234567890#"
    setVoucherData({ network, price, ussdCode: pin });
    setUseScanner(false);
  };


  const handleGenerateQR = (data: VoucherData) => {
    setVoucherData(data);
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
            <QrCode size={36} className="text-primary-700 mr-2" />
            <h1 className="text-3xl font-bold text-primary-700">
              Airtime Voucher QR Generator
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Generate QR codes for airtime voucher PINs. Users can scan these codes
            to easily recharge their phones without typing long codes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8">
        <div className="mb-4 text-right">
          <button
            className="bg-primary-700 text-white px-4 py-2 rounded"
            onClick={() => setUseScanner(!useScanner)}
          >
            {useScanner ? 'Use Manual Input Instead' : 'Scan Voucher Instead'}
          </button>
        </div>
        {useScanner ? (
          <AdminVoucherScanner onVoucherScanned={({ network, price, pin }) => setVoucherData({ network, price, ussdCode: `*555*${pin}#` })} />
        ) : (
          <PinInput onGenerateQR={handleGenerateQR} />
        )}

          {voucherData && <QRCodeDisplay voucherData={voucherData} />}
        </div>
      </div>
    </Layout>
  );
};

export default GeneratePage;