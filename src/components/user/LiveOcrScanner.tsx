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
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    const initCamera = async () => {
      try {
        setStatus('Initializing camera...');
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Wait for video to be ready
          videoRef.current.onloadedmetadata = () => {
            setCameraReady(true);
            setStatus('Camera ready. Position your airtime card in view and click "Start Scanning".');
          };
        }
      } catch (err) {
        setError("Camera access denied or unavailable.");
        setStatus('');
        setCameraReady(false);
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

      // Define the thin horizontal window (e.g., 45% from top, 10% height)
      const windowY = Math.floor(height * 0.45);
      const windowHeight = Math.floor(height * 0.10);

      // Set canvas to window size and draw only the window area
      canvas.width = width;
      canvas.height = windowHeight;
      ctx.drawImage(
        video,
        0, windowY / scale, // sx, sy (source y is scaled back up)
        video.videoWidth, video.videoHeight * 0.10, // sWidth, sHeight (10% of video height)
        0, 0, // dx, dy
        width, windowHeight // dWidth, dHeight
      );

      // Convert to black and white
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const avg = (imageData.data[i] + imageData.data[i+1] + imageData.data[i+2]) / 3;
        const value = avg > 128 ? 255 : 0; // Simple threshold
        imageData.data[i] = imageData.data[i+1] = imageData.data[i+2] = value;
      }
      ctx.putImageData(imageData, 0, 0);

      setStatus('Scanning for PIN...');
      try {
        const { data: { text } } = await Tesseract.recognize(canvas, 'eng', {
          tessedit_char_whitelist: '0123456789',
          tessedit_pageseg_mode: Tesseract.PSM.SINGLE_LINE,
        });
        const matches = text.match(/\d{8,}/g); // 8+ digits
        let pin = '';
        if (matches && matches.length > 0) {
          pin = matches.reduce((a, b) => (a.length > b.length ? a : b));
        }
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
      <div className="relative w-full h-auto mb-4">
        <video
          ref={videoRef}
          autoPlay
          className="w-full h-auto rounded"
          style={{ objectFit: 'cover' }}
        />
        {/* Overlay with thinner horizontal window */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,0) 47%, rgba(0,0,0,0) 53%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0.6) 100%)',
            borderRadius: '0.5rem',
          }}
        />
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: '45%',
            width: '80%',
            height: '10%',
            border: '2px dashed #22c55e',
            borderRadius: '0.5rem',
            boxSizing: 'border-box',
          }}
        />
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {error && (
        <div className="mb-2 text-red-600 font-medium">{error}</div>
      )}
      <div className="mb-2 text-sm text-gray-600">
        {status || 'Position your airtime card in front of the camera and click "Start Scanning".'}
      </div>
      <button
        className="bg-primary-700 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={() => {
          setDetected('');
          setScanning(!scanning);
          setStatus(!scanning ? 'Scanning for PIN...' : 'Scanning stopped.');
        }}
        disabled={!!error || !cameraReady}
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
