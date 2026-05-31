import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LandingPage } from './pages/LandingPage';
import { ParcelReceivePage } from './pages/ParcelReceivePage';
import { ScanPage } from './pages/ScanPage';
import './App.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/incoming" element={<ParcelReceivePage type="incoming" />} />
        <Route path="/release" element={<ParcelReceivePage type="release" />} />
        <Route path="/scan" element={<ScanPage />} />
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
