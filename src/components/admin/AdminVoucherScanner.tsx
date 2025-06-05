
import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface AdminVoucherScannerProps {
  onVoucherScanned: (voucher: { network: string; price: string; pin: string }) => void;
}

const AdminVoucherScanner: React.FC<AdminVoucherScannerProps> = ({ onVoucherScanned }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'admin-qr-reader',
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      (decodedText: string) => {
        const [network, price, pin] = decodedText.split('|');
        if (network && price && pin) {
          onVoucherScanned({ network, price, pin });
        } else {
          alert('Invalid format. Use: NETWORK|PRICE|PIN');
        }
        scanner.clear();
      },
      (error: any) => {
        // console.log('QR Scan error', error);
      }
    );

    return () => {
      scanner.clear().catch((err) => console.error('Failed to clear scanner', err));
    };
  }, [onVoucherScanned]);

  return (
    <div className="p-4 border rounded bg-white shadow">
      <h3 className="text-lg font-semibold mb-2">Scan Voucher Card (Admin)</h3>
      <div id="admin-qr-reader" />
    </div>
  );
};

export default AdminVoucherScanner;
