
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

interface Props {
  onPinExtracted: (ussd: string) => void;
  label?: string;
}

const OcrScanner: React.FC<Props> = ({ onPinExtracted, label = "Upload Voucher Image" }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    Tesseract.recognize(file, 'eng', {
      logger: m => console.log(m)
    }).then(({ data: { text } }) => {
      const pin = text.replace(/[^0-9]/g, '').slice(0, 16);
      if (pin.length < 10) {
        setError("Could not detect a valid PIN. Please try again.");
        setLoading(false);
        return;
      }
      const ussd = `*555*${pin}#`;
      onPinExtracted(ussd);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setError("OCR failed. Try again.");
      setLoading(false);
    });
  };

  return (
    <div className="p-4 border rounded bg-white shadow mt-4">
      <label className="block font-semibold mb-2">{label}</label>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {loading && <p className="mt-2 text-blue-600">Scanning...</p>}
      {error && <p className="mt-2 text-red-600">{error}</p>}
    </div>
  );
};

export default OcrScanner;
