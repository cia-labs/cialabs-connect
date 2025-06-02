"use client";
import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Scanner } from '@yudiel/react-qr-scanner';
import BookmarkIcon from "@mui/icons-material/Bookmark";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";

export default function QRScannerPage() {
  const { uid } = useParams();
  const router = useRouter();
  const [scannedData, setScannedData] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(true);

  const handleBack = () => {
    router.back();
  };

   // Restart scanning
   const restartScanning = () => {
    setError('');
    setScannedData('');
    setIsRedirecting(false);
    setIsScanning(true);
  };

    // Handle scanner errors
    const handleError = (error) => {
      console.error('QR Scanner error:', error);
      setError(`Scanner error: ${error?.message || 'Unknown error'}`);
    };
  
    // Handle successful QR code detection
  const handleScan = (detectedCodes) => {
    if (isRedirecting || !detectedCodes || detectedCodes.length === 0) return;
    
    const result = detectedCodes[0]?.rawValue;
    if (!result) return;
    
    console.log('QR Code detected:', result);
    setScannedData(result);
    setIsScanning(false);
    setIsRedirecting(true);
    
    // Redirect after showing the detected QR data
    setTimeout(() => {
      try {
        // Check if it's a valid URL
        const url = new URL(result);
        window.location.href = result;
      } catch (e) {
        // If it's not a valid URL, treat it as a path
        if (result.startsWith('/')) {
          router.push(result);
        } else {
          router.push(`/${result}`);
        }
      }
    }, 1500);
  };

  return (
    <>
      {/* Top Gradient Background */}
      <div className="fixed -z-10 top-0 w-screen h-[10vh] blur-3xl opacity-40 bg-gradient-to-br from-[#F97070] to-[#64A5FF]"></div>
      
      <div className="w-screen h-screen text-white flex flex-col">
        {/* Header with back button and action buttons */}
        <div className="w-full h-[9vh] mt-5 flex flex-row justify-between items-center px-7 lg:px-[10vw]">
          <button
            className="flex flex-row justify-center items-center gap-2 opacity-40 transition-all active:text-lg hover:opacity-100"
            onClick={handleBack}
          >
            <KeyboardBackspaceRoundedIcon fontSize="large" /> Go Back
          </button>
          <div className="flex flex-row gap-5">
            <button>
              <SearchOutlinedIcon
                sx={{ fontSize: 28 }}
                color="inherit"
                opacity={0.4}
              />
            </button>
            <button className="text-[#9F3734]">
              <BookmarkIcon sx={{ fontSize: 28 }} htmlColor="#A03734" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-16 w-full h-fit flex flex-col justify-center items-center px-4">
          {/* Scanner Section */}
          <div className="w-80 h-80 max-w-md overflow-hidden relative rounded-lg bg-white/5 backdrop-blur-sm">
            {isScanning ? (
              <Scanner 
                onScan={handleScan}
                onError={handleError}
                constraints={{
                  facingMode: 'environment'
                }}
                styles={{
                  container: {
                    width: '100%',
                    height: '100%',
                    borderRadius: '8px'
                  }
                }}
                components={{
                  finder: false,
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800/50 rounded-lg">
                <div className="text-center">
                  <Camera className="w-16 h-16 mx-auto mb-4 opacity-40" />
                  <p className="text-gray-400">Scanner paused</p>
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="mt-6 flex flex-col items-center">
            <div className="text-2xl font-semibold text-center px-4">
              QR Code Scanner
            </div>
            <div className="mt-1 opacity-40 text-center">
              Point your camera at a QR code
            </div>
          </div>

          {/* Controls and Status */}
          <div className="mt-6 w-full max-w-md flex flex-col gap-4">
            {!isScanning && !isRedirecting && (
              <button
                onClick={restartScanning}
                className="w-full bg-[#C2F970]/20 hover:bg-[#C2F970]/30 border border-[#C2F970]/30 text-[#C2F970] font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all backdrop-blur-sm"
              >
                <Camera className="w-5 h-5" />
                Start Scanning
              </button>
            )}

            {error && (
              <div className="bg-red-900/20 border border-red-700/30 text-red-100 p-4 rounded-lg backdrop-blur-sm">
                <p className="text-sm">{error}</p>
                <button
                  onClick={restartScanning}
                  className="mt-2 text-sm text-red-300 hover:text-red-100 underline"
                >
                  Try again
                </button>
              </div>
            )}

            {scannedData && (
              <div className="bg-green-900/20 border border-green-700/30 text-green-100 p-4 rounded-lg backdrop-blur-sm">
                <h3 className="font-semibold mb-2">QR Code Detected:</h3>
                <p className="text-sm break-all opacity-80">{scannedData}</p>
                {isRedirecting && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-green-300 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-green-300">Redirecting...</p>
                  </div>
                )}
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-900/20 border border-blue-700/30 text-blue-100 p-4 rounded-lg backdrop-blur-sm">
              <p className="text-sm opacity-80">
                <strong className="text-white">Instructions:</strong>
                <br />• Allow camera access when prompted
                <br />• Point your camera at a QR code
                <br />• Keep the QR code within the scanning frame
                <br />• The app will automatically detect and redirect
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto py-4 bg-transparent">
          <div className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} CIA Labs
          </div>
        </footer>
      </div>
    </>
  );
};

