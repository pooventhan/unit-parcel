import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// @ts-ignore
import Quagga from 'quagga';
import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';
import { useScan } from '../context/ScanContext';
import { playBeep } from '../utils/audio';
import { validateBarcode } from '../utils/barcode-validator';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import './ScanPage.css';

export const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const { setScannedBarcodes, returnPath } = useScan();

  const [scannedBarcodes, setLocalBarcodes] = useState<string[]>([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [fallbackInput, setFallbackInput] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const quaggaInitializedRef = useRef(false);
  const scannedBarcodesRef = useRef<string[]>([]);
  const lastScannedRef = useRef<{ code: string; timestamp: number } | null>(null);

  const handleLaunchCamera = async () => {
    try {
      console.log('[ScanPage] Launch camera clicked');

      // Check if mediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported. Please ensure: 1) You\'re using HTTPS (not HTTP), 2) Your browser supports camera access, 3) You have not denied camera permissions in browser settings');
      }

      setCameraError(false);
      setCameraActive(true);

      console.log('[ScanPage] Requesting camera permission...');

      // Get available cameras and prefer the primary wide-angle lens
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoCameras = devices.filter(device => device.kind === 'videoinput');
      console.log('[ScanPage] Available cameras:', videoCameras.length);

      // Try to use the first/primary camera (usually the main lens)
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
          ...(videoCameras.length > 0 && { deviceId: { exact: videoCameras[0].deviceId } }),
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      console.log('[ScanPage] Camera permission granted, received stream:', stream);
      // Wait for video element to be rendered
      await new Promise((resolve) => setTimeout(resolve, 0));

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Initialize Quagga for barcode detection
      Quagga.init(
        {
          inputStream: {
            name: 'LiveStream',
            type: 'LiveStream',
            target: videoRef.current,
            constraints: {
              facingMode: 'environment',
              autofocus: true,
              autoFocus: true,
              focusMode: 'continuous',
            },
          },
          decoder: {
            readers: ['code_128_reader'],
            debug: {
              showCanvas: false,
              showPattern: false,
            },
          },
        },
        (err: any) => {
          if (err) {
            console.error('Quagga initialization error:', err);
            setCameraError(true);
            setFallbackInput('');
            return;
          }

          Quagga.start();
          quaggaInitializedRef.current = true;
          setCameraActive(true);

          // Handle barcode detection with debouncing
          Quagga.onDetected((result: any) => {
            if (result.codeResult && result.codeResult.code) {
              const barcode = result.codeResult.code;
              const now = Date.now();

              // Debounce: ignore if same code was scanned within 1 second
              if (lastScannedRef.current &&
                  lastScannedRef.current.code === barcode &&
                  now - lastScannedRef.current.timestamp < 1000) {
                return;
              }

              lastScannedRef.current = { code: barcode, timestamp: now };
              const validation = validateBarcode(barcode);

              if (validation.isValid) {
                // Check for duplicates
                if (!scannedBarcodesRef.current.includes(barcode)) {
                  setLocalBarcodes((prev) => {
                    scannedBarcodesRef.current = [...prev, barcode];
                    return scannedBarcodesRef.current;
                  });
                  playBeep();
                  showSuccessToast(`Scanned: ${barcode}`);
                } else {
                  showErrorToast(`Barcode already scanned: ${barcode}`);
                }
              } else {
                showErrorToast(
                  validation.error || 'Invalid barcode format'
                );
              }
            }
          });
        }
      );
    } catch (error) {
      console.error('Camera access error:', error);
      setCameraActive(false);
      setCameraError(true);
      showErrorToast('Camera access denied. Using manual entry instead.');
      setFallbackInput('');
    }
  };

  const handleFallbackAdd = () => {
    if (!fallbackInput.trim()) {
      showErrorToast('Please enter a barcode');
      return;
    }

    const validation = validateBarcode(fallbackInput);
    if (!validation.isValid) {
      showErrorToast(validation.error || 'Invalid barcode format');
      return;
    }

    if (!scannedBarcodesRef.current.includes(fallbackInput)) {
      setLocalBarcodes((prev) => {
        scannedBarcodesRef.current = [...prev, fallbackInput];
        return scannedBarcodesRef.current;
      });
      playBeep();
      showSuccessToast(`Added: ${fallbackInput}`);
      setFallbackInput('');
    } else {
      showErrorToast(`Barcode already scanned: ${fallbackInput}`);
    }
  };

  const handleDeleteBarcode = (index: number) => {
    setLocalBarcodes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDone = () => {
    // Stop quagga if running
    if (quaggaInitializedRef.current && cameraActive) {
      Quagga.stop();
      quaggaInitializedRef.current = false;
      setCameraActive(false);
    }

    // Stop camera stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }

    // Update context with scanned barcodes and navigate back
    setScannedBarcodes(scannedBarcodes);
    navigate(returnPath);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (quaggaInitializedRef.current && cameraActive) {
        Quagga.stop();
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraActive]);

  return (
    <Container className="scan-page">
      <button className="back-button" onClick={() => navigate(returnPath)}>
        ← Back
      </button>

      {!cameraActive && !cameraError && (
        <div className="scan-controls">
          <p>Click below to launch camera and scan barcodes</p>
          <Button label="📷 Launch Camera" variant="primary" onClick={handleLaunchCamera} />
        </div>
      )}

      {cameraActive && (
        <div className="camera-section">
          <div className="video-container">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      )}

      {cameraError && (
        <div className="fallback-section">
          <p>⚠️ Camera not available. Enter barcodes manually:</p>
          <div className="fallback-input-group">
            <input
              type="text"
              placeholder="Enter barcode"
              value={fallbackInput}
              onChange={(e) => setFallbackInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleFallbackAdd();
                }
              }}
              className="fallback-input"
              autoFocus
            />
            <button
              className="fallback-add-btn"
              onClick={handleFallbackAdd}
            >
              Add
            </button>
          </div>
        </div>
      )}

      {scannedBarcodes.length > 0 && (
        <div className="scan-preview">
          <h3>Scanned Barcodes ({scannedBarcodes.length})</h3>
          <div className="barcode-list">
            {scannedBarcodes.map((barcode, index) => (
              <div key={index} className="barcode-item">
                <span>{barcode}</span>
                <button
                  className="barcode-delete-btn"
                  onClick={() => handleDeleteBarcode(index)}
                  aria-label={`Delete barcode ${barcode}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button
        label={scannedBarcodes.length === 0 ? 'Done (No barcodes)' : `Done (${scannedBarcodes.length} barcodes)`}
        variant="primary"
        onClick={handleDone}
      />
    </Container>
  );
};
