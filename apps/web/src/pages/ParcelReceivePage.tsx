import React, { useState } from 'react';
import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';
import './ParcelReceivePage.css';

interface ParcelReceivePageProps {
  onBack?: () => void;
}

export const ParcelReceivePage: React.FC<ParcelReceivePageProps> = ({ onBack }) => {
  const [identityNum, setIdentityNum] = useState('');
  const [contact, setContact] = useState('');
  const [unitNo, setUnitNo] = useState('');
  const [trackingNumbers, setTrackingNumbers] = useState<string[]>([]);
  const [scanInput, setScanInput] = useState('');

  const handleScan = () => {
    if (scanInput.trim()) {
      setTrackingNumbers([...trackingNumbers, scanInput.trim()]);
      setScanInput('');
    }
  };

  const handleSubmit = () => {
    console.log({
      identityNum,
      contact,
      unitNo,
      trackingNumbers,
    });
    // TODO: Call parcel service to submit
  };

  return (
    <Container className="parcel-receive-page">
      <div className="form-container">
        {onBack && (
          <button className="back-button" onClick={onBack}>
            ← Back
          </button>
        )}
        <div className="input-grid">
          <div className="input-group">
            <input
              type="text"
              placeholder="Identity Num"
              value={identityNum}
              onChange={(e) => setIdentityNum(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="Contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="Unit No"
              value={unitNo}
              onChange={(e) => setUnitNo(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="Scan"
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleScan();
                }
              }}
              className="form-input"
            />
          </div>
        </div>

        <div className="tracking-display">
          <div className="tracking-list">
            {trackingNumbers.map((num, index) => (
              <div key={index} className="tracking-item">
                {num}
              </div>
            ))}
          </div>
        </div>

        <Button label="Submit" variant="primary" onClick={handleSubmit} />
      </div>
    </Container>
  );
};
