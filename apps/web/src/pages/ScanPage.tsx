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
  // Quagga expects a container div as target — it injects its own <video> + canvas inside
  const cameraContainerRef = useRef<HTMLDivElement>(null);
  const quaggaInitializedRef = useRef(false);
  const scannedBarcodesRef = useRef<string[]>([]);
  const lastScannedRef = useRef<{ code: string; timestamp: number } | null>(null);

  const handleLaunchCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported. Please ensure you are using HTTPS and your browser supports camera access.');
      }

      setCameraError(false);
      setCameraActive(true);

      // Step 1: Minimal permission request — device labels are blank until permission is granted
      const permissionStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      permissionStream.getTracks().forEach(t => t.stop());

      // Step 2: Enumerate with labels now populated
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(d => d.kind === 'videoinput');
      console.log('[ScanPage] Cameras:', cameras.map(c => c.label));

      // Prefer the main rear camera: has "back"/"rear", excludes "ultra" and "tele"
      const mainRearCamera =
        cameras.find(c => {
          const l = c.label.toLowerCase();
          return (l.includes('back') || l.includes('rear')) && !l.includes('ultra') && !l.includes('tele');
        }) ||
        cameras.find(c => {
          const l = c.label.toLowerCase();
          return !l.includes('front') && !l.includes('selfie') && !l.includes('user');
        });

      console.log('[ScanPage] Selected camera:', mainRearCamera?.label ?? 'fallback (facingMode only)');

      // Wait for the camera container div to be rendered in the DOM
      await new Promise((resolve) => setTimeout(resolve, 100));

      const quaggaConstraints = mainRearCamera
        ? { deviceId: { exact: mainRearCamera.deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
        : { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } };

      // Step 3: Pass the container div as target — Quagga injects its own <video> inside it
      Quagga.init(
        {
          inputStream: {
            name: 'LiveStream',
            type: 'LiveStream',
            target: cameraContainerRef.current,
            constraints: quaggaConstraints,
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
            setCameraActive(false);
            return;
          }

          Quagga.start();
          quaggaInitializedRef.current = true;

          Quagga.onDetected((result: any) => {
            if (result.codeResult && result.codeResult.code) {
              const barcode = result.codeResult.code;
              const now = Date.now();

              // Debounce: ignore the same code within 1.5 seconds
              if (
                lastScannedRef.current &&
                lastScannedRef.current.code === barcode &&
                now - lastScannedRef.current.timestamp < 1500
              ) {
                return;
              }

              lastScannedRef.current = { code: barcode, timestamp: now };
              const validation = validateBarcode(barcode);

              if (validation.isValid) {
                if (!scannedBarcodesRef.current.includes(barcode)) {
                  setLocalBarcodes((prev) => {
                    scannedBarcodesRef.current = [...prev, barcode];
                    return scannedBarcodesRef.current;
                  });
                  playBeep();
                  showSuccessToast(`Scanned: ${barcode}`);
                } else {
                  showErrorToast(`Already scanned: ${barcode}`);
                }
              } else {
                showErrorToast(validation.error || 'Invalid barcode format');
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
      showErrorToast(`Already scanned: ${fallbackInput}`);
    }
  };

  const handleDeleteBarcode = (index: number) => {
    setLocalBarcodes((prev) => prev.filter((_, i) => i !== index));
  };

  const stopCamera = () => {
    if (quaggaInitializedRef.current) {
      Quagga.stop();
      quaggaInitializedRef.current = false;
    }
  };

  const handleDone = () => {
    stopCamera();
    setCameraActive(false);
    setScannedBarcodes(scannedBarcodes);
    navigate(returnPath);
  };

  useEffect(() => {
    return () => { stopCamera(); };
  }, []);

  return (
    <Container className="scan-page">
      <button className="back-button" onClick={() => { stopCamera(); navigate(returnPath); }}>
        ← Back
      </button>

      {!cameraActive && !cameraError && (
        <div className="scan-controls">
          <p>Click below to launch camera and scan barcodes</p>
          <Button label="📷 Launch Camera" variant="primary" onClick={handleLaunchCamera} />
        </div>
      )}

      {/* Always rendered so cameraContainerRef is in the DOM before Quagga.init runs */}
      <div className="camera-section" style={{ display: cameraActive ? 'flex' : 'none' }}>
        <div className="video-container" ref={cameraContainerRef} />
      </div>

      {cameraError && (
        <div className="fallback-section">
          <p>⚠️ Camera not available. Enter barcodes manually:</p>
          <div className="fallback-input-group">
            <input
              type="text"
              placeholder="Enter barcode"
              value={fallbackInput}
              onChange={(e) => setFallbackInput(e.target.value)}
              onKeyPress={(e) => { if (e.key === 'Enter') handleFallbackAdd(); }}
              className="fallback-input"
              autoFocus
            />
            <button className="fallback-add-btn" onClick={handleFallbackAdd}>
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
