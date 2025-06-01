"use client";
import React, { useRef, useEffect, useState } from 'react';
import { Camera, Square } from 'lucide-react';

const QRScanner = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [error, setError] = useState('');
  const [stream, setStream] = useState(null);

  // Start camera
  const startCamera = async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsScanning(true);
      }
    } catch (err) {
      setError('Unable to access camera. Please make sure you have granted camera permissions.');
      console.error('Camera access error:', err);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  // QR Code detection function (simplified version)
  const detectQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      // Get image data from canvas
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Here you would typically use a QR code library like jsQR
      // For now, we'll simulate detection
      // In a real implementation, you'd do: const code = jsQR(imageData.data, imageData.width, imageData.height);
      
      // Simulate QR detection (you'll need to integrate jsQR or similar library)
      // if (code) {
      //   setScannedData(code.data);
      //   stopCamera();
      // }
    } catch (err) {
      console.error('QR detection error:', err);
    }
  };

  // Scan continuously when camera is active
  useEffect(() => {
    let animationId;
    
    if (isScanning && videoRef.current) {
      const scan = () => {
        detectQRCode();
        animationId = requestAnimationFrame(scan);
      };
      animationId = requestAnimationFrame(scan);
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isScanning]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-white text-center mb-6">
          QR Code Scanner
        </h1>

        {/* Camera View */}
        <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4">
          {isScanning ? (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-80 object-cover"
              />
              
              {/* Scanning Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Scanning Rectangle */}
                  <div className="w-48 h-48 border-2 border-green-400 relative">
                    {/* Corner indicators */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white"></div>
                    
                    {/* Animated scanning line */}
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-green-400 animate-pulse"></div>
                  </div>
                  
                  {/* Instruction text */}
                  <p className="text-white text-center mt-4 text-sm">
                    Position QR code within the frame
                  </p>
                </div>
              </div>

              {/* Dark overlay around scanning area */}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="w-48 h-48 bg-transparent border-2 border-transparent"
                     style={{boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'}}></div>
              </div>
            </div>
          ) : (
            <div className="w-full h-80 flex items-center justify-center bg-gray-800">
              <Camera className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4">
          {!isScanning ? (
            <button
              onClick={startCamera}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Camera className="w-5 h-5" />
              Start Scanning
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Stop Scanning
            </button>
          )}

          {error && (
            <div className="bg-red-900 border border-red-700 text-red-100 p-4 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {scannedData && (
            <div className="bg-green-900 border border-green-700 text-green-100 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">QR Code Detected:</h3>
              <p className="text-sm break-all">{scannedData}</p>
            </div>
          )}
        </div>

        {/* Note about QR detection */}
        <div className="mt-6 bg-yellow-900 border border-yellow-700 text-yellow-100 p-4 rounded-lg">
          <p className="text-sm">
            <strong>Note:</strong> To enable actual QR code detection, you'll need to integrate a QR code library like 'jsqr'. 
            This component currently shows the UI and camera functionality.
          </p>
        </div>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default QRScanner;