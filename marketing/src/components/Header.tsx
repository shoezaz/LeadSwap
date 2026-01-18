import { Link, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <nav aria-label="Main navigation" className="header-nav">
        <div className="header-logo">
          <Link to="/" className="logo-link">
            <div className="logo">
              <img src="/logo.png" alt="Enrich" className="w-8 h-8 rounded-lg" />
            </div>
          </Link>
        </div>
        <div className="header-nav-center">
          <nav aria-label="Main" className="nav-main">
            <div className="nav-wrapper">
              <ul className="nav-list">
                <li className="nav-item">
                  <button className="nav-button">
                    Resources
                    <div className="chevron-icon">
                      <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Ff268401a75184f63ab133ed9ef811202d15ec1cb.svg?generation=1768049314233726&alt=media" alt="" />
                    </div>
                  </button>
                </li>
                <li className="nav-item">
                  <Link to="/enterprise" className="nav-link">Enterprise</Link>
                </li>
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
        <div className="header-actions">
          <div>
            <a href="/signin" className="signin-link">Sign in</a>
            <a href="/signup" className="signup-button">Try for Free</a>
          </div>
        </div>
      </nav>
    </header>
  );
}
