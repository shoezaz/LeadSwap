import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import './Header.css';

export default function Header() {
  const location = useLocation();
  const { openRegisterModal } = useModal();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAuthClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    openRegisterModal();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <nav aria-label="Main navigation" className="header-nav">
        <div className="header-logo">
          <Link to="/" className="logo-link" onClick={closeMobileMenu}>
            <div className="logo">
              <img src="/logo.png" alt="Enrich" />
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="header-nav-center">
          <nav aria-label="Main" className="nav-main">
            <div className="nav-wrapper">
              <ul className="nav-list">
                <li className="nav-item">
                  <Link
                    to="/pricing"
                    className={`nav-link ${location.pathname === '/pricing' ? 'active' : ''}`}
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="header-actions">
          <div>
            <button onClick={handleAuthClick} className="signin-link">Sign in</button>
            <button onClick={handleAuthClick} className="signup-button">Try for Free</button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`mobile-menu-button ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={closeMobileMenu}
      />

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <ul className="mobile-nav-list">
            <li>
              <Link
                to="/"
                className={`mobile-nav-link ${location.pathname === '/' ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/pricing"
                className={`mobile-nav-link ${location.pathname === '/pricing' ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                Pricing
              </Link>
            </li>
          </ul>
          <div className="mobile-actions">
            <button onClick={handleAuthClick} className="mobile-signin-link">
              Sign in
            </button>
            <button onClick={handleAuthClick} className="mobile-signup-button">
              Try for Free
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
