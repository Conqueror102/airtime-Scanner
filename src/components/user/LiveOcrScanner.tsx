import React, { useEffect, useRef, useState } from 'react';
import Tesseract from 'tesseract.js';

const beep = () => {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(1000, ctx.currentTime);
  oscillator.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.15);
};

const LiveOcrScanner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detected, setDetected] = useState<string>('');
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    };
    initCamera();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (scanning) {
      interval = setInterval(() => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        Tesseract.recognize(canvas, 'eng')
          .then(({ data: { text } }) => {
            const pin = text.replace(/[^0-9]/g, '').slice(0, 16);
            if (pin.length >= 10) {
              const ussd = `*311*${pin}#`;
              if (ussd !== detected) {
                setDetected(ussd);
                beep();
              }
              setScanning(false); // stop once detected
            }
          })
          .catch((err) => console.error("OCR error:", err));
      }, 3000);
    }

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [scanning, detected]);

  const handleCopy = () => {
    if (detected) {
      navigator.clipboard.writeText(detected);
    }
  };

  const handleDial = () => {
    if (detected) {
      window.open(`tel:${detected}`);
    }
  };

  return (
    <div className="p-4 bg-white border rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Live PIN Scanner</h3>
      <video ref={videoRef} autoPlay className="w-full h-auto rounded mb-4" />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <button
        className="bg-primary-700 text-white px-4 py-2 rounded"
        onClick={() => setScanning(!scanning)}
      >
        {scanning ? 'Stop Scanning' : 'Start Scanning'}
      </button>
      {detected && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <p className="font-medium">Detected USSD Code:</p>
          <code className="text-xl text-green-700">{detected}</code>
          <div className="flex gap-2 mt-2">
            <button
              className="px-4 py-2 bg-primary-700 text-white rounded"
              onClick={handleCopy}
            >
              Copy
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={handleDial}
            >
              Dial
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveOcrScanner;
