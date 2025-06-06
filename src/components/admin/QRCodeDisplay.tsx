import React, { useRef } from 'react';
import QRCode from 'react-qr-code';
import { VoucherData, NETWORKS } from '../../types';
import { Download, Copy, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';

interface QRCodeDisplayProps {
  voucherData: VoucherData | null;
}

const QRCodeDisplay: React.FC    <QRCodeDisplayProps> = ({ voucherData }) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const [copySuccess, setCopySuccess] = React.useState(false);
  
  if (!voucherData) {
    return null;
  }

  const { ussdCode, network, price } = voucherData;
  const networkInfo = network ? NETWORKS[network] : null;

  const handleDownload = async () => {
    if (qrRef.current) {
      try {
        const dataUrl = await toPng(qrRef.current, { quality: 1.0 });
        const link = document.createElement('a');
        link.download = `${networkInfo?.name || "Network"}_${price || "Unknown"}_NGN_QR.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error generating image:', error);
      }
    }
  };

  const handleCopyCode = () => {
    if (ussdCode) {
      navigator.clipboard.writeText(ussdCode)
        .then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
        });
    }
  };

  const handleShare = async () => {
    if (navigator.share && ussdCode) {
      try {
        await navigator.share({
          title: network ? `${networkInfo?.name} Airtime Voucher` : 'Airtime Voucher',
          text: `Use this code to recharge: ${ussdCode}`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopyCode();
    }
  };

  return (
    <motion.div 
      className="glass-card w-full max-w-lg mx-auto mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center mb-4">
        {network && networkInfo && (
          <div 
            className="w-8 h-8 rounded-full mr-2 flex items-center justify-center"
            style={{ backgroundColor: networkInfo.color }}
          >
            <span className="text-white font-bold text-xs">
              {networkInfo.name.substring(0, 1)}
            </span>
          </div>
        )}
        <h2 className="text-xl font-bold text-primary-700">
          {network ? `${networkInfo?.name} ` : ''}Airtime Voucher
          {price && ` - ₦${price}`}
        </h2>
      </div>

      <div className="text-center font-semibold mb-2">{networkInfo?.name} - ₦{price}</div>
      <div
        className="bg-white p-4 rounded-lg mb-4 flex flex-col items-center justify-center"
        ref={qrRef}
      >
        {/* Provider Name */}
        <div className="font-bold text-lg mb-2">
          {networkInfo?.name}
        </div>
        {/* QR Code */}
        <QRCode
          value={ussdCode || ''}
          size={200}
          level="H"
          fgColor="#012d01"
        />
        {/* Amount */}
        <div className="font-semibold text-base mt-2">
          ₦{price}
        </div>
      </div>
      <div className="text-center font-semibold mb-2">{networkInfo?.name} - ₦{price}</div>

      <div className="p-3 bg-gray-50 rounded-lg mb-4">
        <label className="block text-sm font-medium mb-1">USSD Code:</label>
        <div className="font-mono text-lg text-primary-700 font-semibold">
          {ussdCode}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          className="btn-primary flex-1 flex justify-center items-center"
        >
          <Download size={18} className="mr-2" />
          Download
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopyCode}
          className="btn-secondary flex-1 flex justify-center items-center"
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
        
        {navigator.share && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="btn-outline flex-1 flex justify-center items-center"
          >
            <Share2 size={18} className="mr-2" />
            Share
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default QRCodeDisplay;