import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import PricingPage from './pages/PricingPage';
import { ModalProvider } from './context/ModalContext';
import { RegisterModal } from './components/RegisterModal';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <ModalProvider>
        <div className="app">
          <Header />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
          </Routes>
          <Footer />
          <RegisterModal />
        </div>
      </ModalProvider>
    </Router>
  );
}

export default App;
