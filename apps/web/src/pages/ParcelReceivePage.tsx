import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';
import { useScan } from '../context/ScanContext';
import { ParcelService } from '../services/api/parcel.service';
import { HttpClient } from '../services/api/http-client';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import './ParcelReceivePage.css';

interface ParcelReceivePageProps {
  type: 'incoming' | 'release';
}

export const ParcelReceivePage: React.FC<ParcelReceivePageProps> = ({ type }) => {
  const navigate = useNavigate();
  const { scannedBarcodes, clearBarcodes } = useScan();

  const [identityNum, setIdentityNum] = useState('');
  const [contact, setContact] = useState('');
  const [unitNo, setUnitNo] = useState('');
  const [trackingNumbers, setTrackingNumbers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const httpClient = new HttpClient();
  const parcelService = new ParcelService(httpClient);

  // Merge scanned barcodes when returning from ScanPage
  useEffect(() => {
    if (scannedBarcodes.length > 0) {
      setTrackingNumbers([...trackingNumbers, ...scannedBarcodes]);
      clearBarcodes();
    }
  }, [scannedBarcodes]);

  const handleDeleteBarcode = (index: number) => {
    setTrackingNumbers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!identityNum.trim() || !contact.trim() || !unitNo.trim()) {
      showErrorToast('Please fill in all required fields');
      return;
    }

    if (trackingNumbers.length === 0) {
      showErrorToast('Please add at least one barcode');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        deliveryPersonnel: {
          contactNumber: contact.trim(),
          identityNumber: identityNum.trim(),
        },
        trackingNumbers: trackingNumbers,
        unitNumber: unitNo.trim(),
        timeStamp: new Date().toISOString(),
      };

      await parcelService.createParcel(payload);

      showSuccessToast('Parcel submitted successfully!');

      // Clear form for next parcel
      setIdentityNum('');
      setContact('');
      setUnitNo('');
      setTrackingNumbers([]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to submit parcel';
      showErrorToast(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="parcel-receive-page">
      <div className="form-container">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back
        </button>

        <div className="input-grid">
          <div className="input-group">
            <input
              type="text"
              placeholder="Identity Num"
              value={identityNum}
              onChange={(e) => setIdentityNum(e.target.value)}
              className="form-input"
              disabled={isSubmitting}
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="Contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="form-input"
              disabled={isSubmitting}
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="Unit No"
              value={unitNo}
              onChange={(e) => setUnitNo(e.target.value)}
              className="form-input"
              disabled={isSubmitting}
            />
          </div>
          <div className="input-group">
            <button
              className="scan-button"
              onClick={() => navigate('/scan')}
              disabled={isSubmitting}
            >
              📷 Scan
            </button>
          </div>
        </div>

        <div className="tracking-display">
          <div className="tracking-list">
            {trackingNumbers.map((num, index) => (
              <div key={index} className="tracking-item">
                <span>{num}</span>
                <button
                  className="barcode-delete-btn"
                  onClick={() => handleDeleteBarcode(index)}
                  disabled={isSubmitting}
                  aria-label={`Delete barcode ${num}`}
                >
                  ✕
                </button>
              </div>
            ))}
            {trackingNumbers.length === 0 && (
              <div className="tracking-empty">No barcodes scanned yet</div>
            )}
          </div>
        </div>

        <Button
          label={isSubmitting ? 'Submitting...' : 'Submit'}
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        />
      </div>
    </Container>
  );
};
