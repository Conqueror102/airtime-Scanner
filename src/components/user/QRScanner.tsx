import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import { motion } from 'framer-motion';
import { Camera, CameraOff, RefreshCw } from 'lucide-react';

interface QRScannerProps {
  onCodeScanned: (code: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onCodeScanned }) => {
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [isCameraSupported, setIsCameraSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const webcamRef = useRef<Webcam>(null);
  const scanInterval = useRef<number | null>(null);

  const enableCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      setIsCameraEnabled(true);
      setScanning(true);
    } catch (err) {
      if (err instanceof Error) {
        console.error('Camera permission error:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setHasPermission(false);
          setError('Camera permission denied. Please allow camera access to scan codes.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setIsCameraSupported(false);
          setError('No camera found on this device.');
        } else {
          setError('Error accessing the camera: ' + err.message);
        }
      } else {
        setError('An unknown error occurred while accessing the camera.');
      }
    }
  };

  const disableCamera = () => {
    setIsCameraEnabled(false);
    setScanning(false);
    if (scanInterval.current) {
      window.clearInterval(scanInterval.current);
      scanInterval.current = null;
    }
  };

  const scanQRCode = useCallback(() => {
    if (webcamRef.current && scanning && !isProcessing) {
      const screenshot = webcamRef.current.getScreenshot();

      if (screenshot) {
        const canvas = document.createElement('canvas');
        const image = new Image();

        image.onload = () => {
          canvas.width = image.width;
          canvas.height = image.height;
          const ctx = canvas.getContext('2d');

          if (ctx) {
            ctx.drawImage(image, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'dontInvert',
            });

            if (code) {
              disableCamera();
              onCodeScanned(code.data);
            }
          }
        };

        image.src = screenshot;
      }
    }
  }, [scanning, onCodeScanned, isProcessing]);

  useEffect(() => {
    if (scanning && isCameraEnabled) {
      scanInterval.current = window.setInterval(scanQRCode, 500) as unknown as number;
      return () => {
        if (scanInterval.current) {
          window.clearInterval(scanInterval.current);
          scanInterval.current = null;
        }
      };
    }
  }, [scanning, isCameraEnabled, scanQRCode]);

  if (!isCameraSupported) {
    return (
      <div className="glass-card text-center">
        <CameraOff className="mx-auto mb-4 text-error" size={48} />
        <h3 className="text-xl font-bold mb-2">Camera Not Supported</h3>
        <p className="mb-4">This device doesn't have a camera or it's not accessible.</p>
        <p className="text-sm">Please try scanning on a device with a camera.</p>
      </div>
    );
  }

  return (
    <div className="glass-card w-full max-w-lg mx-auto text-center">
      <h2 className="text-xl font-bold text-primary-700 mb-6">
        Scan QR Code
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-error bg-opacity-10 text-error rounded-lg">
          {error}
        </div>
      )}

      {isCameraEnabled ? (
        <div className="relative overflow-hidden rounded-lg mb-4">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              facingMode: 'environment',
            }}
            className="w-full"
          />
          <div className="absolute inset-0 border-2 border-secondary-500 border-opacity-70 rounded-lg" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 border-2 border-primary-500 rounded-lg" />
          </div>
          {isProcessing && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <RefreshCw className="animate-spin text-white" size={32} />
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-100 rounded-lg p-8 mb-4 flex items-center justify-center">
          <Camera size={64} className="text-gray-400" />
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={isCameraEnabled ? disableCamera : enableCamera}
        className={isCameraEnabled ? "btn-outline w-full mb-4" : "btn-primary w-full mb-4"}
      >
        <div className="flex items-center justify-center">
          {isCameraEnabled ? (
            <>
              <CameraOff size={18} className="mr-2" />
              Stop Camera
            </>
          ) : (
            <>
              <Camera size={18} className="mr-2" />
              Start Camera
            </>
          )}
        </div>
      </motion.button>

      {isCameraEnabled && (
        <p className="text-sm text-gray-600">
          Position the QR code within the square frame to scan.
        </p>
      )}
    </div>
  );
};

export default QRScanner;