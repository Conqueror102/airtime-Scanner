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
  const [status, setStatus] = useState<string>(''); // For user feedback
  const [error, setError] = useState<string | null>(null);
  const runningRef = useRef(false);
  const scanAttempts = useRef(0);

  useEffect(() => {
    const initCamera = async () => {
      try {
        setStatus('Initializing camera...');
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) videoRef.current.srcObject = stream;
        setStatus('Camera ready. Position your airtime card in view.');
      } catch (err) {
        setError("Camera access denied or unavailable.");
        setStatus('');
      }
    };
    initCamera();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const doOcr = async () => {
      if (runningRef.current) return;
      runningRef.current = true;

      if (!videoRef.current || !canvasRef.current) {
        runningRef.current = false;
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        runningRef.current = false;
        return;
      }

      // Downscale for faster OCR
      const scale = 0.5;
      const width = Math.floor(video.videoWidth * scale);
      const height = Math.floor(video.videoHeight * scale);
      if (width === 0 || height === 0) {
        runningRef.current = false;
        return;
      }
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(video, 0, 0, width, height);

      setStatus('Scanning for PIN...');
      try {
        const { data: { text } } = await Tesseract.recognize(canvas, 'eng');
        const pin = text.replace(/[^0-9]/g, '').slice(0, 16);
        scanAttempts.current += 1;
        if (pin.length >= 10) {
          const ussd = `*311*${pin}#`;
          if (ussd !== detected) {
            setDetected(ussd);
            setStatus('PIN detected!');
            beep();
          }
          setScanning(false); // stop once detected
        } else if (scanAttempts.current > 5) {
          setStatus('No PIN detected. Try adjusting the card position or lighting.');
        } else {
          setStatus('Scanning for PIN...');
        }
      } catch (err) {
        setStatus('Error during scan. Please try again.');
        console.error("OCR error:", err);
      }
      runningRef.current = false;
    };

    if (scanning) {
      scanAttempts.current = 0;
      setStatus('Scanning for PIN...');
      interval = setInterval(doOcr, 1000); // 1s interval
    }

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [scanning, detected]);

  const handleCopy = () => {
    if (detected) {
      navigator.clipboard.writeText(detected);
      setStatus('Copied to clipboard!');
    }
  };

  const handleDial = () => {
    if (detected) {
      window.open(`tel:${detected}`);
      setStatus('Dialing...');
    }
  };

  return (
    <div className="p-4 bg-white border rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Live PIN Scanner</h3>
      <video ref={videoRef} autoPlay className="w-full h-auto rounded mb-4" />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {error && (
        <div className="mb-2 text-red-600 font-medium">{error}</div>
      )}
      <div className="mb-2 text-sm text-gray-600">
        {status || 'Position your airtime card in front of the camera and click "Start Scanning".'}
      </div>
      <button
        className="bg-primary-700 text-white px-4 py-2 rounded"
        onClick={() => {
          setDetected('');
          setScanning(!scanning);
          setStatus(!scanning ? 'Scanning for PIN...' : 'Scanning stopped.');
        }}
        disabled={!!error}
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
