import React from 'react';
import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';
import './LandingPage.css';

interface LandingPageProps {
  onNavigateIncoming?: () => void;
  onNavigateRelease?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateIncoming,
  onNavigateRelease,
}) => {
  return (
    <Container className="landing-page">
      <div className="buttons-container">
        <Button label="Incoming" variant="primary" onClick={onNavigateIncoming} />
        <Button label="Release" variant="primary" onClick={onNavigateRelease} />
      </div>
    </Container>
  );
};
