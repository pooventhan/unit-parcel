import { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { ParcelReceivePage } from './pages/ParcelReceivePage';
import './App.css';

type Page = 'landing' | 'incoming' | 'release';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  const renderPage = () => {
    switch (currentPage) {
      case 'incoming':
        return (
          <ParcelReceivePage onBack={() => setCurrentPage('landing')} />
        );
      case 'release':
        return (
          <ParcelReceivePage onBack={() => setCurrentPage('landing')} />
        );
      case 'landing':
      default:
        return (
          <LandingPage
            onNavigateIncoming={() => setCurrentPage('incoming')}
            onNavigateRelease={() => setCurrentPage('release')}
          />
        );
    }
  };

  return renderPage();
}

export default App;
