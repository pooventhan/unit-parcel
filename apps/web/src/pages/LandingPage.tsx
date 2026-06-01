import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';
import './LandingPage.css';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container className="landing-page">
      <div className="buttons-container">
        <Button label="⬇️ 📦 Incoming" variant="primary" onClick={() => navigate('/incoming')} />
        <Button label="⬆️ 📦 Release" variant="primary" onClick={() => navigate('/release')} />
      </div>
    </Container>
  );
};
